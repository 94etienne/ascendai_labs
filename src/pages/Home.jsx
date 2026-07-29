import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  MapPin,
  Clock,
  Wallet,
  Users,
} from "lucide-react";
import Reveal from "../components/Reveal";
import {
  AUDIENCES,
  STATS,
  PROGRAMS,
  INTERNSHIP,
  WORK,
  SERVICES,
  FAQ,
} from "../data";

function AudienceLadder({ active, setActive }) {
  return (
    <div className="ladder">
      {AUDIENCES.map((a, i) => (
        <button
          key={a.key}
          className={`rung ${active === i ? "rung--on" : ""}`}
          style={{ "--i": i }}
          onClick={() => setActive(i)}
          aria-pressed={active === i}
        >
          <span className="rung__bar" />
          <span className="rung__meta">
            <span className="rung__stage">{a.stage}</span>
            <span className="rung__title">{a.title}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

/* Section header with a "see the full page" link on the right */
function SecHead({ eyebrow, title, sub, to, cta }) {
  return (
    <div className="sec__bar">
      <div className="sec__head">
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {sub && <p className="sec__sub">{sub}</p>}
      </div>
      <Link to={to} className="sec__more">
        {cta} <ArrowRight size={15} />
      </Link>
    </div>
  );
}

export default function Home() {
  const [i, setI] = useState(1);
  const cur = AUDIENCES[i];

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section className="hero">
        <div className="hero__grain" />
        <div className="hero__inner">
          <div>
            <p className="eyebrow">Huye, Rwanda — training, internships, software</p>
            <h1>
              We don't give
              <br />
              <span className="hl">degrees</span>. We give
              <br />
              <span className="hl">skill</span>.
            </h1>
            <p className="lede">
              Ascend AI is a private company. We train Rwandans in computer science and AI —
              online and in person — we run a paid internship at our Huye office, and we
              build software for Rwandan organisations. The three feed each other.
            </p>
            <div className="hero__cta">
              <Link to="/training" className="btn btn--gold btn--lg">
                See training programs <ArrowRight size={18} />
              </Link>
              <Link to="/work" className="btn btn--ghost btn--lg">
                Hire our team
              </Link>
            </div>
            <ul className="hero__stats">
              {STATS.map((s) => (
                <li key={s.label}>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="hero__pick">Who are you?</p>
            <AudienceLadder active={i} setActive={setI} />
            <div className="rungcard">
              <div className="rungcard__top">
                <span className="chip">{cur.stage}</span>
              </div>
              <h3>{cur.title}</h3>
              <p>{cur.blurb}</p>
              <ul>
                {cur.points.map((p) => (
                  <li key={p}>
                    <Check size={15} /> {p}
                  </li>
                ))}
              </ul>
              <p className="rungcard__fmt">{cur.format}</p>
              <div className="rungcard__foot">
                <span className="price">{cur.price}</span>
                <Link
                  to={cur.key === "teams" ? "/teams" : "/training"}
                  className="rungcard__link"
                >
                  Explore <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- TRAINING PREVIEW ---------- */}
      <section className="sec">
        <Reveal>
          <SecHead
            eyebrow="Training"
            title="Courses that end in something you can show someone."
            sub="Short, practical, and capped. Most tracks run online; secondary-student workshops run in person at Huye; a few are hybrid."
            to="/training"
            cta="All 8 programs"
          />
        </Reveal>

        <div className="grid">
          {PROGRAMS.slice(0, 3).map((p, k) => (
            <Reveal key={p.code}>
              <article className="card" style={{ "--d": `${k * 55}ms` }}>
                <div className="card__top">
                  <span className="code">{p.code}</span>
                  <span className={`lvl lvl--${p.level.toLowerCase()}`}>{p.level}</span>
                </div>
                <h3>{p.name}</h3>
                <p>{p.desc}</p>
                <p className="card__aud">{p.audience}</p>
                <dl className="card__meta">
                  <div>
                    <dt>Mode</dt>
                    <dd>{p.mode}</dd>
                  </div>
                  <div>
                    <dt>Length</dt>
                    <dd>{p.weeks} weeks</dd>
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
      </section>

      {/* ---------- INTERNSHIP PREVIEW ---------- */}
      <section className="sec sec--dark">
        <div className="split">
          <Reveal>
            <div>
              <p className="eyebrow">Internship</p>
              <h2>You can't learn to ship by watching someone ship.</h2>
              <p className="sec__sub">
                On site, in Huye, full time. You sit with the team and write code that goes
                to a paying client. Not remote, not shadowing.
              </p>
              <ul className="ticks">
                <li>
                  <Check size={16} /> A desk, a machine, and a named mentor
                </li>
                <li>
                  <Check size={16} /> A named mentor and a weekly code review
                </li>
                <li>
                  <Check size={16} /> Your own feature, shipped to a real client
                </li>
              </ul>
              <div className="dualcta">
                <Link to="/internships" className="btn btn--gold btn--lg">
                  How it works <ArrowRight size={18} />
                </Link>
                <Link to="/apply?track=INTERNSHIP" className="btn btn--ghost btn--lg">
                  Apply now
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="facts facts--dark">
              {[
                { icon: <MapPin size={16} />, k: "Where", v: INTERNSHIP.location },
                { icon: <Clock size={16} />, k: "Length", v: INTERNSHIP.length },
                { icon: <Wallet size={16} />, k: "Fee", v: INTERNSHIP.cost },
                { icon: <Users size={16} />, k: "Places", v: INTERNSHIP.seats },
              ].map((f) => (
                <div className="fact" key={f.k}>
                  <span className="fact__i">{f.icon}</span>
                  <dt>{f.k}</dt>
                  <dd>{f.v}</dd>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- TEAMS PREVIEW ---------- */}
      <section className="sec">
        <Reveal>
          <SecHead
            eyebrow="For teams"
            title="We train your staff on your problems."
            sub="Generic AI courses teach people to solve someone else's problem. We build the curriculum around your systems and your data."
            to="/teams"
            cta="How team training works"
          />
        </Reveal>

        <div className="steps">
          {[
            ["Scope", "We find out what your staff need to be able to do — not what a syllabus says they should know."],
            ["Design", "A curriculum around your systems and your tools. You approve it before anyone teaches anything."],
            ["Deliver", "At your office, at ours, or online. Evenings and weekends if operations demand it."],
            ["Follow up", "Six weeks later we check whether it stuck. If it didn't, we fix it."],
          ].map(([h, d], k) => (
            <Reveal key={h}>
              <article className="step" style={{ "--d": `${k * 60}ms` }}>
                <span className="step__n">{String(k + 1).padStart(2, "0")}</span>
                <h3>{h}</h3>
                <p>{d}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- WORK PREVIEW ---------- */}
      <section className="sec sec--dark">
        <Reveal>
          <SecHead
            eyebrow="Our work"
            title="We build software. That's not a side business."
            sub="Half of Ascend AI is a delivery studio — and that work is what our training is drawn from and where our interns learn."
            to="/work"
            cta="All projects"
          />
        </Reveal>

        <div className="svc svc--dark">
          {SERVICES.map((s, k) => (
            <Reveal key={s.name}>
              <article className="svc__i" style={{ "--d": `${k * 50}ms` }}>
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="work work--tight">
          {WORK.slice(0, 3).map((w, k) => (
            <Reveal key={w.title}>
              <article className="wrk wrk--dark" style={{ "--d": `${k * 60}ms` }}>
                <div className="wrk__top">
                  <span className="wrk__tag">{w.tag}</span>
                  <span className="wrk__yr">{w.year}</span>
                </div>
                <h3>{w.title}</h3>
                <p className="wrk__client">{w.client}</p>
                <p className="wrk__res">{w.result}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- ABOUT PREVIEW ---------- */}
      <section className="sec">
        <Reveal>
          <SecHead
            eyebrow="About"
            title="A company in Huye, not a campus."
            sub="Founded in 2021 because Rwanda was producing graduates who could pass an exam on algorithms and had never opened a pull request. We do not award degrees."
            to="/about"
            cta="About us & FAQ"
          />
        </Reveal>

        <div className="faqprev">
          {FAQ.slice(0, 3).map((f, k) => (
            <Reveal key={f.q}>
              <div className="fqs" style={{ "--d": `${k * 55}ms` }}>
                <h4>{f.q}</h4>
                <p>{f.a}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <Link to="/about" className="card__link faq__more">
            Read all {FAQ.length} questions <ArrowRight size={15} />
          </Link>
        </Reveal>
      </section>

      {/* ---------- APPLY CTA ---------- */}
      <section className="sec sec--pt0">
        <Reveal>
          <div className="cta">
            <div>
              <h3>Ready to start?</h3>
              <p>
                Training, the internship, team training, or a project you want built — it's
                one form.
              </p>
            </div>
            <Link to="/apply" className="btn btn--gold btn--lg">
              Get in touch <ArrowRight size={18} />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
