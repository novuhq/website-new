import { cn } from "@/lib/utils"

type VideoPlayButtonProps = {
  onClick: () => void
  /** Announced to screen readers, e.g. "Play demo". */
  label: string
  className?: string
}

/**
 * The circular play overlay first built for the /mcp hero video: a white disc
 * that loses its gradient and tints the glyph blue on hover. Extracted so the
 * two video sections on the site cannot drift apart visually.
 *
 * Renders as a full-bleed button over its positioned parent.
 */
function VideoPlayButton({ onClick, label, className }: VideoPlayButtonProps) {
  return (
    <button
      className={cn(
        "group absolute inset-0 flex items-center justify-center outline-none",
        className
      )}
      type="button"
      aria-label={label}
      onClick={onClick}
    >
      <span className="relative inline-flex size-18 items-center justify-center overflow-hidden rounded-full border border-white transition-transform duration-300 ease-out group-hover:scale-110 group-focus-visible:ring-2 group-focus-visible:ring-white group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background">
        <span className="absolute inset-0 z-0 bg-white" aria-hidden />
        <span
          className="absolute inset-0 z-10 bg-gradient-to-b from-white to-gray-9 opacity-100 transition-opacity duration-300 ease-out group-hover:opacity-0"
          aria-hidden
        />
        <svg
          className="relative z-20 block h-6 w-auto shrink-0 translate-x-1 text-black transition-[color,transform] duration-300 ease-out group-hover:scale-110 group-hover:text-blue-3"
          viewBox="0 0 16 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M14.7611 10.1238L2.01933 17.7689C1.13063 18.3021 0 17.6619 0 16.6255V1.33539C0 0.298996 1.13063 -0.341156 2.01933 0.192064L14.7611 7.83714C15.6242 8.35502 15.6242 9.60592 14.7611 10.1238Z"
            fill="currentColor"
          />
        </svg>
      </span>
    </button>
  )
}

export default VideoPlayButton
