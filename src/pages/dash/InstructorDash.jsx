import { useState, useEffect } from "react";
import {
  Users,
  CalendarCheck,
  Check,
  X,
  Pause,
  Sun,
  AlertTriangle,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import Reveal from "../../components/Reveal";
import { fetchInternships, markAttendance } from "../../api";
import { fmtDate, fmtDateLong, todayISO } from "./shared";

/* The instructor's job: see the interns assigned to them, and
   mark attendance for a chosen day. Attendance is the thing a
   school actually needs signed off, so it's front and centre. */

const MARKS = [
  { key: "present", label: "Present", icon: <Check size={14} />, tone: "good" },
  { key: "absent", label: "Absent", icon: <X size={14} />, tone: "no" },
  { key: "excused", label: "Excused", icon: <Pause size={14} />, tone: "hold" },
  { key: "holiday", label: "Holiday", icon: <Sun size={14} />, tone: "wait" },
];

export default function InstructorDash() {
  const [interns, setInterns] = useState([]);
  const [state, setState] = useState("loading");
  const [errMsg, setErrMsg] = useState("");
  const [date, setDate] = useState(todayISO());

  /* local record of what we've marked this session, keyed by
     internship id → status, so the buttons reflect the choice
     immediately without a full refetch. */
  const [marks, setMarks] = useState({});
  const [saving, setSaving] = useState(null);
  const [saved, setSaved] = useState(null);

  const load = async () => {
    setState("loading");
    setErrMsg("");
    try {
      const d = await fetchInternships();
      setInterns(d.internships);
      setState("ready");
    } catch (e) {
      setErrMsg(e.message);
      setState("error");
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* Changing the day clears the session marks — they belonged to
     the previous date. */
  useEffect(() => {
    setMarks({});
    setSaved(null);
  }, [date]);

  const mark = async (internshipId, status) => {
    setSaving(`${internshipId}:${status}`);
    setSaved(null);
    try {
      await markAttendance({ internshipId, date, status });
      setMarks((m) => ({ ...m, [internshipId]: status }));
      setSaved(internshipId);
      setTimeout(() => setSaved((cur) => (cur === internshipId ? null : cur)), 1800);
    } catch (e) {
      setErrMsg(e.message);
    } finally {
      setSaving(null);
    }
  };

  if (state === "loading") {
    return (
      <section className="sec">
        <div className="skel skel--table">
          {[0, 1, 2].map((i) => (
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
          <h3>We couldn't load your interns.</h3>
          <p>{errMsg}</p>
          <button className="btn btn--gold" onClick={load}>
            <RefreshCw size={16} /> Try again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="sec">
      {interns.length === 0 ? (
        <Reveal>
          <div className="fail">
            <Users size={22} />
            <h3>No interns assigned to you yet.</h3>
            <p>
              When an admin assigns an intern to you, they'll appear here and you'll be able
              to mark their attendance.
            </p>
          </div>
        </Reveal>
      ) : (
        <>
          <Reveal>
            <div className="rollcall__bar">
              <div className="sec__head">
                <p className="eyebrow">Attendance</p>
                <h2>Mark the roll for a day.</h2>
              </div>
              <label className="rollcall__date">
                <CalendarCheck size={15} />
                <input
                  type="date"
                  value={date}
                  max={todayISO()}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>
            </div>
          </Reveal>

          <Reveal>
            <p className="rollcall__for">
              Marking <strong>{fmtDateLong(date)}</strong> — tap a status for each intern.
            </p>
          </Reveal>

          <div className="rollcall">
            {interns.map((it) => {
              const chosen = marks[it.id];
              const rate = it.days_recorded
                ? Math.round((it.days_present / it.days_recorded) * 100)
                : null;

              return (
                <Reveal key={it.id}>
                  <div className={`rc ${saved === it.id ? "rc--saved" : ""}`}>
                    <div className="rc__who">
                      <span className="rc__name">{it.intern_name}</span>
                      <span className="rc__meta">
                        {it.school || "—"}
                        {it.reg_no && <span className="rc__reg">{it.reg_no}</span>}
                      </span>
                      <span className="rc__stat">
                        {fmtDate(it.starts_on)} → {fmtDate(it.ends_on)}
                        {rate != null && (
                          <span className="rc__rate">
                            {" · "}
                            {rate}% attendance ({it.days_present}/{it.days_recorded})
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="rc__marks">
                      {MARKS.map((m) => {
                        const on = chosen === m.key;
                        const busy = saving === `${it.id}:${m.key}`;
                        return (
                          <button
                            key={m.key}
                            type="button"
                            className={`markbtn markbtn--${m.tone} ${on ? "markbtn--on" : ""}`}
                            onClick={() => mark(it.id, m.key)}
                            disabled={Boolean(saving)}
                          >
                            {busy ? "…" : m.icon} {m.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
