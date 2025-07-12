'use client'

import { useState } from 'react'
import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from 'framer-motion'
import MemoryCard from './MemoryCard'

interface Memory {
  id: string
  title: string
  description?: string
  duration: number
  file_size: number
  created_at: string
  signedUrl?: string
  is_cloned?: boolean
  source_text?: string
}

interface SwipeableMemoryCardProps {
  memory: Memory
  onDelete: (id: string) => Promise<void>
}

export default function SwipeableMemoryCard({ memory, onDelete }: SwipeableMemoryCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const controls = useAnimation()
  const x = useMotionValue(0)
  
  // Transform values for visual feedback
  const backgroundOpacity = useTransform(x, [-200, 0, 200], [0.8, 0, 0.8])
  const deleteOpacity = useTransform(x, [-200, -50], [1, 0])
  const playOpacity = useTransform(x, [50, 200], [0, 1])
  const scale = useTransform(x, [-200, 0, 200], [0.95, 1, 0.95])

  const handleDragEnd = async (_: any, info: PanInfo) => {
    const offset = info.offset.x
    const velocity = info.velocity.x
    
    // Swipe left to delete (with confirmation)
    if (offset < -100 && velocity < -50) {
      // Animate card off screen
      await controls.start({ x: -400, opacity: 0, transition: { duration: 0.3 } })
      setIsDeleting(true)
      
      // Show confirmation dialog
      const confirmed = window.confirm(`Delete "${memory.title}"? This action cannot be undone.`)
      
      if (confirmed) {
        try {
          await onDelete(memory.id)
        } catch (error) {
          console.error('Failed to delete memory:', error)
          // Reset card position on error
          controls.start({ x: 0, opacity: 1 })
          setIsDeleting(false)
        }
      } else {
        // Reset card position if not confirmed
        controls.start({ x: 0, opacity: 1 })
        setIsDeleting(false)
      }
    } 
    // Swipe right for quick play (future feature)
    else if (offset > 100 && velocity > 50) {
      // For now, just snap back
      controls.start({ x: 0 })
      // TODO: Implement quick play functionality
    } 
    // Snap back to center
    else {
      controls.start({ x: 0 })
    }
  }

  // Disable swipe gestures for now - just return regular card
  // This can be re-enabled in the future with proper UX testing
  return <MemoryCard memory={memory} onDelete={onDelete} />

  return (
    <motion.div
      className="relative"
      style={{ x, scale }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      animate={controls}
      whileTap={{ scale: 0.98 }}
    >
      {/* Delete indicator (left swipe) */}
      <motion.div
        className="absolute inset-0 bg-error-primary rounded-organic flex items-center justify-end pr-8"
        style={{ opacity: deleteOpacity }}
      >
        <div className="text-white">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          <span className="text-sm font-medium">Delete</span>
        </div>
      </motion.div>

      {/* Play indicator (right swipe) */}
      <motion.div
        className="absolute inset-0 bg-sage-primary rounded-organic flex items-center justify-start pl-8"
        style={{ opacity: playOpacity }}
      >
        <div className="text-white">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">Play</span>
        </div>
      </motion.div>

      {/* The actual memory card */}
      <motion.div style={{ opacity: backgroundOpacity }}>
        <MemoryCard memory={memory} onDelete={onDelete} />
      </motion.div>
    </motion.div>
  )
}