import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import Reveal from "../components/Reveal";

const STEPS = [
  ["Scope", "We sit with you for a morning and find out what your staff actually need to be able to do — not what a syllabus says they should know."],
  ["Design", "We write a curriculum around your systems, your data, and your tools. You approve it before anyone teaches anything."],
  ["Deliver", "At your office, at ours, or online. Evenings and weekends if that's what your operations require."],
  ["Follow up", "Six weeks later we come back and check whether it stuck. If it didn't, we fix it."],
];

const AUDIENCE = [
  "Banks and microfinance institutions automating decisions",
  "Government agencies with data and no one to read it",
  "NGOs that collect more than they can analyse",
  "Companies whose engineers are strong but have never touched ML",
];

export default function Teams() {
  return (
    <>
      <section className="phead">
        <div className="phead__in">
          <p className="eyebrow">For teams</p>
          <h1>We train your staff on your problems.</h1>
          <p className="lede">
            Generic AI courses teach people to solve someone else's problem. We build the
            curriculum around your systems and your data, and we deliver it where your team
            already is.
          </p>
          <div className="phead__cta">
            <Link to="/apply?track=TEAMS" className="btn btn--gold btn--lg">
              Request a scoping call <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="sec">
        <Reveal>
          <div className="sec__head">
            <p className="eyebrow">How it runs</p>
            <h2>Four steps, no surprises.</h2>
          </div>
        </Reveal>

        <div className="steps">
          {STEPS.map(([h, d], i) => (
            <Reveal key={h}>
              <article className="step" style={{ "--d": `${i * 60}ms` }}>
                <span className="step__n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{h}</h3>
                <p>{d}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="sec sec--dark">
        <div className="split">
          <Reveal>
            <div>
              <p className="eyebrow">Who this is for</p>
              <h2>Organisations with data and no one to use it.</h2>
              <p className="sec__sub">
                If your team already has the domain knowledge and just needs the technical
                capability, this is the fastest route. We don't replace your people. We make
                them dangerous.
              </p>
              <ul className="ticks">
                {AUDIENCE.map((a) => (
                  <li key={a}>
                    <Check size={16} /> {a}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal>
            <div className="quotebox">
              <p className="quotebox__q">
                We asked for a Python course. What we got was our own reporting pipeline,
                rebuilt by our own analysts, during the course.
              </p>
              <p className="quotebox__a">
                — Operations lead, financial services client
              </p>
              <div className="quotebox__foot">
                <span>Closed cohort · 12 staff · 8 weeks · on site</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="sec">
        <Reveal>
          <div className="cta">
            <div>
              <h3>Tell us what your team can't do yet.</h3>
              <p>We'll tell you honestly whether training is the answer, or whether you need us to build it instead.</p>
            </div>
            <Link to="/apply?track=TEAMS" className="btn btn--gold btn--lg">
              Start a conversation <ArrowRight size={18} />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
