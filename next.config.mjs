/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // /geo → the GEO answer hub (static pages in public/geo). Redirecting to
      // the trailing index keeps the page's relative links resolving correctly.
      { source: "/geo", destination: "/geo/index.html", permanent: false },
    ];
  },
};

export default nextConfig;
