import { Link } from "react-router-dom";
import { ArrowRight, Check, MapPin, Clock, Wallet, CalendarDays, Users } from "lucide-react";
import Reveal from "../components/Reveal";
import { INTERNSHIP, PHASES } from "../data";

const FACTS = [
  { icon: <MapPin size={16} />, k: "Where", v: INTERNSHIP.location },
  { icon: <Clock size={16} />, k: "Length", v: INTERNSHIP.length },
  { icon: <Wallet size={16} />, k: "Fee", v: INTERNSHIP.cost },
  { icon: <CalendarDays size={16} />, k: "Intakes", v: INTERNSHIP.intake },
  { icon: <Users size={16} />, k: "Places", v: INTERNSHIP.seats },
];

export default function Internships() {
  return (
    <>
      <section className="phead phead--dark">
        <div className="phead__in">
          <p className="eyebrow">Internship</p>
          <h1>You can't learn to ship by watching someone ship.</h1>
          <p className="lede">
            Our internship is on site, in Huye, full time. You sit with the team and work on
            software we are delivering to a paying client. It is not a remote arrangement and
            it is not a shadowing exercise — you write code that goes to production.
          </p>
        </div>
      </section>

      <section className="sec">
        <div className="facts">
          {FACTS.map((f) => (
            <Reveal key={f.k}>
              <div className="fact">
                <span className="fact__i">{f.icon}</span>
                <dt>{f.k}</dt>
                <dd>{f.v}</dd>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="sec sec--dark">
        <div className="split">
          <Reveal>
            <div>
              <p className="eyebrow">What you get</p>
              <h2>A reference that means something.</h2>
              <p className="sec__sub">
                At the end you have three things a fresh graduate almost never has: code in
                production, an engineer who will vouch for you by name, and a portfolio you
                can talk through in an interview.
              </p>
              <ul className="ticks">
                <li>
                  <Check size={16} /> A named mentor and a weekly code review
                </li>
                <li>
                  <Check size={16} /> Your own feature, shipped to a real client
                </li>
                <li>
                  <Check size={16} /> Introductions to the companies we work with
                </li>
                <li>
                  <Check size={16} /> A desk, a machine, and a team that expects things of you
                </li>
                <li>
                  <Check size={16} /> Attendance reported and your school report signed
                </li>
              </ul>
              <Link to="/apply?track=INTERNSHIP" className="btn btn--gold btn--lg">
                Apply for the internship <ArrowRight size={18} />
              </Link>
            </div>
          </Reveal>

          <Reveal>
            <div className="timeline">
              {PHASES.map(([t, h, d]) => (
                <div className="tl" key={t}>
                  <span className="tl__when">{t}</span>
                  <div className="tl__body">
                    <h4>{h}</h4>
                    <p>{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="sec">
        <Reveal>
          <div className="sec__head">
            <p className="eyebrow">Before you apply</p>
            <h2>Who we take.</h2>
          </div>
        </Reveal>

        <div className="who">
          <Reveal>
            <div className="who__col who__col--yes">
              <h4>We take you if</h4>
              <ul>
                <li>You can already write code — any language, any level of polish</li>
                <li>You are a secondary student, a university student on placement, or a recent graduate</li>
                <li>You can be in Huye, in the office, five days a week</li>
                <li>You have something you built, however small, that you can show us</li>
                <li>You understand this is a placement you pay for, not a job</li>
              </ul>
            </div>
          </Reveal>
          <Reveal>
            <div className="who__col who__col--no">
              <h4>Start with training instead if</h4>
              <ul>
                <li>You haven't written code before — take CS-101 first</li>
                <li>You need the placement to be remote</li>
                <li>You want theory rather than delivery pressure</li>
                <li>You're already employed and want to add AI to your role — take AI-201</li>
                <li>You are looking for paid work — we're honest that this is not that</li>
              </ul>
              <Link to="/training" className="card__link">
                Browse training <ArrowRight size={15} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
