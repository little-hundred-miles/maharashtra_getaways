export const metadata = {
  title: "MahaGetaways — Adventure experiences across Maharashtra",
  description:
    "Discover destinations, compare adventure experiences, view pricing and itineraries, and book verified local operators across Maharashtra.",
};

export const viewport = {
  themeColor: "#163d2b",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/styles.css?v=8" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
