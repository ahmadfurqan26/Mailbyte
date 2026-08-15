import "./globals.css";

export const metadata = {
  title: "Built-in SMTP",
  description: "SMTP management and transactional email dashboard"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
