"use client";

import { uploadImage } from "@/components/editor/ImageUpload";
import { LeftSidebar } from "@/components/editor/LeftSidebar";
import Loading from "@/components/Loading";
import { createClient } from "@/lib/supabase/client";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  KeyboardEvent,
  Suspense,
  useEffect,
  useRef,
  useState,
} from "react";
import { publishPost } from "./actions";

const TiptapEditor = dynamic(() => import("@/components/editor/TiptapEditor"), {
  ssr: false,
});

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export default function WritePage() {
  const supabase = createClient();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [postId, setPostId] = useState<string | null>(null);
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [status, setStatus] = useState<"Draft" | "Publish" | "Archive">(
    "Draft",
  );
  // Word status saving useState
  const [save, setSave] = useState<"idle" | "saving" | "saved">("idle");

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [seoExcerpt, setSeoExcerpt] = useState("");

  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const plainText = content.replace(/<[^>]*>?/gm, "").trim();
  const wordCount = plainText.length > 0 ? plainText.split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    getUser();
  }, [supabase]);

  useEffect(() => {
    const computedSlug = title.trim()
      ? `${generateSlug(title)}-${Math.random().toString(36).substring(2, 7)}`
      : `untitled-${Math.random().toString(36).substring(2, 7)}`;

    if (!userId || (!title.trim() && !content.trim())) return;

    setSave("idle");

    const delayDebounce = setTimeout(async () => {
      setSave("saving");

      try {
        if (postId) {
          const { error } = await supabase
            .from("posts")
            .update({
              title,
              content,
              slug: title.trim() ? generateSlug(title) : computedSlug,
              excerpt: seoExcerpt,
              cover_url: coverImage,
              read_time: readTime,
              updated_at: new Date().toISOString(),
            })
            .eq("id", postId);

          if (error) throw error;
        } else {
          const { data, error } = await supabase
            .from("posts")
            .insert([
              {
                title: title || "Untitled Story",
                content,
                slug: computedSlug,
                excerpt: seoExcerpt,
                cover_url: coverImage,
                status: "draft",
                read_time: readTime,
                author_id: userId,
              },
            ])
            .select()
            .single();

          if (error) throw error;

          if (data) {
            setPostId(data.id);
            setCurrentSlug(data.slug);
          }
        }

        setSave("saved");
        const timeoutId = setTimeout(() => setSave("idle"), 3000);
        return () => clearTimeout(timeoutId);
      } catch (error) {
        console.error("Auto-save failed:", error);
        setSave("idle");
      }
    }, 2500);

    return () => clearTimeout(delayDebounce);
  }, [
    postId,
    content,
    title,
    tags,
    coverImage,
    seoExcerpt,
    wordCount,
    readTime,
    supabase,
    userId,
  ]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);

    try {
      const url = await uploadImage(file);
      setCoverImage(url);
    } catch (error) {
      console.log("Failed to upload image:", error);
      setUploadError("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleAddTag = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
      setIsAddingTag(false);
    }

    if (e.key === "Escape") {
      setTagInput("");
      setIsAddingTag(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handlePublish = async () => {
    try {
      const savedData = await handleSaveDraft();

      if (!savedData?.id || !savedData?.slug) {
        console.error("Cannot publish: Failed to sync data to database");
        return;
      }

      await publishPost(savedData.id);

      router.push(`/main/post/${savedData.slug}`);
    } catch (error) {
      console.error("Error publishing post:", error);
    }
  };

  const handleSaveDraft = async (): Promise<{
    id: string;
    slug: string;
  } | null> => {
    try {
      let currentPostId = postId;
      let slugToUse = currentSlug;

      if (!slugToUse) {
        const randomSuffix = Math.random().toString(36).substring(2, 7);
        slugToUse = title.trim()
          ? `${generateSlug(title)}-${randomSuffix}`
          : `untitled-${randomSuffix}`;
      }

      const postPayload = {
        title: title || "Untitled Story",
        content,
        slug: slugToUse,
        excerpt: seoExcerpt,
        cover_url: coverImage,
        read_time: readTime,
        status: "draft",
        author_id: userId,
      };

      let savedData = null;

      if (currentPostId) {
        const { data, error } = await supabase
          .from("posts")
          .update(postPayload)
          .eq("id", currentPostId)
          .select("id, slug")
          .single();

        if (error) throw error;
        savedData = data;
      } else {
        const { data, error } = await supabase
          .from("posts")
          .insert([postPayload])
          .select("id, slug")
          .single();

        if (error) throw error;

        if (data) {
          currentPostId = data.id;
          setCurrentSlug(data.slug);
          setPostId(currentPostId);
        }
        savedData = data;
      }

      setSave("saved");
      setTimeout(() => setSave("idle"), 2000);

      return savedData;
    } catch (error) {
      console.error("Error saving post:", error);
      return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen ">
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        {/*MAIN EDITOR*/}
        <div className="flex-1 overflow-y-auto p-12">
          <div className="max-w-4xl mx-auto space-y-12">
            <header className="space-y-4">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Article Title"
                className="w-full bg-transparent text-5xl font-extrabold tracking-tighter leading-tight focus:outline-none placeholder:text-zinc-700"
              />
              <div className="text-zinc-500 text-base flex items-center gap-6">
                <span>{wordCount} words</span>
                <span>{readTime} min read</span>

                <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                  {save === "saving" && (
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <span>Saving draft...</span>
                    </div>
                  )}
                  {save === "saved" && (
                    <div className="flex items-center gap-1.5 text-emerald-500">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Saved</span>
                    </div>
                  )}
                </div>
              </div>
            </header>

            {/*Editor Area*/}
            <div>
              <Suspense fallback={Loading()}>
                <TiptapEditor
                  content={content}
                  onChange={(html) => setContent(html)}
                />
              </Suspense>
            </div>
          </div>
        </div>

        {/*RIGHT SIDE BAR*/}
        <aside className="w-80 border-l border-zinc-800 p-8 space-y-10 bg-[#121212] overflow-y-auto">
          {/* Status (Updated with active indicators) */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
              Status
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setStatus("Draft")}
                className={`py-2 px-2 text-sm font-medium rounded-full transition-colors border flex items-center justify-center gap-1.5
                  ${
                    status === "Draft"
                      ? "border-yellow-900/50 bg-yellow-900/10 text-yellow-500"
                      : "border-transparent text-zinc-500 hover:bg-zinc-800/50"
                  }
                `}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${status === "Draft" ? "bg-yellow-500" : "bg-transparent"}`}
                />
                Draft
              </button>
              <button
                onClick={() => setStatus("Publish")}
                className={`py-2 px-2 text-sm font-medium rounded-full transition-colors border flex items-center justify-center gap-1.5
                  ${
                    status === "Publish"
                      ? "border-emerald-900/50 bg-emerald-900/10 text-emerald-500"
                      : "border-transparent text-zinc-500 hover:bg-zinc-800/50"
                  }
                `}
              >
                {status === "Publish" && <span className="text-xs">✓</span>}
                Publish
              </button>
              <button
                onClick={() => setStatus("Archive")}
                className={`py-2 px-2 text-sm font-medium rounded-full transition-colors border
                  ${
                    status === "Archive"
                      ? "border-zinc-700 bg-zinc-800 text-zinc-300"
                      : "border-transparent text-zinc-500 hover:bg-zinc-800/50"
                  }
                `}
              >
                Archive
              </button>
            </div>
          </section>

          {/* Tags (Updated to '+ add') */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
              Tags {tags.length > 0 && `(${tags.length}/5)`}
            </h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  onClick={() => removeTag(tag)}
                  className="px-3 py-1 text-sm rounded-full bg-transparent text-orange-600/80 border border-orange-900/50 cursor-pointer hover:bg-red-900/20 hover:border-red-800 hover:text-red-400 transition-colors group flex items-center gap-1"
                >
                  {tag}
                </span>
              ))}

              {isAddingTag ? (
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  autoFocus
                  onBlur={() => {
                    setIsAddingTag(false);
                    setTagInput("");
                  }}
                  placeholder="Type & Enter"
                  className="px-3 py-1 text-sm rounded-full bg-zinc-900 text-white border border-emerald-500 focus:outline-none w-28"
                />
              ) : (
                <button
                  onClick={() => setIsAddingTag(true)}
                  disabled={tags.length >= 5}
                  className="px-3 py-1 text-sm rounded-full border border-dashed border-zinc-700 text-zinc-600 hover:text-zinc-400 transition-colors disabled:opacity-50"
                >
                  + add
                </button>
              )}
            </div>
          </section>

          {/* Cover Image */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
              Cover Image
            </h3>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative border border-dashed rounded-xl h-24 flex items-center justify-center overflow-hidden transition-colors cursor-pointer bg-zinc-900/30
                ${uploadError ? "border-red-500/50 text-red-400" : "border-zinc-800 hover:border-zinc-600 text-zinc-600"}
              `}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-5 h-5 border-2 border-zinc-500 border-t-zinc-200 rounded-full animate-spin" />
                </div>
              ) : coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm flex items-center gap-2">
                  ⊕ Upload image
                </span>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </section>

          {/* NEW: SEO Excerpt Area */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
              SEO Excerpt
            </h3>
            <textarea
              value={seoExcerpt}
              onChange={(e) => setSeoExcerpt(e.target.value)}
              placeholder="What happens when you stop tweeting and start writing..."
              className="w-full h-24 p-4 bg-transparent border border-zinc-800 rounded-xl text-sm text-zinc-300 placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600 resize-none transition-colors"
            />
          </section>

          {/* NEW: Dual Actions */}
          <div className="pt-2 flex flex-col gap-3">
            <button
              onClick={handlePublish}
              disabled={!title || content.length < 10}
              className="w-full py-3.5 text-sm font-semibold rounded-lg bg-[#e05e3a] text-white hover:bg-[#c94a29] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Publish Story &rarr;
            </button>
            <button
              onClick={handleSaveDraft}
              className="w-full py-3.5 text-sm font-medium rounded-lg border border-zinc-800 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 transition-colors"
            >
              Save as draft
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
