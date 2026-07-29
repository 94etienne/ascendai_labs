import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "../components/Reveal";
import { WORK, SERVICES } from "../data";

export default function Work() {
  return (
    <>
      <section className="phead">
        <div className="phead__in">
          <p className="eyebrow">Our work</p>
          <h1>We build software. That's not a side business.</h1>
          <p className="lede">
            Half of Ascend AI is a delivery studio. We build machine learning systems,
            computer vision, and web platforms for Rwandan organisations — and that work is
            what our training is drawn from and where our interns learn.
          </p>
          <div className="phead__cta">
            <Link to="/apply?track=BUILD" className="btn btn--gold btn--lg">
              Discuss a project <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="sec">
        <Reveal>
          <div className="sec__head">
            <p className="eyebrow">Services</p>
            <h2>What we're actually good at.</h2>
          </div>
        </Reveal>

        <div className="svc">
          {SERVICES.map((s, i) => (
            <Reveal key={s.name}>
              <article className="svc__i" style={{ "--d": `${i * 55}ms` }}>
                <h3>{s.name}</h3>
                <p>{s.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="sec sec--dark">
        <Reveal>
          <div className="sec__head">
            <p className="eyebrow">Delivered</p>
            <h2>Projects, and what they changed.</h2>
            <p className="sec__sub">
              Client names withheld where the engagement requires it. We'll walk you through
              any of these on a call.
            </p>
          </div>
        </Reveal>

        <div className="work">
          {WORK.map((w, i) => (
            <Reveal key={w.title}>
              <article className="wrk wrk--dark" style={{ "--d": `${i * 50}ms` }}>
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

      <section className="sec">
        <Reveal>
          <div className="cta">
            <div>
              <h3>Need a system built?</h3>
              <p>
                Tell us the problem. We'll tell you honestly whether we're the right people —
                and if we aren't, who is.
              </p>
            </div>
            <Link to="/apply?track=BUILD" className="btn btn--gold btn--lg">
              Start a conversation <ArrowRight size={18} />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
