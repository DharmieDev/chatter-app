import { Editor } from "@tiptap/react";
import { Bold, Code, Heading1, Heading2, Italic, LinkIcon, Redo, UnderlineIcon, Undo } from "lucide-react";

interface EditorToolbarProps {
  editor: Editor | null;
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null;

  const ToolbarButton = ({
    onClick,
    isActive,
    disabled,
    children,
  }: {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
  }) => (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={disabled}
      className={`p-2 rounded-md transition-colors flex items-center justify-center
              ${
                isActive
                  ? "bg-zinc-700 text-zinc-100"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
            `}
    >
      {children}
    </button>
  );

  return (
    <div className="flex items-center gap-1 p-2 border-b border-zinc-800 bg-[#121212]">
          {/* Basic Formatting */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
    
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive('underline')}
          >
            <UnderlineIcon className="w-4 h-4" />
          </ToolbarButton>
    
          {/* Vertical Divider */}
          <div className="w-px h-6 bg-zinc-800 mx-2" />
    
          {/* Headings */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
          >
            <Heading1 className="w-4 h-4" />
          </ToolbarButton>
    
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
          >
            <Heading2 className="w-4 h-4" />
          </ToolbarButton>
    
          {/* Vertical Divider */}
          <div className="w-px h-6 bg-zinc-800 mx-2" />
    
          {/* Advanced Formatting */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            isActive={editor.isActive('codeBlock')}
          >
            <Code className="w-4 h-4" />
          </ToolbarButton>
    
          <ToolbarButton
            onClick={() => {
              const previousUrl = editor.getAttributes('link').href;
              const url = window.prompt('URL', previousUrl);
              if (url === null) return; // cancelled
              if (url === '') {
                editor.chain().focus().extendMarkRange('link').unsetLink().run();
                return;
              }
              editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
            }}
            isActive={editor.isActive('link')}
          >
            <LinkIcon className="w-4 h-4" />
          </ToolbarButton>
    
          {/* Spacer to push Undo/Redo to the right edge if desired, or keep them grouped */}
          <div className="flex-1" />
    
          {/* History */}
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="w-4 h-4" />
          </ToolbarButton>
    
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="w-4 h-4" />
          </ToolbarButton>
        </div>
  )
}
