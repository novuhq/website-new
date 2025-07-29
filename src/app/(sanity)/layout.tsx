export default function SanityRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <body style={{ margin: 0 }}>{children}</body>
}
