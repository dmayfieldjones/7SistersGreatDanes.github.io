import Link from 'next/link'

function Link2({
  children,
  href,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link className="m-2" href={href}>
      {children}
    </Link>
  )
}
export default function Footer() {
  return <footer className="mt-16">Footer</footer>
}
