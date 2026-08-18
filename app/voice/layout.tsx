import type { ReactNode } from 'react';
import '../globals.css';

export default function VoiceLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body className="antialiased">{children}</body>
    </html>
  );
}
