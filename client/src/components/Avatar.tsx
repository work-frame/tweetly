import { useState } from 'react'

interface AvatarProps {
  src: string
  alt: string
  className?: string
  clickable?: boolean
}

export function Avatar({ src, alt, className = 'h-10 w-10', clickable = false }: AvatarProps) {
  const [showFullImage, setShowFullImage] = useState(false)

  if (!src) {
    return (
      <div
        className={`${className} flex items-center justify-center rounded-full bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-600`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-2/3 w-2/3">
          <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.5c-3.3 0-9.8 1.6-9.8 4.9V22h19.6v-2.6c0-3.3-6.5-4.9-9.8-4.9z" />
        </svg>
      </div>
    )
  }

  return (
    <>
      <img
        src={src}
        alt={alt}
        onClick={clickable ? () => setShowFullImage(true) : undefined}
        className={`${className} rounded-full ${clickable ? 'cursor-pointer' : ''}`}
      />

      {showFullImage && (
        <div
          onClick={() => setShowFullImage(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          <img
            src={src}
            alt={alt}
            className="max-h-[80vh] max-w-[80vw] rounded-lg object-contain"
          />
        </div>
      )}
    </>
  )
}