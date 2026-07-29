import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Monitor,
  MapPin,
  Layers,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import Reveal from "../components/Reveal";
import { fetchPrograms } from "../api";

const FILTERS = [
  "All",
  "Secondary students",
  "Graduates",
  "Professionals",
  "Organisations",
];

const MODE_ICON = (mode = "") => {
  if (mode.startsWith("Online")) return <Monitor size={13} />;
  if (mode.startsWith("In person")) return <MapPin size={13} />;
  return <Layers size={13} />;
};

export default function Training() {
  const [f, setF] = useState("All");
  const [programs, setPrograms] = useState([]);
  const [state, setState] = useState("loading"); // loading | ready | error
  const [errMsg, setErrMsg] = useState("");

  const load = async () => {
    setState("loading");
    setErrMsg("");
    try {
      const { programs } = await fetchPrograms();
      setPrograms(programs);
      setState("ready");
    } catch (e) {
      setErrMsg(e.message);
      setState("error");
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* Filter client-side — the list is small and this keeps
     the buttons instant instead of round-tripping the API. */
  const shown =
    f === "All"
      ? programs
      : programs.filter((p) => (p.audience || "").includes(f.split(" ")[0]));

  return (
    <>
      <section className="phead">
        <div className="phead__in">
          <p className="eyebrow">Training</p>
          <h1>Courses that end in something you can show someone.</h1>
          <p className="lede">
            Short, practical, and capped. Most tracks run online; secondary-student
            workshops run in person at our Huye office; a few are hybrid. We are a company,
            not a school — you leave with a portfolio, not a transcript.
          </p>
        </div>
      </section>

      <section className="sec">
        {/* ---------- LOADING ---------- */}
        {state === "loading" && (
          <div className="grid">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div className="skel" key={i}>
                <div className="skel__line skel__line--sm" />
                <div className="skel__line skel__line--lg" />
                <div className="skel__line" />
                <div className="skel__line" />
                <div className="skel__line skel__line--sm" />
              </div>
            ))}
          </div>
        )}

        {/* ---------- ERROR ---------- */}
        {state === "error" && (
          <div className="fail">
            <AlertTriangle size={22} />
            <h3>We couldn't load the programs.</h3>
            <p>{errMsg}</p>
            <button className="btn btn--gold" onClick={load}>
              <RefreshCw size={16} /> Try again
            </button>
          </div>
        )}

        {/* ---------- READY ---------- */}
        {state === "ready" && (
          <>
            <div className="filters">
              {FILTERS.map((x) => (
                <button
                  key={x}
                  className={`fil ${f === x ? "fil--on" : ""}`}
                  onClick={() => setF(x)}
                >
                  {x}
                </button>
              ))}
            </div>

            <div className="grid">
              {shown.map((p, i) => (
                <Reveal key={p.code}>
                  <article className="card" style={{ "--d": `${i * 45}ms` }}>
                    <div className="card__top">
                      <span className="code">{p.code}</span>
                      <span className={`lvl lvl--${(p.level || "").toLowerCase()}`}>
                        {p.level}
                      </span>
                    </div>
                    <h3>{p.name}</h3>
                    <p>{p.desc}</p>
                    <p className="card__aud">{p.audience}</p>
                    <dl className="card__meta">
                      <div>
                        <dt>Mode</dt>
                        <dd className="card__mode">
                          {MODE_ICON(p.mode)} {p.mode}
                        </dd>
                      </div>
                      <div>
                        <dt>Length</dt>
                        <dd>{p.weeks ? `${p.weeks} weeks` : "Scoped"}</dd>
                      </div>
                      <div>
                        <dt>Fee</dt>
                        <dd>{p.price}</dd>
                      </div>
                    </dl>
                    <Link to={`/apply?track=${p.code}`} className="card__link">
                      Enroll <ArrowRight size={15} />
                    </Link>
                  </article>
                </Reveal>
              ))}
            </div>

            {shown.length === 0 && (
              <p className="empty">
                No programs for that group yet. Ask us — we may be able to build one.
              </p>
            )}
          </>
        )}
      </section>

      <section className="sec sec--dark">
        <Reveal>
          <div className="cta cta--flat">
            <div>
              <h3>Finished a training track?</h3>
              <p>Graduates of our programs go to the front of the internship queue.</p>
            </div>
            <Link to="/internships" className="btn btn--gold btn--lg">
              About the internship <ArrowRight size={18} />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
