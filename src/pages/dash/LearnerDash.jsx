import { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  ChevronDown,
  MapPin,
  School,
  Calendar,
  Download,
  Award,
  CalendarCheck,
  UserCheck,
} from "lucide-react";
import Reveal from "../../components/Reveal";
import { certificateDownloadUrl, fetchAttendance } from "../../api";
import { STATUS, ATT, fmtDate } from "./shared";

/* The dashboard a student or intern sees.
   - applications table (status, certificate)
   - for interns: their placement summary + their own attendance
     (read-only — they can't mark it; that's the instructor/admin) */
export default function LearnerDash({ data }) {
  const { user, applications = [], internship } = data;
  const [open, setOpen] = useState(null);

  const isIntern = user.role === "intern";

  return (
    <>
      {/* ---------- INTERN PLACEMENT PANEL ---------- */}
      {isIntern && internship && (
        <section className="sec sec--pb0">
          <Reveal>
            <InternPanel internship={internship} />
          </Reveal>
        </section>
      )}

      {/* ---------- APPLICATIONS ---------- */}
      <section className="sec">
        {applications.length === 0 ? (
          <Reveal>
            <div className="fail">
              <h3>Nothing here yet.</h3>
              <p>Once you apply, it'll appear here and you can track its status.</p>
              <Link to="/training" className="btn btn--gold">
                Browse training <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        ) : (
          <>
            <Reveal>
              <div className="sec__head">
                <p className="eyebrow">Applied positions</p>
                <h2>What you've applied for.</h2>
              </div>
            </Reveal>

            <Reveal>
              <div className="tbl-wrap">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Position</th>
                      <th className="tbl__hide-s">Mode</th>
                      <th className="tbl__hide-s">Applied</th>
                      <th>Status</th>
                      <th className="tbl__right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((a) => {
                      const st = STATUS[a.status] || STATUS.new;
                      const isOpen = open === a.id;
                      const canPrint = a.status === "completed" && Boolean(a.certSerial);

                      return (
                        <Fragment key={a.id}>
                          <tr className={`tbl__row ${isOpen ? "tbl__row--open" : ""}`}>
                            <td>
                              <span className="tbl__code">{a.track}</span>
                              <span className="tbl__name">{a.name || a.track}</span>
                            </td>
                            <td className="tbl__hide-s tbl__muted">{a.mode || "—"}</td>
                            <td className="tbl__hide-s tbl__muted">{fmtDate(a.createdAt)}</td>
                            <td>
                              <span className={`pill pill--${st.tone}`}>
                                {st.icon} {st.label}
                              </span>
                            </td>
                            <td className="tbl__right">
                              <div className="tbl__actions">
                                <button
                                  className="tbtn"
                                  type="button"
                                  onClick={() => setOpen(isOpen ? null : a.id)}
                                  aria-expanded={isOpen}
                                >
                                  <Eye size={14} /> View
                                  <ChevronDown
                                    size={13}
                                    className={`tbtn__chev ${isOpen ? "tbtn__chev--up" : ""}`}
                                  />
                                </button>
                                {canPrint && (
                                  <a
                                    className="tbtn tbtn--gold"
                                    href={certificateDownloadUrl(a.certSerial)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Award size={14} /> Certificate
                                  </a>
                                )}
                              </div>
                            </td>
                          </tr>

                          {isOpen && (
                            <tr className="tbl__detail">
                              <td colSpan={5}>
                                <div className="detail">
                                  <p className={`detail__says detail__says--${st.tone}`}>
                                    {st.says}
                                  </p>
                                  <div className="detail__grid">
                                    <div>
                                      <span className="detail__k">Position</span>
                                      <span className="detail__v">
                                        {a.track} — {a.name || "—"}
                                      </span>
                                    </div>
                                    {a.mode && (
                                      <div>
                                        <span className="detail__k">Mode</span>
                                        <span className="detail__v">{a.mode}</span>
                                      </div>
                                    )}
                                    {a.weeks ? (
                                      <div>
                                        <span className="detail__k">Length</span>
                                        <span className="detail__v">{a.weeks} weeks</span>
                                      </div>
                                    ) : null}
                                    {a.price && (
                                      <div>
                                        <span className="detail__k">Fee</span>
                                        <span className="detail__v">{a.price}</span>
                                      </div>
                                    )}
                                    <div>
                                      <span className="detail__k">Applied</span>
                                      <span className="detail__v">{fmtDate(a.createdAt)}</span>
                                    </div>
                                    {a.reviewedAt && (
                                      <div>
                                        <span className="detail__k">Reviewed</span>
                                        <span className="detail__v">{fmtDate(a.reviewedAt)}</span>
                                      </div>
                                    )}
                                  </div>

                                  {(a.school || a.location || a.internshipStart) && (
                                    <div className="detail__extra">
                                      {a.school && (
                                        <p>
                                          <School size={13} /> {a.school}
                                          {a.regNo && <span className="app__reg">{a.regNo}</span>}
                                        </p>
                                      )}
                                      {a.location && (
                                        <p>
                                          <MapPin size={13} /> {a.location}
                                        </p>
                                      )}
                                      {a.internshipStart && (
                                        <p>
                                          <Calendar size={13} /> {fmtDate(a.internshipStart)} →{" "}
                                          {fmtDate(a.internshipEnd)}
                                        </p>
                                      )}
                                    </div>
                                  )}

                                  {canPrint && (
                                    <a
                                      className="btn btn--gold detail__cert"
                                      href={certificateDownloadUrl(a.certSerial)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <Download size={15} /> Download certificate ({a.certSerial})
                                    </a>
                                  )}

                                  {a.status === "completed" && !a.certSerial && (
                                    <p className="detail__pending">
                                      Your placement is complete. We're preparing your
                                      certificate — check back shortly.
                                    </p>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Reveal>

            <Reveal>
              <div className="cta cta--pale">
                <div>
                  <h3>Want to apply for something else?</h3>
                  <p>You can hold more than one application at a time.</p>
                </div>
                <Link to="/training" className="btn btn--gold btn--lg">
                  Browse training <ArrowRight size={18} />
                </Link>
              </div>
            </Reveal>
          </>
        )}
      </section>
    </>
  );
}

/* ---------- Intern placement panel + own attendance ---------- */
function InternPanel({ internship }) {
  const [att, setAtt] = useState(null);
  const [state, setState] = useState("loading");

  useEffect(() => {
    let alive = true;
    fetchAttendance(internship.id)
      .then((d) => alive && (setAtt(d), setState("ready")))
      .catch(() => alive && setState("error"));
    return () => {
      alive = false;
    };
  }, [internship.id]);

  const present = Number(internship.present || 0);
  const total = Number(internship.total || 0);
  const rate = total ? Math.round((present / total) * 100) : null;

  return (
    <div className="ipanel">
      <div className="ipanel__head">
        <div>
          <p className="eyebrow">Your internship</p>
          <h2>On placement at Ascend AI.</h2>
        </div>
        <span className={`pill pill--${internship.status === "active" ? "live" : "good"}`}>
          {internship.status}
        </span>
      </div>

      <div className="ipanel__stats">
        <div className="istat">
          <span className="istat__k">
            <UserCheck size={14} /> Mentor
          </span>
          <span className="istat__v">{internship.mentor_name || "To be assigned"}</span>
        </div>
        <div className="istat">
          <span className="istat__k">
            <Calendar size={14} /> Dates
          </span>
          <span className="istat__v">
            {fmtDate(internship.starts_on)} → {fmtDate(internship.ends_on)}
          </span>
        </div>
        <div className="istat">
          <span className="istat__k">
            <CalendarCheck size={14} /> Attendance
          </span>
          <span className="istat__v">
            {rate == null ? "—" : `${rate}% · ${present}/${total} days`}
          </span>
        </div>
        <div className="istat">
          <span className="istat__k">Fee</span>
          <span className="istat__v">
            {internship.fee_paid ? "Paid" : "Outstanding"}
          </span>
        </div>
      </div>

      {/* attendance log — read only */}
      <div className="ipanel__att">
        <h4>Your attendance record</h4>
        {state === "loading" && <p className="tbl__muted">Loading…</p>}
        {state === "error" && (
          <p className="tbl__muted">Couldn't load your attendance just now.</p>
        )}
        {state === "ready" && att && att.attendance.length === 0 && (
          <p className="tbl__muted">
            No days recorded yet. Your mentor marks attendance each day you're in.
          </p>
        )}
        {state === "ready" && att && att.attendance.length > 0 && (
          <div className="attlog">
            {att.attendance.map((r) => {
              const a = ATT[r.status] || ATT.present;
              return (
                <div className="attlog__row" key={r.on_date}>
                  <span className="attlog__date">{fmtDate(r.on_date)}</span>
                  <span className={`pill pill--${a.tone}`}>{a.label}</span>
                  {r.notes && <span className="attlog__note">{r.notes}</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
