import Link from 'next/link'
import { Github } from 'lucide-react'

const links = [
  { href: '#components', label: 'Components' },
  { href: '#docs', label: 'Docs' },
  { href: '#showcase', label: 'Showcase' },
]

export function Navbar() {
  return (
    <header className="fixed top-4 left-1/2 z-50 -translate-x-1/2">
      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-2 py-1.5 shadow-2xl shadow-black/40 backdrop-blur-xl">
        <Link
          href="/"
          className="rounded-full px-4 py-1.5 text-sm font-semibold tracking-tight text-white"
        >
          Bahrawy
        </Link>
        <span className="h-5 w-px bg-white/10" aria-hidden />
        <nav className="flex items-center gap-0.5 px-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-sm text-white/70 transition-colors duration-m3-enter ease-m3-enter hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <span className="h-5 w-px bg-white/10" aria-hidden />
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer noopener"
          aria-label="GitHub"
          className="rounded-full p-2 text-white/70 transition-colors duration-m3-enter ease-m3-enter hover:bg-white/5 hover:text-white"
        >
          <Github className="h-4 w-4" />
        </a>
      </div>
    </header>
  )
}
