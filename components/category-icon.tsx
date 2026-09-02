const icons: Record<string, React.ReactNode> = {
  camera: (
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
  intercom: (
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
  fence: (
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
  fire: (
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
  automation: (
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
  gadget: (
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
  access: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <rect x="5" y="10" width="14" height="10" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" strokeLinecap="round" />
      <circle cx="12" cy="15" r="1.4" />
    </svg>
  ),
  smartlock: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <rect x="4.5" y="10.5" width="15" height="9.5" rx="2" />
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5" strokeLinecap="round" />
      <path d="M12 14.5v2" strokeLinecap="round" />
    </svg>
  ),
  solar: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <circle cx="12" cy="12" r="4" />
      <path
        d="M12 2.5v2.4M12 19.1v2.4M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7"
        strokeLinecap="round"
      />
    </svg>
  ),
  inverter: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path
        d="M8 12h2l1.5 -3 2 6 1.5 -3h1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  battery: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <rect x="3" y="8" width="16" height="8" rx="2" />
      <path d="M19 10.5h2v3h-2" />
      <path d="M7 12h6" strokeLinecap="round" />
    </svg>
  ),
  bulb: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M9 18h6M10 21h4" strokeLinecap="round" />
      <path
        d="M12 3a6 6 0 0 0 -3.5 10.9c.6.5 1 1.2 1 2.1h5c0 -.9.4 -1.6 1 -2.1A6 6 0 0 0 12 3Z"
        strokeLinejoin="round"
      />
    </svg>
  ),
  solarfan: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <circle cx="12" cy="12" r="2" />
      <path
        d="M12 10c0 -3 -1 -5 -3 -6 1 2 1 4 3 6ZM12 14c0 3 1 5 3 6 -1 -2 -1 -4 -3 -6ZM10 12c-3 0 -5 1 -6 3 2 -1 4 -1 6 -3ZM14 12c3 0 5 -1 6 -3 -2 1 -4 1 -6 3Z"
        strokeLinejoin="round"
      />
    </svg>
  ),
  electronics: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <rect x="3" y="5" width="18" height="12" rx="1.5" />
      <path d="M8 20h8M12 17v3" strokeLinecap="round" />
    </svg>
  ),
  network: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <rect x="4" y="4" width="16" height="6" rx="1.5" />
      <path d="M8 10v3M16 10v3M6 13h12v3H6z" strokeLinejoin="round" />
    </svg>
  ),
  power: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M12 2v9" strokeLinecap="round" />
      <path
        d="M7.5 6.5a7 7 0 1 0 9 0"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export function CategoryIcon({ icon }: { icon: string }) {
  return <>{icons[icon] ?? icons.gadget}</>;
}
