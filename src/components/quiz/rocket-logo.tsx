import { motion } from "framer-motion";

/**
 * Brand logo plate used in the auth shell. Renders the CIRT MDG official logo
 * on a soft white plate so the colored marque pops against the blue panel.
 */
export function RocketLogo({ size = 96 }: { size?: number }) {
  return (
    <motion.div
      initial={{ y: 0, scale: 0.96, opacity: 0 }}
      animate={{ y: [-3, 3, -3], scale: 1, opacity: 1 }}
      transition={{
        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        scale: { duration: 0.6, ease: "easeOut" },
        opacity: { duration: 0.6 },
      }}
      className="inline-flex items-center justify-center rounded-2xl bg-white px-3 py-2 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.45)] ring-1 ring-white/40"
      style={{ width: size * 1.55, height: size * 0.62 }}
      aria-hidden
    >
      <img
        src="/cirt-mdg-logo.svg"
        alt=""
        className="h-full w-full object-contain"
        draggable={false}
      />
    </motion.div>
  );
}

export function CloudDivider({ vertical = false }: { vertical?: boolean }) {
  if (vertical) {
    return (
      <svg
        viewBox="0 0 80 800"
        preserveAspectRatio="none"
        className="absolute inset-y-0 right-0 h-full w-16"
        aria-hidden
      >
        <path
          d="M80 0 H40 C20 60 60 100 40 160 C20 220 60 280 40 340 C20 400 60 460 40 520 C20 580 60 640 40 700 C20 760 60 780 80 800 Z"
          fill="#ffffff"
          opacity="0.18"
        />
        <path
          d="M80 0 H50 C30 70 70 110 50 180 C30 250 70 310 50 380 C30 450 70 510 50 580 C30 650 70 700 80 780 Z"
          fill="#ffffff"
          opacity="0.35"
        />
        <path
          d="M80 0 H60 C40 80 80 120 60 200 C40 280 80 340 60 420 C40 500 80 560 60 640 C40 720 80 770 80 800 Z"
          fill="#ffffff"
        />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 400 60"
      preserveAspectRatio="none"
      className="block h-10 w-full"
      aria-hidden
    >
      <path
        d="M0 60 V20 C40 0 80 30 120 15 C160 0 200 25 240 12 C280 0 320 28 360 14 C380 6 400 18 400 18 V60 Z"
        fill="#ffffff"
        opacity="0.35"
      />
      <path
        d="M0 60 V30 C50 12 90 40 140 25 C180 12 220 35 270 22 C310 12 350 38 400 28 V60 Z"
        fill="#ffffff"
        opacity="0.6"
      />
      <path
        d="M0 60 V42 C60 28 110 52 170 38 C220 26 270 50 330 38 C360 32 400 44 400 44 V60 Z"
        fill="#ffffff"
      />
    </svg>
  );
}
