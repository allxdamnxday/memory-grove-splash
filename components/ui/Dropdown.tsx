'use client'

import { useRef, useEffect, useState, useCallback, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface DropdownProps {
  trigger: ReactNode
  children: ReactNode
  align?: 'left' | 'right'
  className?: string
  contentClassName?: string
  onOpenChange?: (open: boolean) => void
}

export function Dropdown({
  trigger,
  children,
  align = 'right',
  className,
  contentClassName,
  onOpenChange
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const handleToggle = () => {
    const newState = !isOpen
    setIsOpen(newState)
    onOpenChange?.(newState)
  }

  const handleClose = useCallback(() => {
    setIsOpen(false)
    onOpenChange?.(false)
  }, [onOpenChange])

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        handleClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen, handleClose])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose()
        triggerRef.current?.focus()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isOpen, handleClose])

  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls="dropdown-menu"
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-sage-600 focus-visible:ring-offset-2 rounded-lg"
      >
        {trigger}
      </button>
      
      {isOpen && (
        <div
          id="dropdown-menu"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="dropdown-trigger"
          className={cn(
            'absolute z-50 mt-2 min-w-[200px] origin-top-right rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-slide-down',
            align === 'left' ? 'left-0' : 'right-0',
            contentClassName
          )}
        >
          <div className="py-1" role="none">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

interface DropdownItemProps {
  children: ReactNode
  onClick?: () => void
  href?: string
  className?: string
  variant?: 'default' | 'danger'
  icon?: ReactNode
}

export function DropdownItem({
  children,
  onClick,
  href,
  className,
  variant = 'default',
  icon
}: DropdownItemProps) {
  const baseClasses = cn(
    'group flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors focus:outline-none focus-visible:bg-sage-50',
    variant === 'default' 
      ? 'text-warm-700 hover:bg-sage-50 hover:text-sage-700' 
      : 'text-red-600 hover:bg-red-50',
    className
  )

  const content = (
    <>
      {icon && (
        <span className="flex-shrink-0 text-warm-400 group-hover:text-sage-600">
          {icon}
        </span>
      )}
      <span className="flex-grow">{children}</span>
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className={baseClasses}
        role="menuitem"
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={baseClasses}
      role="menuitem"
    >
      {content}
    </button>
  )
}

export function DropdownDivider() {
  return <div className="my-1 h-px bg-warm-200" role="none" />
}

export function DropdownHeader({ children }: { children: ReactNode }) {
  return (
    <div className="px-4 py-2 text-xs font-medium text-warm-500 uppercase tracking-wider">
      {children}
    </div>
  )
}