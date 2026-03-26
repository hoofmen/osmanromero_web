import { useState, useEffect } from 'react'

function getIsMobile() {
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  const smallScreen = Math.min(window.innerWidth, window.innerHeight) < 768
  return hasTouch || smallScreen
}

function getIsPortrait() {
  return window.innerHeight > window.innerWidth
}

export function useMobileDetect() {
  const [isMobile, setIsMobile] = useState(getIsMobile)
  const [isPortrait, setIsPortrait] = useState(getIsPortrait)

  useEffect(() => {
    const onResize = () => {
      setIsMobile(getIsMobile())
      setIsPortrait(getIsPortrait())
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [])

  return { isMobile, isPortrait }
}
