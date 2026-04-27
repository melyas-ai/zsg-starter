import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-primary font-bold text-xl tracking-tight">Atlas</span>
          <span className="text-muted-foreground text-xs tracking-widest uppercase hidden sm:inline">Orientation</span>
        </Link>
      </div>
    </header>
  );
}
