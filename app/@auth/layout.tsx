export default function Layout({ children }: { children: React.ReactNode }) {
  return <section className="h-screen flex items-center justify-center absolute w-full z-40">{children}</section>;
}
