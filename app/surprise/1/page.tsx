import Image from 'next/image';
import Link from 'next/link';

export default function BouquetPage() {
  const quotes = [
    'You make my heart bloom.',
    'I choose you every day',
    'Life feels sweeter with you',
    'My love for you keeps growing',
    'You make every moment sweeter.',
    'My heart will always choose you',
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center text-center space-y-8 py-6">
      <header className="space-y-2">
        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-[#6B1A3A] tracking-tight">
          Your Bouquet
        </h1>
        <p className="text-lg sm:text-2xl font-cursive text-[#8B264E]">
          Fresh blooms gathered just for you
        </p>
      </header>

      <div className="relative w-full max-w-2xl px-4 py-8 flex flex-col items-center justify-center">
        {/* Scalloped / Decorative Frame around bouquet */}
        <div className="scalloped-frame bg-white/60 p-6 sm:p-8 relative max-w-md w-full flex items-center justify-center shadow-cute">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80">
            <Image
              src="/images/bouquet.jpg"
              alt="Lush Bouquet of Red Roses"
              width={320}
              height={320}
              className="rounded-2xl object-cover shadow-sm"
              priority
            />
          </div>
        </div>

        {/* Floating Sweet Quotes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6 w-full max-w-lg">
          {quotes.map((quote, idx) => (
            <div
              key={idx}
              className="bg-white/80 border border-[#6B1A3A]/15 rounded-full px-4 py-2 text-sm sm:text-base font-cursive text-[#6B1A3A] shadow-sm animate-gentle-float"
              style={{ animationDelay: `${idx * 0.4}s` }}
            >
              &ldquo;{quote}&rdquo;
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <Link href="/hub" className="btn-pill">
          Next &rarr;
        </Link>
      </div>
    </div>
  );
}
