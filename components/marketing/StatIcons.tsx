interface IconProps {
  className?: string
}

export const RegretIcon = ({ className = "w-12 h-12" }: IconProps) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Broken heart with voice wave */}
    <path 
      d="M24 42C24 42 6 30 6 18C6 14 8 10 12 10C16 10 18 12 20 14L24 18L28 14C30 12 32 10 36 10C40 10 42 14 42 18C42 30 24 42 24 42Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M20 18L22 22L24 18L26 22L28 18" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      opacity="0.6"
    />
    <path 
      d="M24 18V30" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round"
      strokeDasharray="2 2"
    />
  </svg>
)

export const TimeIcon = ({ className = "w-12 h-12" }: IconProps) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Clock with microphone */}
    <circle 
      cx="24" 
      cy="24" 
      r="16" 
      stroke="currentColor" 
      strokeWidth="2"
    />
    <path 
      d="M24 12V24L32 28" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    {/* Microphone in center */}
    <rect 
      x="22" 
      y="18" 
      width="4" 
      height="8" 
      rx="2" 
      fill="currentColor" 
      opacity="0.3"
    />
    <path 
      d="M20 24C20 26.2091 21.7909 28 24 28C26.2091 28 28 26.2091 28 24" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round"
    />
    <path 
      d="M24 28V30" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round"
    />
  </svg>
)

export const MessagesIcon = ({ className = "w-12 h-12" }: IconProps) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Speech bubbles forming heart shape */}
    <path 
      d="M14 12C14 9.79086 15.7909 8 18 8H22C24.2091 8 26 9.79086 26 12V16C26 18.2091 24.2091 20 22 20H20L16 24V20C14.8954 20 14 19.1046 14 18V12Z" 
      stroke="currentColor" 
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path 
      d="M22 12C22 9.79086 23.7909 8 26 8H30C32.2091 8 34 9.79086 34 12V16C34 18.2091 32.2091 20 30 20H28L32 24V20C33.1046 20 34 19.1046 34 18V12Z" 
      stroke="currentColor" 
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path 
      d="M10 26C10 23.7909 11.7909 22 14 22H18C20.2091 22 22 23.7909 22 26V30C22 32.2091 20.2091 34 18 34H16L12 38V34C10.8954 34 10 33.1046 10 32V26Z" 
      stroke="currentColor" 
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
    <path 
      d="M26 26C26 23.7909 27.7909 22 30 22H34C36.2091 22 38 23.7909 38 26V30C38 32.2091 36.2091 34 34 34H32L36 38V34C37.1046 34 38 33.1046 38 32V26Z" 
      stroke="currentColor" 
      strokeWidth="2"
      fill="currentColor"
      fillOpacity="0.1"
    />
    {/* Heart in center */}
    <path 
      d="M24 28C24 28 20 25 20 22.5C20 21 21 20 22 20C23 20 23.5 20.5 24 21C24.5 20.5 25 20 26 20C27 20 28 21 28 22.5C28 25 24 28 24 28Z" 
      fill="currentColor"
      opacity="0.5"
    />
  </svg>
)