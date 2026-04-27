import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-2xl font-bold text-foreground mb-2">Place not found</h1>
      <p className="text-muted-foreground mb-6">The page you're looking for doesn't exist.</p>
      <Link to="/" className="text-primary hover:underline">
        ← Back to Atlas
      </Link>
    </div>
  );
}
