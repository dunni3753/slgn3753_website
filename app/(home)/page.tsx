import Link from "next/link";
import { QuoteForm } from "@/components/quote-form";
import { ViewfinderFrame } from "@/components/viewfinder-frame";
import { HeroSlider } from "@/components/hero-slider";
import { connectToDatabase } from "@/lib/mongodb";
import { Category } from "@/lib/models/Category";
import { Product } from "@/lib/models/Product";
import { CategoryIcon } from "@/components/category-icon";
import { formatPrice } from "@/lib/products";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

const stats = [
  { value: "500+", label: "Installations completed" },
  { value: "24/7", label: "Monitoring and support" },
  { value: "150m", label: "Max camera IR range" },
  { value: "10 yr", label: "Field equipment warranty" },
];

async function getHomeData() {
  await connectToDatabase();

  const [categories, products] = await Promise.all([
    Category.find().sort({ createdAt: 1 }).lean(),
    Product.find({ active: true }).sort({ createdAt: -1 }).limit(4).lean(),
  ]);

  return { categories, products };
}

export default async function Home() {
  const { categories, products } = await getHomeData();

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

          {categories.length === 0 ? (
            <p className="mt-10 text-muted">
              Categories will appear here once added from the admin panel.
            </p>
          ) : (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((item) => (
                <Link
                  key={item.slug}
                  href={`/products/${item.slug}`}
                  className="group rounded-2xl border border-line bg-background p-6 transition-colors hover:border-accent"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-accent">
                    <CategoryIcon icon={item.icon} />
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
          )}
        </div>
      </section>

      <section id="catalogue" className="py-20">
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
            <Link
              href="/products"
              className="text-sm font-semibold text-accent hover:opacity-80"
            >
              View full catalogue
            </Link>
          </div>

          {products.length === 0 ? (
            <p className="mt-10 text-muted">
              Products will appear here once added from the admin panel.
            </p>
          ) : (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <Link
                  key={product.slug}
                  href={`/products/${product.category}/${product.slug}`}
                  className="flex flex-col rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-accent"
                >
                  <div className="aspect-square overflow-hidden rounded-xl border border-line bg-background">
                    {product.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted">
                    {product.category}
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold">
                    {product.name}
                  </p>
                  <p className="mt-1 text-sm text-muted">{product.spec}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-mono text-sm font-semibold">
                      {formatPrice(product.price)}
                    </span>
                    <span className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold transition-colors group-hover:border-accent">
                      View
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
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
