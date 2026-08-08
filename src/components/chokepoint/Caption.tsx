/** One-line caption stating what a visual adds that the others do not. */
export function Caption({ children }: { children: React.ReactNode }) {
  return (
    <p className="mono mt-2 text-[10.5px] leading-relaxed text-text-muted">
      {children}
    </p>
  );
}
