'use client'

import Image from 'next/image'
import { useState } from 'react'

type AuthorProps = {
  author: {
    id: string
    full_name: string
    bio: string
    avatar_url: string | null
  } | null
}

export default function AuthorCard({ author }: AuthorProps) {
  
  const [isFollowing, setIsFollowing] = useState(false)

  if (!author) return null

  const handleFollow = async () => {
    
    setIsFollowing(!isFollowing)
  }

  return (
    <div className="rounded-2xl border border-stone-800/80 bg-stone-900/30 p-6 text-center backdrop-blur-sm">
      {author.avatar_url ? (
        <Image 
          src={author.avatar_url} 
          alt={author.full_name}
          width={64}
          height={64}
          className="mx-auto h-16 w-16 rounded-full object-cover mb-4 shadow-lg"
        />
      ) : (
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-[#d95d39] mb-4 text-xl font-bold text-white shadow-lg">
          {author.full_name.charAt(0)}
        </div>
      )}
      
      <h3 className="font-serif text-lg font-medium text-stone-200">
        {author.full_name}
      </h3>
      
      
      <p className="mt-2 text-xs leading-relaxed text-stone-400">
        {author.bio || 'No biography provided.'}
      </p>
      
      <button 
        onClick={handleFollow}
        className={`mt-5 w-full rounded-xl py-2.5 text-xs font-semibold transition ${
          isFollowing 
            ? 'bg-stone-800 text-stone-300 border border-stone-700' 
            : 'bg-[#d95d39] text-white shadow-lg shadow-[#d95d39]/10 hover:bg-[#c44f2e]'
        }`}
      >
        {isFollowing ? 'Following' : `+ Follow ${author.full_name.split(' ')[0]}`}
      </button>
    </div>
  )
}