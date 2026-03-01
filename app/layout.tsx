// Root layout — intentionally minimal.
// The [locale]/layout.tsx provides <html lang={locale}> and <body>.
// This pattern is recommended by next-intl for locale-aware lang attributes.
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return children as React.ReactElement;
}
