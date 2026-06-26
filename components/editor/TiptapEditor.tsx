"use client"
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import EditorToolbar from './EditorToolbar'
import { useEffect, useState } from 'react'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'

interface Props {
  content: string
  onChange: (html: string) => void
}

export default function TiptapEditor({ content, onChange }: Props) {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
        underline: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({ inline: false }),
      Placeholder.configure({ placeholder: 'Something on your mind?...' }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-6'
      }
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    immediatelyRender: false
  })

  if (!isMounted) {
    return <div className="h-64 bg-gray-100 rounded-md" />
  }
  
  return (
    <div className="border rounded-xl overflow-hidden">
          <EditorToolbar editor={editor} />
          <EditorContent editor={editor} />
        </div>
  )
}