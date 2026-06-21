import './index.css'
import './navbar.css'
import Navigation from '../components/Navigation'
import LocalBusinessSchema from './schema'
import { GoogleAnalytics } from '@next/third-parties/google'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <LocalBusinessSchema />
        <link rel="preload" href="/img/Colorlogo_nobackground.png" as="image" type="image/png" />
      </head>
      <body>
        <Navigation />
        <div className="wrapper">{children}</div>
        <GoogleAnalytics gaId="G-SDSX26JETX" />
      </body>
    </html>
  )
}
