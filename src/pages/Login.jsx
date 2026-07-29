import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Check } from "lucide-react";
import Reveal from "../components/Reveal";
import { login, forgotPassword } from "../api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  /* If RequireAuth bounced them here, send them back afterwards. */
  const from = location.state?.from || "/dashboard";

  const [mode, setMode] = useState("login"); // login | forgot
  const [identifier, setIdentifier] = useState("");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [sent, setSent] = useState("");
  const [busy, setBusy] = useState(false);

  const submitLogin = async () => {
    setErr("");
    if (!identifier.trim() || !pw) {
      setErr("Enter your username, email, or phone — and your password.");
      return;
    }

    setBusy(true);
    try {
      const data = await login(identifier.trim(), pw);
      localStorage.setItem("ascend_jwt", data.token);
      localStorage.setItem("ascend_user", JSON.stringify(data.user));
      navigate(from, { replace: true });
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  const submitForgot = async () => {
    setErr("");
    setSent("");
    if (!identifier.trim()) {
      setErr("Enter your username, email, or phone.");
      return;
    }

    setBusy(true);
    try {
      const data = await forgotPassword(identifier.trim());
      setSent(data.message);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  };

  const go = () => (mode === "login" ? submitLogin() : submitForgot());

  return (
    <section className="auth">
      <Reveal>
        <div className="auth__box">
          <h1>{mode === "login" ? "Sign in." : "Reset your password."}</h1>
          <p className="lede">
            {mode === "login"
              ? "Use your username, your email, or your phone number — whichever you remember."
              : "Tell us who you are and we'll email a reset link to the address on file."}
          </p>

          <div className="auth__form">
            <label>
              <span>Username, email, or phone</span>
              <input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="netienne  ·  you@email.com  ·  +250 7…"
                autoComplete="username"
                onKeyDown={(e) => e.key === "Enter" && go()}
              />
            </label>

            {mode === "login" && (
              <label>
                <span>Password</span>
                <div className="auth__pw">
                  <input
                    type={show ? "text" : "password"}
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                    placeholder="Your password"
                    autoComplete="current-password"
                    onKeyDown={(e) => e.key === "Enter" && go()}
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
            )}

            {err && <p className="err">{err}</p>}

            {sent && (
              <p className="sent">
                <Check size={15} /> {sent}
              </p>
            )}

            <button
              className="btn btn--gold btn--lg btn--full"
              onClick={go}
              disabled={busy}
            >
              {busy ? "Working…" : mode === "login" ? "Sign in" : "Send reset link"}
              {!busy && <ArrowRight size={18} />}
            </button>

            <div className="auth__alt">
              {mode === "login" ? (
                <button
                  className="auth__link"
                  onClick={() => {
                    setMode("forgot");
                    setErr("");
                  }}
                >
                  Forgot your password?
                </button>
              ) : (
                <button
                  className="auth__link"
                  onClick={() => {
                    setMode("login");
                    setErr("");
                    setSent("");
                  }}
                >
                  ← Back to sign in
                </button>
              )}
            </div>

            <p className="fnote">
              No account? It's created for you when you{" "}
              <Link to="/apply" className="fnote__l">
                apply
              </Link>
              .
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
