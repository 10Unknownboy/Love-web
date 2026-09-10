import Image from 'next/image';
import Link from 'next/link';

export default function LetterPage() {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center space-y-8 py-6">
      <header className="space-y-2">
        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-[#6B1A3A] tracking-tight">
          A Letter From My Heart
        </h1>
        <p className="text-lg sm:text-2xl font-cursive text-[#8B264E]">
          Every word written with love
        </p>
      </header>

      <div className="relative w-full max-w-2xl px-4 flex flex-col items-center">
        {/* Lined Paper Texture Card */}
        <div className="lined-paper w-full p-6 sm:p-10 rounded-3xl border border-[#6B1A3A]/20 shadow-cute-lg text-left relative">
          <div className="flex items-center justify-between border-b border-pink-200 pb-3 mb-6">
            <span className="font-heading font-semibold text-xs tracking-widest uppercase text-[#8B264E]">
              To My Beloved 💕
            </span>
            <span className="font-cursive text-sm text-[#8B264E]">
              Forever &amp; Always
            </span>
          </div>

          <div className="space-y-6 font-cursive text-xl sm:text-2xl text-[#6B1A3A] leading-relaxed">
            <p>
              You make my life feel more beautiful and meaningful, and I feel so
              lucky to have you. I love you wholeheartedly, and I can&apos;t wait
              to continue loving you for the rest of my life.
            </p>

            <p>
              You make me smile, you make me feel safe, and you bring so much
              happiness into my world. I know I tell you this every day, but you
              truly are the most beautiful person in my eyes.
            </p>

            <p>
              Thank you for being you and for filling my heart with so much love.
              No matter what happens, I will always choose you.
            </p>

            <p className="font-bold text-2xl sm:text-3xl text-right pt-4 text-[#52142D]">
              Always, forever.
            </p>
          </div>

          {/* Cute Cat Holding Heart Sticker */}
          <div className="flex justify-center sm:justify-end mt-6 pt-4 border-t border-pink-100">
            <div className="flex items-center gap-3 bg-[#FDE8EB]/60 px-4 py-2 rounded-2xl border border-[#6B1A3A]/10 animate-pulse-heart">
              <div className="relative w-16 h-16">
                <Image
                  src="/images/cat_ecstatic.jpg"
                  alt="Ecstatic Kitten with Heart"
                  width={64}
                  height={64}
                  className="rounded-xl object-cover"
                />
              </div>
              <span className="font-heading font-bold text-sm text-[#6B1A3A]">
                With all my love!
              </span>
            </div>
          </div>
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
