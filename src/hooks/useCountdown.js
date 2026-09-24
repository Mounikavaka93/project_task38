import { useEffect, useState } from 'react'

export function useCountdown(targetDate) {
  const [left, setLeft] = useState(() => Math.max(0, targetDate - Date.now()))

  useEffect(() => {
    const id = setInterval(() => {
      setLeft(Math.max(0, targetDate - Date.now()))
    }, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  const total = Math.floor(left / 1000)
  const days = Math.floor(total / 86400)
  const hours = Math.floor((total % 86400) / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  return { days, hours, minutes, seconds, done: left <= 0 }
}
