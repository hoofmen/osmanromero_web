import { useState, useEffect } from 'react'

function getIsPortrait() {
  return window.innerHeight > window.innerWidth
}

export function useMobileDetect() {
  const [isPortrait, setIsPortrait] = useState(getIsPortrait)

  useEffect(() => {
    const onResize = () => setIsPortrait(getIsPortrait())
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [])

  return { isPortrait }
}
