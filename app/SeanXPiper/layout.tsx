import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '7Sisters - Sean X Piper',
  description:
    'Our mission and approach to breeding exceptional Great Danes at 7Sisters Farm',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
