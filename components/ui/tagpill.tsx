interface TagPillProps {
  tag: { id: string; name: string }
  selected?: boolean
  onClick?: () => void
  maxReached?: boolean
}

export function TagPill({ tag, selected, onClick, maxReached }: TagPillProps) {
  const disabled = !selected && maxReached

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1 rounded-full text-xs font-mono transition-colors
        ${selected
          ? 'bg-orange-100 text-orange-700 border border-orange-300'
          : 'bg-gray-100 text-gray-500 border border-gray-200 hover:bg-gray-200'}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      {selected ? '✓ ' : ''}{tag.name}
    </button>
  )
}