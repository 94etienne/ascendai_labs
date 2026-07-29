import { useState, useEffect } from "react";
import {
  LayoutGrid,
  FileText,
  Users,
  Award,
  AlertTriangle,
  RefreshCw,
  Check,
  ChevronDown,
  Search,
  GraduationCap,
  Briefcase,
  UserCog,
} from "lucide-react";
import Reveal from "../../components/Reveal";
import {
  fetchOverview,
  fetchApplications,
  updateApplicationStatus,
  issueCertificate,
  listUsers,
  listInstructors,
  setUserRole,
  createInternship,
} from "../../api";
import { STATUS, fmtDate } from "./shared";

const TABS = [
  { key: "overview", label: "Overview", icon: <LayoutGrid size={15} /> },
  { key: "apps", label: "Applications", icon: <FileText size={15} /> },
  { key: "people", label: "People", icon: <Users size={15} /> },
];

export default function AdminDash() {
  const [tab, setTab] = useState("overview");

  return (
    <section className="sec">
      <Reveal>
        <div className="adtabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`adtab ${tab === t.key ? "adtab--on" : ""}`}
              onClick={() => setTab(t.key)}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </Reveal>

      {tab === "overview" && <Overview />}
      {tab === "apps" && <Applications />}
      {tab === "people" && <People />}
    </section>
  );
}

/* ============================================================
   OVERVIEW — the numbers at a glance
   ============================================================ */
