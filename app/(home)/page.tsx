import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { HeroSlider } from "@/components/hero-slider";
import { QuoteForm } from "@/components/quote-form";
import { ViewfinderFrame } from "@/components/viewfinder-frame";

import Link from "next/link";

const categories = [
  {
    name: "Cameras",
    slug: "cameras",
    detail: "PTZ, dome, bullet and analogue",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <rect x="2.5" y="8" width="12" height="8" rx="2" />
        <path d="M14.5 10.5l6 -3v9l-6 -3" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "Intercoms",
    slug: "intercoms",
    detail: "Audio and video door units",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
        <circle cx="12" cy="7" r="1.6" />
        <path d="M9 12h6M9 15.5h4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Electric Fencing",
    slug: "electric-fencing",
    detail: "Perimeter deterrent systems",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path
          d="M4 20V6M10 20V6M16 20V6M4 9h6M4 15h6M10 9h6M10 15h6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    name: "Fire Alarm Systems",
    slug: "fire-alarm-systems",
    detail: "Detection and alert panels",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path
          d="M12 3s4.5 4 4.5 8.5a4.5 4.5 0 1 1 -9 0C7.5 8.5 9 7 9 7s.5 2 1.5 2c0 -2 .5 -4 1.5 -6Z"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    name: "Home Automation",
    slug: "home-automation",
    detail: "Lighting, locks and control",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path
          d="M3.5 11.5 12 4l8.5 7.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M6 10v9.5h12V10" strokeLinejoin="round" />
        <rect x="10" y="14" width="4" height="5.5" />
      </svg>
    ),
  },
  {
    name: "Security Gadgets",
    slug: "security-gadgets",
    detail: "Sensors, alarms and locks",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path
          d="M12 3.5 19 6.5v5c0 5 -3 8 -7 9 -4 -1 -7 -4 -7 -9v-5Z"
          strokeLinejoin="round"
        />
        <path
          d="M9.5 12l1.8 1.8L15 10.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const products = [
  {
    name: "SL-PTZ 400",
    category: "PTZ Camera",
    spec: "4MP, 30x zoom",
    price: "₦185,000",
  },
  {
    name: "SL-DOME 200",
    category: "Dome Camera",
    spec: "2MP, night vision",
    price: "₦62,000",
  },
  {
    name: "SL-BULLET 250",
    category: "Bullet Camera",
    spec: "2MP, 40m IR range",
    price: "₦58,000",
  },
  {
    name: "SL-INT VIDEO",
    category: "Video Intercom",
    spec: "7 inch display",
    price: "₦94,000",
  },
];

const stats = [
  { value: "500+", label: "Installations completed" },
  { value: "24/7", label: "Monitoring and support" },
  { value: "150m", label: "Max camera IR range" },
  { value: "10 yr", label: "Field equipment warranty" },
];

export default function Home() {
  return (
    <>
      <Header />
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
        <div className="grid items-center gap-14 md:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 font-mono text-xs text-muted">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-live" />
              Based in Lagos, installing nationwide
            </div>

            <h1 className="mt-6 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
              See everything.
              <br />
              Secure everything.
            </h1>

            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
              Sniper Lens Global Networks sells and installs CCTV cameras,
              intercoms, electric fencing, fire alarm systems and home
              automation devices built for real protection, not just a sticker
              on your gate.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90"
              >
                Request a Quote
              </a>
              <a
                href="#cameras"
                className="inline-flex items-center justify-center rounded-full border border-line px-6 py-3 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
              >
                Browse Products
              </a>
            </div>
          </div>

          <ViewfinderFrame className="aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-surface">
            <HeroSlider />
          </ViewfinderFrame>
        </div>
      </section>

      <section id="cameras" className="border-y border-line bg-surface py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="font-mono text-xs uppercase tracking-widest text-muted">
            What we cover
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Every layer of a secure property
          </h2>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((item) => (
              <Link
                key={item.slug}
                href={`/products/${item.slug}`}
                className="group rounded-2xl border border-line bg-background p-6 transition-colors hover:border-accent"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-accent">
                  {item.icon}
                </div>
                <p className="mt-4 flex items-center justify-between font-display text-lg font-semibold">
                  {item.name}
                  <span className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent">
                    →
                  </span>
                </p>
                <p className="mt-1 text-sm text-muted">{item.detail}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted">
                Featured equipment
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                Stocked and ready to install
              </h2>
            </div>
            <a
              href="#contact"
              className="text-sm font-semibold text-accent hover:opacity-80"
            >
              View full catalogue
            </a>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.name}
                className="flex flex-col rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-accent"
              >
                <div className="aspect-square rounded-xl border border-line bg-background" />
                <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted">
                  {product.category}
                </p>
                <p className="mt-1 font-display text-lg font-semibold">
                  {product.name}
                </p>
                <p className="mt-1 text-sm text-muted">{product.spec}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-mono text-sm font-semibold">
                    {product.price}
                  </span>
                  <a
                    href="#contact"
                    className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold transition-colors hover:border-accent hover:text-accent"
                  >
                    View
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-mono text-3xl font-semibold text-accent">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to secure your space?
            </h2>
            <p className="mt-4 text-lg text-muted">
              Tell us what you are protecting, and our team will put together a
              system and quote within one working day.
            </p>
          </div>

          <div className="mt-10">
            <QuoteForm />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
