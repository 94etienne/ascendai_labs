import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, RefreshCw, LogOut } from "lucide-react";
import { fetchMe, logout } from "../api";
import { firstName } from "./dash/shared";
import LearnerDash from "./dash/LearnerDash";
import InstructorDash from "./dash/InstructorDash";
import AdminDash from "./dash/AdminDash";

/* One dashboard route, four faces. We fetch /me once, read the
   role, and hand off to the right view. The header (greeting +
   identity + sign out) is shared; the body differs by role. */

const ROLE_COPY = {
  student: { eyebrow: "Your dashboard", lede: (n) => `Welcome back, ${n}.` },
  intern: { eyebrow: "Intern dashboard", lede: (n) => `Welcome back, ${n}.` },
  instructor: {
    eyebrow: "Instructor dashboard",
    lede: () => "Your assigned interns and today's attendance.",
  },
  admin: {
    eyebrow: "Admin console",
    lede: () => "Applications, people, internships, and certificates.",
  },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [state, setState] = useState("loading");
  const [errMsg, setErrMsg] = useState("");

  const load = async () => {
    setState("loading");
    setErrMsg("");
    try {
      const d = await fetchMe();
      setData(d);
      setState("ready");
    } catch (e) {
      const msg = e && e.message ? e.message : "Something went wrong.";
      if (/sign in|expired/i.test(msg)) {
        navigate("/login");
        return;
      }
      setErrMsg(msg);
      setState("error");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = () => {
    logout();
    navigate("/login");
  };

  if (state === "loading") {
    return (
      <section className="sec">
        <div className="skel skel--table">
          {[0, 1, 2, 3].map((i) => (
            <div className="skel__row" key={i}>
              <div className="skel__line" />
              <div className="skel__line skel__line--sm" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (state === "error") {
    return (
      <section className="sec">
        <div className="fail">
          <AlertTriangle size={22} />
          <h3>We couldn't load your dashboard.</h3>
          <p>{errMsg}</p>
          <button className="btn btn--gold" onClick={load}>
            <RefreshCw size={16} /> Try again
          </button>
        </div>
      </section>
    );
  }

  const user = data && data.user ? data.user : null;
  if (!user) {
    return (
      <section className="sec">
        <div className="fail">
          <AlertTriangle size={22} />
          <h3>We couldn't read your account.</h3>
          <p>The server replied, but not with the data we expected. Sign out and back in.</p>
          <button className="btn btn--gold" onClick={load}>
            <RefreshCw size={16} /> Try again
          </button>
        </div>
      </section>
    );
  }

  const role = user.role || "student";
  const copy = ROLE_COPY[role] || ROLE_COPY.student;
  const name = firstName(user.fullName);

  return (
    <>
      <section className="phead phead--dark">
        <div className="phead__in dash__head">
          <div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1>{copy.lede(name)}</h1>
            <p className="lede">
              <span className={`rolechip rolechip--${role}`}>{role}</span>
            </p>
          </div>
          <div className="dash__id">
            <dl>
              <div>
                <dt>Username</dt>
                <dd>
                  <code>{user.username || "—"}</code>
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{user.email || "—"}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{user.phone || "—"}</dd>
              </div>
            </dl>
            <button className="dash__out" onClick={signOut}>
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </div>
      </section>

      {/* role-specific body */}
      {(role === "student" || role === "intern") && <LearnerDash data={data} />}
      {role === "instructor" && <InstructorDash />}
      {role === "admin" && <AdminDash />}
    </>
  );
}
