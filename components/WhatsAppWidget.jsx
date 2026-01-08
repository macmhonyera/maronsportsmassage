'use client';

import React, { useMemo } from 'react';

export default function WhatsAppWidget({
  phoneE164 = '27821234567', // Example: South Africa +27... (NO + sign)
  message = 'Hi! I need help with...',
  position = 'bottom-right', // 'bottom-right' | 'bottom-left'
  label = 'Chat on WhatsApp',
}) {
  const href = useMemo(() => {
    const text = encodeURIComponent(message);
    return `https://wa.me/${phoneE164}?text=${text}`;
  }, [phoneE164, message]);

  const positionStyle =
    position === 'bottom-left'
      ? { left: 16, bottom: 16 }
      : { right: 16, bottom: 16 };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      style={{
        position: 'fixed',
        zIndex: 9999,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 14px',
        borderRadius: 999,
        textDecoration: 'none',
        boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
        background: '#25D366',
        color: '#0B2E13',
        fontWeight: 700,
        ...positionStyle,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 36,
          height: 36,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.85)',
          display: 'grid',
          placeItems: 'center',
          fontSize: 18,
          lineHeight: 1,
        }}
      >
        WA
      </span>

      <span style={{ color: '#063' }}>{label}</span>
    </a>
  );
}
