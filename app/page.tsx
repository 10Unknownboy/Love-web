import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-[#6B1A3A] tracking-tight">
          How much do you love me?
        </h1>
        <p className="text-lg sm:text-xl font-cursive text-[#8B264E]">
          Drag the slider to test your love!
        </p>
      </header>

      <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl bg-white/60 p-4 shadow-cute border border-[#6B1A3A]/10 flex items-center justify-center">
        <Image
          src="/images/cat_shy.jpg"
          alt="Shy Kitten"
          width={260}
          height={260}
          className="rounded-2xl object-cover"
          priority
        />
      </div>

      <div className="flex flex-col items-center space-y-3">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/80 border border-[#6B1A3A]/20 text-[#6B1A3A] font-bold font-heading text-xl shadow-sm">
          0%
        </div>
        <p className="text-base font-cursive text-[#6B1A3A]">
          Only that much?
        </p>
      </div>

      <div className="pt-4">
        <Link href="/hub" className="btn-pill">
          Proceed to Surprises &rarr;
        </Link>
      </div>
    </div>
  );
}
