import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="nf">
      <p className="eyebrow">404</p>
      <h1>That page doesn't exist.</h1>
      <p className="lede">
        It may have moved, or the link may be wrong. Everything we offer is one click away.
      </p>
      <div className="nf__links">
        <Link to="/training" className="btn btn--gold btn--lg">
          Training <ArrowRight size={18} />
        </Link>
        <Link to="/" className="btn btn--ghost btn--lg">
          Back home
        </Link>
      </div>
    </section>
  );
}
