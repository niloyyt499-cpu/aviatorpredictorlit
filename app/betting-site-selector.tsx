"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

const ImageWithFallback = ({ localSrc, externalSrc, alt }: { localSrc: string, externalSrc: string, alt: string }) => {
  const [imgSrc, setImgSrc] = useState(localSrc);

  useEffect(() => {
    setImgSrc(localSrc);
  }, [localSrc]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={() => {
        if (imgSrc !== externalSrc) {
          setImgSrc(externalSrc);
        }
      }}
      className="absolute inset-0 w-full h-full object-contain p-2"
      loading="eager"
    />
  );
};

export default function BettingSiteSelector() {
  const bettingSites = [
    { name: "Betwinner", logoUrl: "https://raw.githubusercontent.com/niloyyt499-cpu/aviatorlite-logo/main/betwinner-logo.png", logoPath: "/logos/betwinner-logo.png" },
    { name: "Jeetwin", logoUrl: "https://raw.githubusercontent.com/niloyyt499-cpu/aviatorlite-logo/main/jeetwinbd-logo.png", logoPath: "/logos/jeetwinbd-logo.png" },
    { name: "1xbet", logoUrl: "https://raw.githubusercontent.com/niloyyt499-cpu/aviatorlite-logo/main/1xbet-logo.png", logoPath: "/logos/1xbet-logo.png" },
    { name: "Allbet", logoUrl: "https://raw.githubusercontent.com/niloyyt499-cpu/aviatorlite-logo/main/allbet-logo.png", logoPath: "/logos/allbet-logo.png" },
    { name: "Linebet", logoUrl: "https://raw.githubusercontent.com/niloyyt499-cpu/aviatorlite-logo/main/linebet-logo.png", logoPath: "/logos/linebet-logo.png" },
    { name: "Betfair", logoUrl: "https://raw.githubusercontent.com/niloyyt499-cpu/aviatorlite-logo/main/betfair-logo.png", logoPath: "/logos/betfair-logo.png" },
    { name: "Mostbet", logoUrl: "https://raw.githubusercontent.com/niloyyt499-cpu/aviatorlite-logo/main/mostbet-logo.png", logoPath: "/logos/mostbet-logo.png" },
    { name: "Melbet", logoUrl: "https://raw.githubusercontent.com/niloyyt499-cpu/aviatorlite-logo/main/melbet-logo.png", logoPath: "/logos/melbet-logo.png" },
    { name: "Jaya9", logoUrl: "https://raw.githubusercontent.com/niloyyt499-cpu/aviatorlite-logo/main/jaya9-logo.png", logoPath: "/logos/jaya9-logo.png" },
    { name: "Kreekya", logoUrl: "https://raw.githubusercontent.com/niloyyt499-cpu/aviatorlite-logo/main/krikya-logo.png", logoPath: "/logos/krikya-logo.png" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-20">
      <div className="mb-8">
        <div className="bg-red-600 rounded-2xl py-4 px-8 shadow-lg flex items-center justify-center">
          <h1 className="text-white text-xl sm:text-2xl font-bold tracking-wide whitespace-nowrap">CHOOSE YOUR BETTING SITE</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 gap-6">
          {bettingSites.map((site) => (
            <Link href={`/hack?platform=${encodeURIComponent(site.name)}&logoPath=${encodeURIComponent(site.logoPath)}&logoUrl=${encodeURIComponent(site.logoUrl)}`} key={site.name}>
              <div className="bg-blue-900 rounded-2xl p-4 shadow-lg cursor-pointer hover:shadow-xl transition-shadow flex items-center justify-center relative h-28">
                <ImageWithFallback
                  localSrc={site.logoPath}
                  externalSrc={site.logoUrl}
                  alt={`${site.name} logo`}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
