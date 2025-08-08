import Image from 'next/image'
import Link from 'next/link'

export default function BettingSiteSelector() {
  const bettingSites = [
    { name: "Betwinner", logoSrc: "/logos/betwinner-logo.png" },
    { name: "Jeetwin", logoSrc: "/logos/jeetwinbd-logo.png" },
    { name: "1xbet", logoSrc: "/logos/1xbet-logo.png" },
    { name: "Allbet", logoSrc: "/logos/allbet-logo.png" },
    { name: "Linebet", logoSrc: "/logos/linebet-logo.png" },
    { name: "Betfair", logoSrc: "/logos/betfair-logo.png" },
    { name: "Mostbet", logoSrc: "/logos/mostbet-logo.png" },
    { name: "Melbet", logoSrc: "/logos/melbet-logo.png" },
    { name: "Jaya9", logoSrc: "/logos/jaya9-logo.png" },
    { name: "Kreekya", logoSrc: "/logos/krikya-logo.png" },
  ]

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
            <Link href={`/hack?platform=${encodeURIComponent(site.name)}&logo=${encodeURIComponent(site.logoSrc)}`} key={site.name}>
              <div
                className="bg-blue-900 rounded-2xl p-4 shadow-lg cursor-pointer hover:shadow-xl transition-shadow flex items-center justify-center relative h-28"
              >
                <Image
                  src={site.logoSrc || "/placeholder.svg"}
                  alt={`${site.name} logo`}
                  fill
                  style={{ objectFit: "contain" }}
                  className="p-2"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
