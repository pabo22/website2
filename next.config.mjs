/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // "standalone" erzeugt beim Build ein schlankes Bundle mit eigenem
  // Node-Server - ideal für Docker/VPS. Auf Vercel schadet es nicht.
  output: "standalone",

  images: {
    // Nur diese beiden Hosts dürfen über /_next/image optimiert werden.
    // Ein offener Image-Optimizer ist ein bekannter Angriffspunkt.
    remotePatterns: [
      {
        // Platzhalter-Fotos. Sobald der Betrieb eigene Bilder liefert,
        // wandern die nach /public und dieser Eintrag kann raus.
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Von Kunden hochgeladene Fotos (Vercel Blob)
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
