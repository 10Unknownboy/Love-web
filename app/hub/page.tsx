import Image from 'next/image';
import Link from 'next/link';

export default function HubPage() {
  const gifts = [
    {
      id: 1,
      title: 'Surprise 1',
      subtitle: 'Your Bouquet',
      href: '/surprise/1',
      description: 'A sweet bouquet of roses for you',
    },
    {
      id: 2,
      title: 'Surprise 2',
      subtitle: 'Music & Memories',
      href: '/surprise/2',
      description: 'Our special song and polaroid moments',
    },
    {
      id: 3,
      title: 'Surprise 3',
      subtitle: 'A Letter From My Heart',
      href: '/surprise/3',
      description: 'Words written just for you',
    },
  ];

  return (
    <div className="w-full flex flex-col items-center justify-center text-center space-y-8 py-6">
      <header className="space-y-3">
        <h1 className="text-3xl sm:text-5xl font-bold font-heading text-[#6B1A3A] tracking-tight">
          You passed the love test
        </h1>
        <p className="text-lg sm:text-2xl font-cursive text-[#8B264E]">
          Your surprises are waiting for you
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl px-4">
        {gifts.map((gift) => (
          <Link
            key={gift.id}
            href={gift.href}
            className="group relative flex flex-col items-center p-6 rounded-3xl bg-white/70 border border-[#6B1A3A]/15 shadow-cute transition-all duration-300 hover:shadow-gift-hover hover:-translate-y-2 hover:bg-white"
          >
            <div className="relative w-36 h-36 mb-4 flex items-center justify-center animate-cute-bounce group-hover:scale-105 transition-transform">
              <Image
                src="/images/gift_box.jpg"
                alt="Gift Box"
                width={140}
                height={140}
                className="rounded-2xl object-cover"
              />
            </div>
            <h2 className="text-xl font-bold font-heading text-[#6B1A3A]">
              {gift.subtitle}
            </h2>
            <p className="text-sm font-cursive text-[#8B264E] mt-1">
              {gift.description}
            </p>
            <span className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#6B1A3A] border-b border-[#6B1A3A]/30 group-hover:border-[#6B1A3A]">
              Open Gift &rarr;
            </span>
          </Link>
        ))}
      </div>

      <div className="pt-4">
        <Link href="/" className="btn-pill">
          &larr; Back to Love Slider
        </Link>
      </div>
    </div>
  );
}
