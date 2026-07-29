import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { NAV } from "../data";
import { currentUser, logout } from "../api";

function Brand({ foot = false }) {
  return (
    <Link to="/" className={`brand ${foot ? "brand--foot" : ""}`}>
      <span className="brand__mark">
        <span />
        <span />
        <span />
      </span>
      <span className="brand__name">
        Ascend<em>AI</em>
      </span>
    </Link>
  );
}

export default function Layout() {
  const [menu, setMenu] = useState(false);
  const [user, setUser] = useState(currentUser());
  const { pathname } = useLocation();
  const navigate = useNavigate();

  /* Re-read the stored user on every route change, so signing in
     or out updates the nav without a page refresh. */
  useEffect(() => {
    window.scrollTo(0, 0);
    setMenu(false);
    setUser(currentUser());
  }, [pathname]);

  const signOut = () => {
    logout();
    setUser(null);
    navigate("/login");
  };

  const initials = (user?.fullName || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div className="asc">
      <header className="nav">
        <Brand />

        <nav className="nav__links">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) => (isActive ? "on" : "")}
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        {/* signed in → avatar + dashboard | signed out → apply + sign in */}
        {user ? (
          <div className="nav__me">
            <Link to="/dashboard" className="nav__avatar" title="Your dashboard">
              <span>{initials || "?"}</span>
            </Link>
            <button className="nav__out" onClick={signOut} title="Sign out">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="nav__me">
            <Link to="/login" className="nav__signin">
              Sign in
            </Link>
            <Link to="/apply" className="btn btn--gold nav__cta">
              Apply
            </Link>
          </div>
        )}

        <button
          className="nav__burger"
          onClick={() => setMenu(!menu)}
          aria-label="Menu"
          aria-expanded={menu}
        >
          {menu ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {menu && (
        <div className="drawer">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to}>
              {n.label}
            </NavLink>
          ))}

          {user ? (
            <>
              <NavLink to="/dashboard">
                <LayoutDashboard size={16} /> Dashboard
              </NavLink>
              <button className="drawer__out" onClick={signOut}>
                <LogOut size={16} /> Sign out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Sign in</NavLink>
              <Link to="/apply" className="btn btn--gold">
                Apply
              </Link>
            </>
          )}
        </div>
      )}

      <main>
        <Outlet />
      </main>

      <footer className="foot">
        <div className="foot__top">
          <div>
            <Brand foot />
            <p className="foot__blurb">
              A private training and software company in Huye, Rwanda. We teach computer
              science and AI, we run an on-site internship, and we build systems for Rwandan
              organisations.
            </p>
          </div>
          <div className="foot__cols">
            <div>
              <h5>Learn</h5>
              <Link to="/training">Training programs</Link>
              <Link to="/internships">Internship</Link>
              <Link to="/teams">Team training</Link>
            </div>
            <div>
              <h5>Company</h5>
              <Link to="/work">Our work</Link>
              <Link to="/about">About</Link>
              <Link to="/apply">Contact</Link>
            </div>
            <div>
              <h5>Reach us</h5>
              <a href="mailto:19etienne@gmail.com">19etienne@gmail.com</a>
              <a href="tel:+250783716761">+250 783 716 761</a>
              <span className="foot__addr">Huye, Southern Province</span>
            </div>
          </div>
        </div>
        <div className="foot__bar">
          <span>© {new Date().getFullYear()} Ascend AI Ltd — Huye, Rwanda</span>
          <span className="foot__mot">Learn. Build. Rise.</span>
        </div>
      </footer>
    </div>
  );
}
