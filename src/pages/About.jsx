import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import Reveal from "../components/Reveal";
import { FAQ, VALUES, STATS } from "../data";

export default function About() {
  const [open, setOpen] = useState(0);

  return (
    <>
      <section className="phead">
        <div className="phead__in">
          <p className="eyebrow">About</p>
          <h1>A company in Huye, not a campus.</h1>
          <p className="lede">
            Ascend AI was founded in 2021 because Rwanda was producing graduates who could
            pass an exam on algorithms and had never opened a pull request. We are a private
            company. We train, we place interns, and we build. Nobody here awards a degree.
          </p>
        </div>
      </section>

      <section className="sec">
        <div className="statrow">
          {STATS.map((s) => (
            <Reveal key={s.label}>
              <div className="statrow__i">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="sec sec--dark">
        <Reveal>
          <div className="sec__head">
            <p className="eyebrow">How we work</p>
            <h2>Four things we don't compromise on.</h2>
          </div>
        </Reveal>

        <div className="vals">
          {VALUES.map(([h, d], i) => (
            <Reveal key={h}>
              <article className="val" style={{ "--d": `${i * 60}ms` }}>
                <h3>{h}</h3>
                <p>{d}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="sec">
        <Reveal>
          <div className="sec__head">
            <p className="eyebrow">Questions</p>
            <h2>Straight answers.</h2>
          </div>
        </Reveal>

        <div className="faq">
          {FAQ.map((f, i) => (
            <Reveal key={f.q}>
              <div className={`fq ${open === i ? "fq--open" : ""}`}>
                <button onClick={() => setOpen(open === i ? null : i)}>
                  <span>{f.q}</span>
                  <ChevronDown size={18} />
                </button>
                <div className="fq__a">
                  <p>{f.a}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="sec">
        <Reveal>
          <div className="cta">
            <div>
              <h3>Still have a question?</h3>
              <p>Ask us directly. We read everything that comes in.</p>
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
