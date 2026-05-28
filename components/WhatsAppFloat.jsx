'use client';

import dynamic from 'next/dynamic';

const FloatingWhatsApp = dynamic(
  () =>
    import('react-floating-whatsapp').then(
      (mod) => mod.FloatingWhatsApp
    ),
  { ssr: false }
);

export default function WhatsAppFloat() {
  return (
    <FloatingWhatsApp
      phoneNumber="263780525557"
      accountName="Maron's Muscle Studio"
      chatMessage="Hello! 👋 How can we help you?"
      placeholder="Type your message..."
      allowEsc
      allowClickAway
      notification
      notificationDelay={5}
      avatar="./logo/logo4.png" // optional
      statusMessage="Typically replies within minutes"
      darkMode={false}
    />
  );
}
