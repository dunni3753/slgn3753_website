export type Product = {
  slug: string;
  name: string;
  category: string;
  price: number;
  spec: string;
  description: string;
  stock: number;
};

export const products: Product[] = [
  {
    slug: "sl-ptz-400",
    name: "SL PTZ 400",
    category: "cameras",
    price: 185000,
    spec: "4MP, 30x optical zoom",
    description:
      "A pan, tilt and zoom camera built for wide open compounds and estates where one camera needs to cover a large area with remote control movement.",
    stock: 12,
  },
  {
    slug: "sl-dome-200",
    name: "SL Dome 200",
    category: "cameras",
    price: 62000,
    spec: "2MP, night vision, indoor and outdoor",
    description:
      "A compact dome camera suited for hallways, reception areas and compound corners, with clear night vision up to 25 metres.",
    stock: 30,
  },
  {
    slug: "sl-bullet-250",
    name: "SL Bullet 250",
    category: "cameras",
    price: 58000,
    spec: "2MP, 40m infrared range",
    description:
      "A weatherproof bullet camera for gates, fences and building perimeters, with long range night vision for low light coverage.",
    stock: 25,
  },
  {
    slug: "sl-analogue-100",
    name: "SL Analogue 100",
    category: "cameras",
    price: 34000,
    spec: "1080p, coaxial connection",
    description:
      "An affordable analogue camera for smaller budgets, connects over coaxial cable to an existing DVR setup.",
    stock: 40,
  },
  {
    slug: "sl-int-video",
    name: "SL Intercom Video",
    category: "intercoms",
    price: 94000,
    spec: "7 inch display, two way audio",
    description:
      "A video intercom unit for gates and front doors, lets you see and speak with visitors before letting them in.",
    stock: 18,
  },
  {
    slug: "sl-int-audio",
    name: "SL Intercom Audio",
    category: "intercoms",
    price: 41000,
    spec: "Audio only, weatherproof panel",
    description:
      "A simple audio intercom for smaller properties that need a reliable way to screen visitors at the gate.",
    stock: 22,
  },
  {
    slug: "sl-fence-energizer",
    name: "SL Fence Energizer",
    category: "electric-fencing",
    price: 76000,
    spec: "Covers up to 500m of wire",
    description:
      "The control unit for an electric fence system, sends a safe pulse through the wire to deter intruders.",
    stock: 10,
  },
  {
    slug: "sl-fence-wire",
    name: "SL Fence Wire, per roll",
    category: "electric-fencing",
    price: 18000,
    spec: "100m roll, galvanized",
    description:
      "Durable galvanized wire for electric fence installations, sold per roll.",
    stock: 60,
  },
  {
    slug: "sl-fire-panel",
    name: "SL Fire Alarm Panel",
    category: "fire-alarm-systems",
    price: 145000,
    spec: "8 zone control panel",
    description:
      "A central fire alarm control panel that monitors smoke and heat detectors across up to 8 zones of a building.",
    stock: 8,
  },
  {
    slug: "sl-smoke-detector",
    name: "SL Smoke Detector",
    category: "fire-alarm-systems",
    price: 12500,
    spec: "Photoelectric sensor",
    description:
      "A standalone smoke detector unit that connects into a full fire alarm panel setup.",
    stock: 50,
  },
  {
    slug: "sl-smart-lock",
    name: "SL Smart Door Lock",
    category: "home-automation",
    price: 68000,
    spec: "Fingerprint, PIN and app control",
    description:
      "A smart lock that replaces your regular door lock, unlock with a fingerprint, PIN code, or from your phone.",
    stock: 15,
  },
  {
    slug: "sl-smart-hub",
    name: "SL Automation Hub",
    category: "home-automation",
    price: 52000,
    spec: "Controls lights, locks and sensors",
    description:
      "The central hub that connects your smart devices together, controlled from one app on your phone.",
    stock: 14,
  },
  {
    slug: "sl-motion-sensor",
    name: "SL Motion Sensor",
    category: "security-gadgets",
    price: 9500,
    spec: "PIR sensor, wireless",
    description:
      "A wireless motion sensor that triggers an alert the moment movement is detected in its range.",
    stock: 45,
  },
  {
    slug: "sl-door-sensor",
    name: "SL Door and Window Sensor",
    category: "security-gadgets",
    price: 6500,
    spec: "Wireless, battery powered",
    description:
      "A small sensor that alerts you the moment a door or window is opened.",
    stock: 55,
  },
];

export function getProductsByCategory(category: string) {
  return products.filter((product) => product.category === category);
}

export function getProduct(category: string, slug: string) {
  return products.find(
    (product) => product.category === category && product.slug === slug,
  );
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
}
