"use client";

import { uploadImage } from "@/components/editor/ImageUpload";
import { LeftSidebar } from "@/components/editor/LeftSidebar";
import { ChangeEvent, KeyboardEvent, useRef, useState } from "react";

export default function WritePage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")

  const [status, setStatus] = useState<'Draft' | 'Published' | 'Archived'>('Draft')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isAddingTag, setIsAddingTag] = useState(false)

  const [coverImage, setCoverImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const plainText = content.replace(/<[^>]*>?/gm, '').trim();
  const wordCount = plainText.length > 0 ? plainText.split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadError(null)
    setIsUploading(true)

    try {
      const url = await uploadImage(file)
      setCoverImage(url)
    } catch (error) {
      console.log("Failed to upload image:", error)
      setUploadError("Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
      if(fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleAddTag = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("")
      setIsAddingTag(false)
    }

    if (e.key === 'Escape') {
      setTagInput("")
      setIsAddingTag(false)
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handlePublish = () => {
    const postData = {
      title,
      content,
      status,
      tags,
      coverImage,
      wordCount,
    }
  };

  const handleSaveDraft = () => {
    const postData = {
      title,
      content,
      status: 'Draft',
      tags,
      coverImage,
      wordCount,
    }
    
  };

  return (
    <div className="flex flex-col min-h-screen ">
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
      </div>
    </div>
  )
  
}

