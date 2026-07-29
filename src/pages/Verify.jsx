import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShieldCheck,
  ShieldX,
  ShieldAlert,
  Search,
  ArrowRight,
} from "lucide-react";
import { verifyCertificate } from "../api";

function fmtDate(s) {
  if (!s) return "—";
  return new Date(String(s).replace(" ", "T")).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default function Verify() {
  const { serial: serialParam } = useParams();

  const [serial, setSerial] = useState(serialParam || "");
  const [result, setResult] = useState(null);
  const [state, setState] = useState(serialParam ? "loading" : "idle");
  // idle | loading | done

  const check = async (s) => {
    const q = (s || serial).trim();
    if (!q) return;
    setState("loading");
    setResult(null);
    try {
      const data = await verifyCertificate(q);
      setResult(data);
    } catch (e) {
      /* verify returns 404 as a body, but a network error lands here */
      setResult({ valid: false, reason: "error", message: e.message });
    } finally {
      setState("done");
    }
  };

  useEffect(() => {
    if (serialParam) check(serialParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serialParam]);

  return (
    <section className="verify">
      <div className="verify__box">
        <div className="verify__head">
          <span className="verify__badge">
            <ShieldCheck size={14} /> Credential check
          </span>
          <h1>Verify an Ascend AI certificate.</h1>
          <p>
            Every certificate we issue carries a serial number. Enter it below — or scan the
            QR code on the document — to confirm it's genuine.
          </p>
        </div>

        {/* search */}
        <div className="verify__search">
          <input
            value={serial}
            onChange={(e) => setSerial(e.target.value.toUpperCase())}
            placeholder="ASC-2026-00042"
            onKeyDown={(e) => e.key === "Enter" && check()}
          />
          <button className="btn btn--gold" onClick={() => check()}>
            <Search size={16} /> Verify
          </button>
        </div>

        {/* result */}
        {state === "loading" && (
          <div className="verify__result verify__result--load">
            <div className="spin" />
            <p>Checking the register…</p>
          </div>
        )}

        {state === "done" && result?.valid && (
          <div className="verify__result verify__result--ok">
            <div className="verify__ring verify__ring--ok">
              <ShieldCheck size={30} />
            </div>
            <h2>Genuine certificate</h2>
            <p className="verify__sub">
              This serial is in our register and has not been revoked.
            </p>

            <dl className="verify__facts">
              <div>
                <dt>Awarded to</dt>
                <dd className="verify__name">{result.holderName}</dd>
              </div>
              <div>
                <dt>For completing</dt>
                <dd>{result.programName}</dd>
              </div>
              {result.startedOn && (
                <div>
                  <dt>Period</dt>
                  <dd>
                    {fmtDate(result.startedOn)} — {fmtDate(result.endedOn)}
                  </dd>
                </div>
              )}
              {result.hours ? (
                <div>
                  <dt>Hours</dt>
                  <dd>{result.hours}</dd>
                </div>
              ) : null}
              <div>
                <dt>Serial</dt>
                <dd><code>{result.serial}</code></dd>
              </div>
              <div>
                <dt>Issued</dt>
                <dd>{fmtDate(result.issuedAt)}</dd>
              </div>
            </dl>
          </div>
        )}

        {state === "done" && result && !result.valid && result.reason === "revoked" && (
          <div className="verify__result verify__result--warn">
            <div className="verify__ring verify__ring--warn">
              <ShieldAlert size={30} />
            </div>
            <h2>Revoked certificate</h2>
            <p className="verify__sub">
              Serial <code>{result.serial}</code> was issued by us, but has since been
              revoked. Treat it as void. If you were given this as proof of completion,
              contact us.
            </p>
          </div>
        )}

        {state === "done" && result && !result.valid && result.reason !== "revoked" && (
          <div className="verify__result verify__result--no">
            <div className="verify__ring verify__ring--no">
              <ShieldX size={30} />
            </div>
            <h2>No such certificate</h2>
            <p className="verify__sub">{result.message}</p>
            <p className="verify__hint">
              Check the serial for typos — it looks like <code>ASC-YYYY-NNNNN</code>. If it
              still doesn't match, the document may not be genuine.
            </p>
          </div>
        )}

        <div className="verify__foot">
          <span>Ascend AI — Huye, Rwanda</span>
          <Link to="/" className="verify__home">
            Back to site <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
