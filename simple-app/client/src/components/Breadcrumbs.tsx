import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  to?: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-2 text-sm py-4 overflow-x-auto">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2 whitespace-nowrap">
          {i > 0 && <span className="text-muted-foreground">›</span>}
          {item.to ? (
            <Link to={item.to} className="text-muted-foreground hover:text-primary transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
