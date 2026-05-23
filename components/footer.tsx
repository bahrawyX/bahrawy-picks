import { BrandMark } from '@/components/brand-mark'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <div className="flex items-center gap-3 text-sm text-white/60">
          <span className="inline-flex items-center gap-2 font-semibold tracking-tight text-white">
            <BrandMark className="h-[18px] w-[18px]" />
            Bahrawy
          </span>
          <span className="h-4 w-px bg-white/10" aria-hidden />
          <a
            href="https://bahrawy.me"
            target="_blank"
            rel="noreferrer noopener"
            className="transition-colors duration-m3-enter ease-m3-enter hover:text-white"
          >
            bahrawy.me
          </a>
        </div>
        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} Bahrawy. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
