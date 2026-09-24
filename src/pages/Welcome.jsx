import { useCallback, useEffect, useRef, useState } from 'react'

const produce = [
  { emoji: '🍅', delay: '0s', ring: 1 },
  { emoji: '🥕', delay: '0.35s', ring: 2 },
  { emoji: '🍋', delay: '0.7s', ring: 1 },
  { emoji: '🍇', delay: '1.05s', ring: 2 },
  { emoji: '🥑', delay: '1.4s', ring: 1 },
  { emoji: '🥬', delay: '1.75s', ring: 2 },
]

export default function Welcome({ onEnter }) {
  const [leaving, setLeaving] = useState(false)
  const [ready, setReady] = useState(false)
  const leavingRef = useRef(false)

  const enter = useCallback(() => {
    if (leavingRef.current) return
    leavingRef.current = true
    setLeaving(true)
    window.setTimeout(() => onEnter?.(), 880)
  }, [onEnter])

  useEffect(() => {
    const show = setTimeout(() => setReady(true), 2200)
    const auto = setTimeout(enter, 7200)
    return () => {
      clearTimeout(show)
      clearTimeout(auto)
    }
  }, [enter])

  return (
    <div className={`entry-stage ${leaving ? 'is-leaving' : ''}`}>
      <div className="entry-aurora" aria-hidden />
      <svg className="entry-vine" viewBox="0 0 600 600" aria-hidden>
        <circle className="entry-vine-path" cx="300" cy="300" r="168" />
        <circle className="entry-vine-path entry-vine-inner" cx="300" cy="300" r="112" />
      </svg>

      <div className="entry-orbit" aria-hidden>
        {produce.map((item) => (
          <span
            key={item.emoji}
            className={`entry-orb entry-orb-${item.ring}`}
            style={{ animationDelay: item.delay }}
          >
            {item.emoji}
          </span>
        ))}
      </div>

      <div className="entry-core">
        <div className="entry-crate" aria-hidden>
          <span className="entry-crate-lid" />
          <span className="entry-mark">F</span>
        </div>
        <p className="entry-kicker">Evening edition · neighbourhood mandi</p>
        <h1 className="entry-title">
          <span>Fresh</span>
          <span className="entry-title-accent">Choice</span>
        </h1>
        <p className="entry-sub">Farm crates, pantry staples and same-day slots — the gazette opens now.</p>
        <div className={`entry-actions ${ready ? 'is-ready' : ''}`}>
          <button type="button" className="entry-enter" onClick={enter}>
            Open the gazette
          </button>
          <button type="button" className="entry-skip" onClick={enter}>
            Skip intro
          </button>
        </div>
      </div>

      <div className="entry-curtain entry-curtain-left" aria-hidden />
      <div className="entry-curtain entry-curtain-right" aria-hidden />
    </div>
  )
}