function Overview() {
  const [o, setO] = useState(null);
  const [state, setState] = useState("loading");
  const [errMsg, setErrMsg] = useState("");

  const load = async () => {
    setState("loading");
    try {
      setO(await fetchOverview());
      setState("ready");
    } catch (e) {
      setErrMsg(e.message);
      setState("error");
    }
  };
  useEffect(() => {
    load();
  }, []);

  if (state === "loading") return <p className="tbl__muted">Loading…</p>;
  if (state === "error")
    return (
      <div className="fail">
        <AlertTriangle size={22} />
        <h3>Couldn't load the overview.</h3>
        <p>{errMsg}</p>
        <button className="btn btn--gold" onClick={load}>
          <RefreshCw size={16} /> Try again
        </button>
      </div>
    );

  const cards = [
    { k: "New applications", v: o.applications.new, sub: `${o.applications.total} total`, icon: <FileText size={18} />, tone: "wait" },
    { k: "Under review", v: o.applications.reviewing, sub: `${o.applications.accepted} accepted`, icon: <Search size={18} />, tone: "live" },
    { k: "Active interns", v: o.internships.active, sub: `${o.internships.total} placements`, icon: <Briefcase size={18} />, tone: "good" },
    { k: "Certificates", v: o.certificates.issued, sub: "issued & valid", icon: <Award size={18} />, tone: "done" },
  ];

  return (
    <>
      <Reveal>
        <div className="ovgrid">
          {cards.map((c) => (
            <div className={`ovcard ovcard--${c.tone}`} key={c.k}>
              <span className="ovcard__i">{c.icon}</span>
              <span className="ovcard__v">{c.v}</span>
              <span className="ovcard__k">{c.k}</span>
              <span className="ovcard__sub">{c.sub}</span>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <div className="ovpeople">
          <div className="ovpeople__i">
            <GraduationCap size={16} /> <strong>{o.people.students}</strong> students
          </div>
          <div className="ovpeople__i">
            <Briefcase size={16} /> <strong>{o.people.interns}</strong> interns
          </div>
          <div className="ovpeople__i">
            <UserCog size={16} /> <strong>{o.people.instructors}</strong> instructors
          </div>
        </div>
      </Reveal>
    </>
  );
}

/* ============================================================
   APPLICATIONS — review, change status, issue certificate
   ============================================================ */
const FLOW = ["new", "reviewing", "accepted", "waitlisted", "rejected", "completed"];

function Applications() {
  const [apps, setApps] = useState([]);
  const [state, setState] = useState("loading");
  const [errMsg, setErrMsg] = useState("");
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(null);
  const [busy, setBusy] = useState(null);
  const [note, setNote] = useState("");
  const [instructors, setInstructors] = useState([]);

  const load = async () => {
    setState("loading");
    try {
      const d = await fetchApplications(filter ? { status: filter } : {});
      setApps(d.applications);
      setState("ready");
    } catch (e) {
      setErrMsg(e.message);
      setState("error");
    }
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  /* Instructors, loaded once — the placement dropdown needs them. */
  useEffect(() => {
    listInstructors()
      .then((d) => setInstructors(d.instructors || []))
      .catch(() => {});
  }, []);

  const changeStatus = async (id, status) => {
    setBusy(id);
    try {
      await updateApplicationStatus(id, status, note || undefined);
      setNote("");
      await load();
    } catch (e) {
      setErrMsg(e.message);
    } finally {
      setBusy(null);
    }
  };

  const issueCert = async (id) => {
    setBusy(id);
    try {
      const r = await issueCertificate(id, undefined);
      alert(`Certificate issued: ${r.serial}`);
      await load();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(null);
    }
  };

  /* Turn an accepted application into an active internship under a
     chosen mentor. This is what populates the instructor's
     dashboard and starts the attendance chain. */
  const placeIntern = async (id, mentorId) => {
    setBusy(id);
    try {
      await createInternship(id, { mentorId: mentorId || undefined });
      alert("Intern placed. They now appear on the instructor's dashboard.");
      await load();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(null);
    }
  };

  if (state === "loading") return <p className="tbl__muted">Loading applications…</p>;
  if (state === "error")
    return (
      <div className="fail">
        <AlertTriangle size={22} />
        <h3>Couldn't load applications.</h3>
        <p>{errMsg}</p>
        <button className="btn btn--gold" onClick={load}>
          <RefreshCw size={16} /> Try again
        </button>
      </div>
    );

  return (
    <>
      <Reveal>
        <div className="adfilter">
          <button className={`fil ${filter === "" ? "fil--on" : ""}`} onClick={() => setFilter("")}>
            All
          </button>
          {FLOW.map((s) => (
            <button
              key={s}
              className={`fil ${filter === s ? "fil--on" : ""}`}
              onClick={() => setFilter(s)}
            >
              {STATUS[s].label}
            </button>
          ))}
        </div>
      </Reveal>

      {apps.length === 0 ? (
        <p className="empty">No applications{filter ? ` with status "${filter}"` : ""} yet.</p>
      ) : (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Applicant</th>
                <th className="tbl__hide-s">Track</th>
                <th>Status</th>
                <th className="tbl__right">Manage</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((a) => {
                const st = STATUS[a.status] || STATUS.new;
                const isOpen = open === a.id;
                return (
                  <ApplicationRow
                    key={a.id}
                    a={a}
                    st={st}
                    isOpen={isOpen}
                    busy={busy === a.id}
                    note={note}
                    setNote={setNote}
                    onToggle={() => setOpen(isOpen ? null : a.id)}
                    onStatus={changeStatus}
                    onIssue={issueCert}
                    onPlace={placeIntern}
                    instructors={instructors}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function ApplicationRow({
  a,
  st,
  isOpen,
  busy,
  note,
  setNote,
  onToggle,
  onStatus,
  onIssue,
  onPlace,
  instructors,
}) {
  /* mentor chosen in the placement dropdown, local to this row */
  const [mentor, setMentor] = useState("");
  return (
    <>
      <tr className={`tbl__row ${isOpen ? "tbl__row--open" : ""}`}>
        <td>
          <span className="tbl__name">{a.full_name}</span>
          <span className="tbl__muted tbl__sub">{a.email}</span>
        </td>
        <td className="tbl__hide-s">
          <span className="tbl__code">{a.track}</span>
        </td>
        <td>
          <span className={`pill pill--${st.tone}`}>
            {st.icon} {st.label}
          </span>
        </td>
        <td className="tbl__right">
          <button className="tbtn" onClick={onToggle} aria-expanded={isOpen}>
            Manage
            <ChevronDown size={13} className={`tbtn__chev ${isOpen ? "tbtn__chev--up" : ""}`} />
          </button>
        </td>
      </tr>

      {isOpen && (
        <tr className="tbl__detail">
          <td colSpan={4}>
            <div className="detail">
              <div className="detail__grid">
                <div>
                  <span className="detail__k">Phone</span>
                  <span className="detail__v">{a.phone}</span>
                </div>
                <div>
                  <span className="detail__k">Stage</span>
                  <span className="detail__v">{a.stage || "—"}</span>
                </div>
                {a.school && (
                  <div>
                    <span className="detail__k">School</span>
                    <span className="detail__v">{a.school}</span>
                  </div>
                )}
                {a.reg_no && (
                  <div>
                    <span className="detail__k">Reg no.</span>
                    <span className="detail__v">{a.reg_no}</span>
                  </div>
                )}
                {a.location && (
                  <div>
                    <span className="detail__k">Location</span>
                    <span className="detail__v">{a.location}</span>
                  </div>
                )}
                <div>
                  <span className="detail__k">Applied</span>
                  <span className="detail__v">{fmtDate(a.created_at)}</span>
                </div>
              </div>

              {a.message && <p className="detail__msg">"{a.message}"</p>}

              {/* status controls */}
              <div className="adactions">
                <span className="adactions__lbl">Set status</span>
                <div className="adactions__row">
                  {FLOW.map((s) => (
                    <button
                      key={s}
                      className={`markbtn markbtn--${STATUS[s].tone} ${
                        a.status === s ? "markbtn--on" : ""
                      }`}
                      disabled={busy || a.status === s}
                      onClick={() => onStatus(a.id, s)}
                    >
                      {STATUS[s].label}
                    </button>
                  ))}
                </div>

                {/* Place an accepted applicant as an intern under a
                    mentor. This is what makes them show on the
                    instructor's dashboard and starts attendance. */}
                {a.status === "accepted" && (
                  <div className="adactions__place">
                    <span className="adactions__lbl">Place as intern</span>
                    <div className="adplace">
                      <select
                        className="roleselect"
                        value={mentor}
                        onChange={(e) => setMentor(e.target.value)}
                        disabled={busy}
                      >
                        <option value="">No mentor yet</option>
                        {instructors.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.full_name} ({m.active_interns ?? 0} active)
                          </option>
                        ))}
                      </select>
                      <button
                        className="btn btn--gold"
                        disabled={busy}
                        onClick={() => onPlace(a.id, mentor)}
                      >
                        <Briefcase size={15} /> Place intern
                      </button>
                    </div>
                    <p className="adplace__note">
                      Placing them assigns the internship and lets the mentor take
                      attendance. You can change the mentor later.
                    </p>
                  </div>
                )}

                {a.status === "completed" && (
                  <div className="adactions__cert">
                    {a.certificate_serial ? (
                      <span className="adactions__has">
                        <Check size={14} /> Certificate issued: <code>{a.certificate_serial}</code>
                      </span>
                    ) : (
                      <button
                        className="btn btn--gold"
                        disabled={busy}
                        onClick={() => onIssue(a.id)}
                      >
                        <Award size={15} /> Issue certificate
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

/* ============================================================
   PEOPLE — list users, change roles
   ============================================================ */
const ROLES = ["student", "intern", "instructor", "admin"];

function People() {
  const [users, setUsers] = useState([]);
  const [state, setState] = useState("loading");
  const [errMsg, setErrMsg] = useState("");
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [busy, setBusy] = useState(null);

  const load = async () => {
    setState("loading");
    try {
      const params = {};
      if (roleFilter) params.role = roleFilter;
      if (q) params.q = q;
      const d = await listUsers(params);
      setUsers(d.users);
      setState("ready");
    } catch (e) {
      setErrMsg(e.message);
      setState("error");
    }
  };
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleFilter]);

  const changeRole = async (id, role) => {
    setBusy(id);
    try {
      await setUserRole(id, role);
      await load();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <Reveal>
        <div className="adfilter">
          <button className={`fil ${roleFilter === "" ? "fil--on" : ""}`} onClick={() => setRoleFilter("")}>
            All
          </button>
          {ROLES.map((r) => (
            <button
              key={r}
              className={`fil ${roleFilter === r ? "fil--on" : ""}`}
              onClick={() => setRoleFilter(r)}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}s
            </button>
          ))}
          <div className="adsearch">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name or email…"
              onKeyDown={(e) => e.key === "Enter" && load()}
            />
            <button className="tbtn" onClick={load}>
              <Search size={14} /> Search
            </button>
          </div>
        </div>
      </Reveal>

      {state === "loading" && <p className="tbl__muted">Loading people…</p>}
      {state === "error" && (
        <div className="fail">
          <AlertTriangle size={22} />
          <h3>Couldn't load users.</h3>
          <p>{errMsg}</p>
          <button className="btn btn--gold" onClick={load}>
            <RefreshCw size={16} /> Try again
          </button>
        </div>
      )}

      {state === "ready" && (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Name</th>
                <th className="tbl__hide-s">Email</th>
                <th>Role</th>
                <th className="tbl__right">Change role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr className="tbl__row" key={u.id}>
                  <td>
                    <span className="tbl__name">{u.full_name}</span>
                    <span className="tbl__muted tbl__sub">@{u.username}</span>
                  </td>
                  <td className="tbl__hide-s tbl__muted">{u.email}</td>
                  <td>
                    <span className={`pill pill--${roleTone(u.role)}`}>{u.role}</span>
                  </td>
                  <td className="tbl__right">
                    <select
                      className="roleselect"
                      value={u.role}
                      disabled={busy === u.id}
                      onChange={(e) => changeRole(u.id, e.target.value)}
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

function roleTone(role) {
  return { student: "wait", intern: "live", instructor: "good", admin: "done" }[role] || "wait";
}
