import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { ArrowRight, Check, Eye, EyeOff, ShieldCheck } from "lucide-react";
import Reveal from "../components/Reveal";
import { setPassword, resetPassword } from "../api";

const MIN = 8;

/* A crude but honest strength read. Not a security control —
   the server enforces the real minimum. This is just feedback. */
function strength(pw) {
  if (pw.length < MIN) return { level: 0, label: "Too short" };
  let score = 0;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { level: 1, label: "Weak" };
  if (score === 2) return { level: 2, label: "Fair" };
  if (score === 3) return { level: 3, label: "Good" };
  return { level: 4, label: "Strong" };
}

export default function SetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token") || "";
  const isReset = params.get("reset") === "1";

  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const s = strength(pw);

  const submit = async () => {
    setErr("");

    if (pw.length < MIN) {
      setErr(`Your password must be at least ${MIN} characters.`);
      return;
    }
    if (pw !== pw2) {
      setErr("The two passwords don't match.");
      return;
    }

    setBusy(true);
    try {
      const fn = isReset ? resetPassword : setPassword;
      const data = await fn(token, pw);

      /* set-password signs you straight in; reset does not */
      if (data.token) {
        localStorage.setItem("ascend_jwt", data.token);
        localStorage.setItem("ascend_user", JSON.stringify(data.user));
      }

      setDone(true);
      setTimeout(() => navigate(data.token ? "/" : "/login"), 2200);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  /* No token in the URL at all */
  if (!token) {
    return (
      <section className="auth">
        <div className="auth__box">
          <h1>That link isn't complete.</h1>
          <p className="lede">
            The link you followed is missing its token. Check the email again, or request a
            fresh one.
          </p>
          <Link to="/login" className="btn btn--gold btn--lg">
            Go to sign in <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    );
  }

  if (done) {
    return (
      <section className="auth">
        <div className="auth__box auth__box--done">
          <div className="done__ring">
            <Check size={26} />
          </div>
          <h1>Password set.</h1>
          <p className="lede">
            {isReset
              ? "You can sign in with your new password now."
              : "You're signed in. Taking you through…"}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="auth">
      <Reveal>
        <div className="auth__box">
          <span className="auth__badge">
            <ShieldCheck size={14} /> One-time link
          </span>

          <h1>{isReset ? "Choose a new password." : "Set your password."}</h1>
          <p className="lede">
            {isReset
              ? "Pick something you haven't used elsewhere."
              : "This is the last step. Pick a password and you're in."}
          </p>

          <div className="auth__form">
            <label>
              <span>New password</span>
              <div className="auth__pw">
                <input
                  type={show ? "text" : "password"}
                  value={pw}
                  onChange={(e) => setPw(e.target.value)}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShow(!show)}
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            {pw.length > 0 && (
              <div className="meter">
                <div className="meter__bars">
                  {[1, 2, 3, 4].map((n) => (
                    <span
                      key={n}
                      className={`meter__b ${
                        s.level >= n ? `meter__b--${s.level}` : ""
                      }`}
                    />
                  ))}
                </div>
                <span className={`meter__t meter__t--${s.level}`}>{s.label}</span>
              </div>
            )}

            <label>
              <span>Confirm password</span>
              <input
                type={show ? "text" : "password"}
                value={pw2}
                onChange={(e) => setPw2(e.target.value)}
                placeholder="Type it again"
                autoComplete="new-password"
              />
            </label>

            {err && <p className="err">{err}</p>}

            <button
              className="btn btn--gold btn--lg btn--full"
              onClick={submit}
              disabled={busy}
            >
              {busy ? "Saving…" : isReset ? "Update password" : "Set password and sign in"}
              {!busy && <ArrowRight size={18} />}
            </button>

            <p className="fnote">
              We never email passwords and we'll never ask you for one. If a message
              claiming to be from us does either, it isn't from us.
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
