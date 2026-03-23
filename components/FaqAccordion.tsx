'use client'

import { useState, type ReactNode } from 'react'

interface FaqItem {
  frage: string
  antwort: string
  icon: ReactNode
}

export function FaqAccordion({
  items,
  accentColor,
}: {
  items: FaqItem[]
  accentColor: string
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <div className="space-y-2">
      {items.map((item, i) => {
        const isOpen = activeIndex === i
        return (
          <div
            key={i}
            style={{
              background: '#161c2d',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 10,
              overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}
            onMouseOver={(e) => {
              if (!isOpen) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'
            }}
            onMouseOut={(e) => {
              if (!isOpen) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
            }}
          >
            <button
              onClick={() => setActiveIndex(isOpen ? null : i)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '14px 16px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{ color: accentColor, flexShrink: 0, display: 'flex' }}>
                {item.icon}
              </span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#ffffff' }}>
                {item.frage}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#64748b"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  transition: 'transform 0.2s',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  flexShrink: 0,
                }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <div
              style={{
                maxHeight: isOpen ? 300 : 0,
                overflow: 'hidden',
                transition: 'max-height 0.3s ease',
              }}
            >
              <div style={{ padding: '0 16px 14px 44px', fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
                {item.antwort}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
