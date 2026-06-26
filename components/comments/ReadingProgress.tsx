'use client'
import { useEffect, useState } from 'react'

export default function ReadingProgress() {
  const [completion, setCompletion] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight) {
        setCompletion(Number((window.scrollY / scrollHeight).toFixed(2)) * 100)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="flex items-center space-x-3">
      <div className="relative h-1 w-32 rounded-full bg-stone-800 overflow-hidden">
        <div 
          className="h-full rounded-full bg-[#d95d39] transition-all duration-100 ease-out" 
          style={{ width: `${completion}%` }}
        />
      </div>
      <span className="text-xs font-mono text-stone-500 w-12 text-right">
        {Math.round(completion)}% read
      </span>
    </div>
  )
}