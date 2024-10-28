export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="h-screen flex items-center justify-center bg-orange-700">
      {children}
    </section>
  );
}
