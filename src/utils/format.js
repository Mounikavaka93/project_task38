export function formatINR(value) {
  const n = Number(value) || 0
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n)
}

export function plural(count, word) {
  return `${count} ${word}${count === 1 ? '' : 's'}`
}

export function slugTitle(text = '') {
  return text.replace(/-/g, ' ')
}

export function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

export function generateOrderId() {
  return `FB${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 90 + 10)}`
}
