import Image from "next/image"

export function HeroSection() {
  return (
    <div className="relative h-[90vh] w-full overflow-hidden">
      <Image
        src="/venues/hero-wedding.jpg"
        alt="Elegant wedding venue"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/30" /> {/* Subtle overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-great-vibes text-6xl md:text-8xl text-white mb-4">
          Elegant Moments
        </h1>
        <p className="font-playfair text-xl md:text-2xl text-white/90 max-w-2xl">
          Where Dreams Become Timeless Memories
        </p>
      </div>
    </div>
  )
} 