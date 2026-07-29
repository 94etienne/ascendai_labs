import { useState, useRef, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Mail,
  Phone,
  MapPin,
  Upload,
  X,
  Info,
  AlertTriangle,
  Lock,
  UserCheck,
  Pencil,
} from "lucide-react";
import Reveal from "../components/Reveal";
import { submitApplication, fetchPrograms, fetchPrefill, isSignedIn } from "../api";

/* Rwanda administrative data.
   MUST be an absolute path from the web root — not "../".
   Place the file at:  public/locations_data/data.json          */
const LOCATIONS_URL = "/locations_data/data.json";

const STAGES = [
  "Secondary / high school student",
  "University student",
  "Recent graduate",
  "Working professional",
  "Organisation / employer",
];

const STUDENT_STAGES = ["Secondary / high school student", "University student"];

/* Non-program tracks that can also be locked in via ?track= */
const OTHER_TRACKS = {
  INTERNSHIP: {
    name: "Internship — Huye",
    desc: "On site at our Huye office, on a live client project. A placement you pay for, from RWF 50,000.",
  },
  TEAMS: {
    name: "Team training",
    desc: "A closed cohort for your staff, built around your systems and your data.",
  },
  BUILD: {
    name: "Software project",
    desc: "You have something you need built. Tell us the problem and we'll scope it with you.",
  },
};

const MAX_PHOTO_MB = 2;
const byName = (a, b) => a.localeCompare(b);

export default function Apply() {
  const [params] = useSearchParams();
  const fileRef = useRef(null);

  const signedIn = isSignedIn();

  /* ==========================================================
     LOCKED TRACK
     ========================================================== */
  const presetTrack = params.get("track") || "";
  const isLocked = Boolean(presetTrack);

  /* Programs come from the API now, not the static data.js —
     otherwise a code like HAU-001 can't be resolved and the
     locked card shows a bare code. */
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    let alive = true;
    fetchPrograms()
      .then((d) => alive && setPrograms(d.programs))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const lockedProgram = programs.find((p) => p.code === presetTrack) || null;
  const lockedOther = OTHER_TRACKS[presetTrack] || null;

  /* ==========================================================
     LOCATIONS
     ========================================================== */
  const [provinces, setProvinces] = useState([]);
  const [locState, setLocState] = useState("loading"); // loading | ready | failed

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch(LOCATIONS_URL);
        if (!res.ok) throw new Error(String(res.status));
        const json = await res.json();

        const parsed = (json.items || [])
          .map((p) => ({
            name: p.name,
            districts: (p.districts || [])
              .map((d) => ({
                name: d.name,
                sectors: (d.sectors || [])
                  .map((s) => ({
                    name: s.name,
                    cells: (s.cells || [])
                      .map((c) => ({
                        name: c.name,
                        villages: (c.villages || []).slice().sort(byName),
                      }))
                      .sort((a, b) => byName(a.name, b.name)),
                  }))
                  .sort((a, b) => byName(a.name, b.name)),
              }))
              .sort((a, b) => byName(a.name, b.name)),
          }))
          .filter((p) => p.districts.length)
          .sort((a, b) => byName(a.name, b.name));

        if (!parsed.length) throw new Error("empty");
        if (alive) {
          setProvinces(parsed);
          setLocState("ready");
        }
      } catch {
        if (alive) setLocState("failed");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  /* ==========================================================
     FORM STATE
     ========================================================== */
  const [form, setForm] = useState({
    name: "", email: "", phone: "", nationalId: "",
    province: "", district: "", sector: "", cell: "", village: "",
    address: "",
    stage: "Recent graduate",
    track: presetTrack || "AI-201",
    message: "",
    school: "", department: "", regNo: "", yearOfStudy: "",
    internshipStart: "", internshipEnd: "",
    supervisorName: "", supervisorEmail: "",
    photo: null,
  });

  /* ==========================================================
     PREFILL — signed-in returning applicant
     We reuse stable identity only. Dates, photo, year of study
     and motivation are per-application and must be re-entered:
     silently reusing March's dates for an August placement
     would file wrong data under their name.
     ========================================================== */
  const [prefilled, setPrefilled] = useState(false);
  const [editDetails, setEditDetails] = useState(false);
  const [prefillState, setPrefillState] = useState(signedIn ? "loading" : "off");

  useEffect(() => {
    if (!signedIn) return;
    let alive = true;

    fetchPrefill()
      .then(({ prefill, hasPrevious }) => {
        if (!alive) return;
        setForm((f) => ({ ...f, ...prefill, track: f.track }));
        setPrefilled(hasPrevious || Boolean(prefill.name));
        setPrefillState("ready");
      })
      .catch(() => alive && setPrefillState("off"));

    return () => {
      alive = false;
    };
  }, [signedIn]);

  const [preview, setPreview] = useState(null);
  const [sent, setSent] = useState(false);
  const [result, setResult] = useState(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const isStudent = STUDENT_STAGES.includes(form.stage);
  const isSecondary = form.stage === STUDENT_STAGES[0];

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  /* ==========================================================
     LOCATION CASCADE
     ========================================================== */
  const provinceObj = useMemo(
    () => provinces.find((p) => p.name === form.province) || null,
    [provinces, form.province]
  );
  const districts = provinceObj ? provinceObj.districts : [];

  const districtObj = useMemo(
    () => districts.find((d) => d.name === form.district) || null,
    [districts, form.district]
  );
  const sectors = districtObj ? districtObj.sectors : [];

  const sectorObj = useMemo(
    () => sectors.find((s) => s.name === form.sector) || null,
    [sectors, form.sector]
  );
  const cells = sectorObj ? sectorObj.cells : [];

  const cellObj = useMemo(
    () => cells.find((c) => c.name === form.cell) || null,
    [cells, form.cell]
  );
  const villages = cellObj ? cellObj.villages : [];

  const pickProvince = (e) =>
    setForm({ ...form, province: e.target.value, district: "", sector: "", cell: "", village: "" });
  const pickDistrict = (e) =>
    setForm({ ...form, district: e.target.value, sector: "", cell: "", village: "" });
  const pickSector = (e) =>
    setForm({ ...form, sector: e.target.value, cell: "", village: "" });
  const pickCell = (e) => setForm({ ...form, cell: e.target.value, village: "" });
  const pickVillage = (e) => setForm({ ...form, village: e.target.value });

  /* ==========================================================
     PHOTO
     ========================================================== */
  const pickPhoto = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      setErr("The passport photo must be an image file (JPG or PNG).");
      return;
    }
    if (f.size > MAX_PHOTO_MB * 1024 * 1024) {
      setErr(`That photo is too large. Keep it under ${MAX_PHOTO_MB} MB.`);
      return;
    }
    setErr("");
    setForm({ ...form, photo: f });
    setPreview(URL.createObjectURL(f));
  };

  const clearPhoto = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setForm({ ...form, photo: null });
    if (fileRef.current) fileRef.current.value = "";
  };

  /* ==========================================================
     SUBMIT
     ========================================================== */
  const submit = async () => {
    setErr("");

    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setErr("Add your name, email, and phone so we can reach you.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setErr("That email address doesn't look right.");
      return;
    }

    if (locState === "ready") {
      if (!form.province) return setErr("Select your province.");
      if (!form.district) return setErr("Select your district.");
      if (!form.sector) return setErr("Select your sector.");
      if (!form.cell) return setErr("Select your cell.");
      if (!form.village) return setErr("Select your village.");
    } else if (locState === "failed" && !form.address.trim()) {
      return setErr("Enter your address so we know where you're based.");
    }

    if (isStudent) {
      if (!form.school.trim())
        return setErr(isSecondary ? "Enter the name of your school." : "Enter the name of your university or polytechnic.");
      if (!form.department.trim())
        return setErr(isSecondary ? "Enter your trade or combination." : "Enter your department or programme.");
      if (!form.regNo.trim())
        return setErr(isSecondary ? "Enter your SDMS number." : "Enter your student registration number.");
      if (!form.photo)
        return setErr("Attach a passport photo — we need it for your intern ID badge.");
    }

    setBusy(true);
    try {
      const body = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v !== null && v !== "") body.append(k, v);
      });
      const data = await submitApplication(body);
      setResult(data);
      setSent(true);
    } catch (e) {
      setErr(e.message || "We couldn't send that. Try again, or email 19etienne@gmail.com.");
    } finally {
      setBusy(false);
    }
  };

  const loading = locState === "loading";

  /* Collapse identity fields when we already have them and the
     person hasn't asked to edit. */
  const collapseDetails = prefilled && !editDetails;

  const locSummary = [form.province, form.district, form.sector, form.cell, form.village]
    .filter(Boolean)
    .join(" / ");

  return (
    <>
      <section className="phead phead--dark">
        <div className="phead__in">
          <p className="eyebrow">Apply</p>
          <h1>{isLocked ? "You've picked your track." : "One form. Any track."}</h1>
          <p className="lede">
            {isLocked
              ? "Tell us who you are and we'll take it from here. We read every application and reply within five working days."
              : "Training, the internship, team training, or a project you want built — it all starts here. We read every message and reply within five working days."}
          </p>
        </div>
      </section>

      <section className="sec sec--dark">
        <div className="split split--form">
          <Reveal>
            <div>
              <h2>Or reach us directly.</h2>
              <p className="sec__sub">
                If you'd rather write to a person than fill in a box, that's fine too.
              </p>
              <div className="contact">
                <a href="mailto:19etienne@gmail.com"><Mail size={16} /> 19etienne@gmail.com</a>
                <a href="tel:+250783716761"><Phone size={16} /> +250 783 716 761</a>
                <span><MapPin size={16} /> Huye, Southern Province, Rwanda</span>
              </div>
              <p className="hours">
                Office hours: Monday to Friday, 08:00–17:00 CAT. Walk in if you're nearby —
                the door is open.
              </p>
              <div className="note">
                <Info size={15} />
                <p>
                  Students on a school or university internship: have your school details
                  and SDMS or registration number ready. We report attendance back to your
                  institution, so we need them to be correct.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="form">
              {sent ? (
                <div className="done">
                  <div className="done__ring"><Check size={26} /></div>
                  <h3>Application received</h3>
                  <p>
                    We'll be in touch within five working days at{" "}
                    <strong>{form.email}</strong>.
                  </p>

                  {result?.username && !signedIn && (
                    <div className="done__acct">
                      <p className="done__acct-h">We've also created your account</p>
                      <p className="done__acct-u">
                        Username <code>{result.username}</code>
                      </p>
                      <p className="done__acct-p">
                        Check your inbox — we've sent a link to set your password. You can
                        then sign in with your username, your email, or your phone number.
                      </p>
                      <Link to="/login" className="card__link">
                        Go to sign in <ArrowRight size={15} />
                      </Link>
                    </div>
                  )}

                  {signedIn && (
                    <div className="done__acct">
                      <p className="done__acct-p">
                        This has been added to your account. You can track its status from
                        your dashboard.
                      </p>
                      <Link to="/dashboard" className="card__link">
                        Go to your dashboard <ArrowRight size={15} />
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* ============ LOCKED TRACK ============ */}
                  {isLocked && (
                    <>
                      <p className="fgroup">You're applying for</p>
                      <div className="locked">
                        <div className="locked__top">
                          <span className="locked__i"><Lock size={12} /></span>
                          {lockedProgram && <span className="code">{lockedProgram.code}</span>}
                          <Link to="/training" className="locked__change">Change</Link>
                        </div>
                        <h4>
                          {lockedProgram ? lockedProgram.name
                            : lockedOther ? lockedOther.name
                            : presetTrack}
                        </h4>
                        <p>
                          {lockedProgram ? lockedProgram.desc
                            : lockedOther ? lockedOther.desc
                            : "We'll confirm the details with you."}
                        </p>
                        {lockedProgram && (
                          <dl className="locked__meta">
                            <div><dt>Mode</dt><dd>{lockedProgram.mode}</dd></div>
                            <div>
                              <dt>Length</dt>
                              <dd>{lockedProgram.weeks ? `${lockedProgram.weeks} weeks` : "Scoped"}</dd>
                            </div>
                            <div><dt>Fee</dt><dd>{lockedProgram.price}</dd></div>
                          </dl>
                        )}
                      </div>
                    </>
                  )}

                  {/* ============ PREFILLED IDENTITY SUMMARY ============ */}
                  {collapseDetails ? (
                    <>
                      <p className="fgroup">Your details</p>
                      <div className="known">
                        <div className="known__top">
                          <span className="known__i"><UserCheck size={13} /></span>
                          <span className="known__h">We already have these</span>
                          <button
                            className="known__edit"
                            onClick={() => setEditDetails(true)}
                            type="button"
                          >
                            <Pencil size={12} /> Edit
                          </button>
                        </div>
                        <dl className="known__list">
                          <div><dt>Name</dt><dd>{form.name}</dd></div>
                          <div><dt>Email</dt><dd>{form.email}</dd></div>
                          <div><dt>Phone</dt><dd>{form.phone || "—"}</dd></div>
                          {locSummary && <div><dt>Location</dt><dd>{locSummary}</dd></div>}
                          {form.school && <div><dt>School</dt><dd>{form.school}</dd></div>}
                          {form.regNo && <div><dt>Reg no.</dt><dd>{form.regNo}</dd></div>}
                        </dl>
                        <p className="known__note">
                          Anything changed since last time? Use Edit.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      {prefillState === "loading" && (
                        <p className="fgroup">Loading your details…</p>
                      )}

                      {/* ================= YOUR DETAILS ================= */}
                      <p className="fgroup">Your details</p>

                      <div className="f2">
                        <label>
                          <span>Full name *</span>
                          <input value={form.name} onChange={set("name")} placeholder="Uwase Grace" />
                        </label>
                        <label>
                          <span>Email *</span>
                          <input type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" />
                        </label>
                      </div>

                      <div className="f2">
                        <label>
                          <span>Phone *</span>
                          <input value={form.phone} onChange={set("phone")} placeholder="+250 7…" />
                        </label>
                        <label>
                          <span>National ID / passport no.</span>
                          <input value={form.nationalId} onChange={set("nationalId")} placeholder="1 1990 8 …" />
                        </label>
                      </div>

                      <label>
                        <span>Where are you now? *</span>
                        <select value={form.stage} onChange={set("stage")}>
                          {STAGES.map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </label>

                      {/* ================= WHERE YOU LIVE ================= */}
                      <p className="fgroup">Where you live</p>

                      {locState === "failed" ? (
                        <>
                          <div className="warn">
                            <AlertTriangle size={15} />
                            <p>
                              We couldn't load the location list. Type your full address and
                              we'll confirm it with you.
                            </p>
                          </div>
                          <label>
                            <span>Full address *</span>
                            <input
                              value={form.address}
                              onChange={set("address")}
                              placeholder="Village, cell, sector, district, province"
                            />
                          </label>
                        </>
                      ) : (
                        <>
                          <label>
                            <span>Province *</span>
                            <select value={form.province} onChange={pickProvince} disabled={loading}>
                              <option value="">
                                {loading ? "Loading locations…" : `Select province (${provinces.length})`}
                              </option>
                              {provinces.map((p) => (
                                <option key={p.name} value={p.name}>{p.name}</option>
                              ))}
                            </select>
                          </label>

                          <div className="f2">
                            <label>
                              <span>District *</span>
                              <select value={form.district} onChange={pickDistrict} disabled={!form.province}>
                                <option value="">
                                  {form.province ? `Select district (${districts.length})` : "Select a province first"}
                                </option>
                                {districts.map((d) => (
                                  <option key={d.name} value={d.name}>{d.name}</option>
                                ))}
                              </select>
                            </label>

                            <label>
                              <span>Sector *</span>
                              <select value={form.sector} onChange={pickSector} disabled={!form.district}>
                                <option value="">
                                  {form.district ? `Select sector (${sectors.length})` : "Select a district first"}
                                </option>
                                {sectors.map((s) => (
                                  <option key={s.name} value={s.name}>{s.name}</option>
                                ))}
                              </select>
                            </label>
                          </div>

                          <div className="f2">
                            <label>
                              <span>Cell *</span>
                              <select value={form.cell} onChange={pickCell} disabled={!form.sector}>
                                <option value="">
                                  {form.sector ? `Select cell (${cells.length})` : "Select a sector first"}
                                </option>
                                {cells.map((c) => (
                                  <option key={c.name} value={c.name}>{c.name}</option>
                                ))}
                              </select>
                            </label>

                            <label>
                              <span>Village *</span>
                              <select value={form.village} onChange={pickVillage} disabled={!form.cell}>
                                <option value="">
                                  {form.cell ? `Select village (${villages.length})` : "Select a cell first"}
                                </option>
                                {villages.map((v) => (
                                  <option key={v} value={v}>{v}</option>
                                ))}
                              </select>
                            </label>
                          </div>

                          {form.province && (
                            <div className="crumb">
                              <MapPin size={13} />
                              <span className="crumb__p">{form.province}</span>
                              {form.district && (<><span className="crumb__s">/</span><span>{form.district}</span></>)}
                              {form.sector && (<><span className="crumb__s">/</span><span>{form.sector}</span></>)}
                              {form.cell && (<><span className="crumb__s">/</span><span>{form.cell}</span></>)}
                              {form.village && (<><span className="crumb__s">/</span><strong>{form.village}</strong></>)}
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {/* ================= STUDENT BLOCK ================= */}
                  {isStudent && (
                    <div className="fblock">
                      {!collapseDetails && (
                        <>
                          <p className="fgroup fgroup--in">
                            {isSecondary ? "Your school" : "Your university"}
                          </p>

                          <label>
                            <span>{isSecondary ? "School name *" : "University / polytechnic name *"}</span>
                            <input
                              value={form.school}
                              onChange={set("school")}
                              placeholder={isSecondary ? "Groupe Scolaire Officiel de Butare" : "Rwanda Polytechnic — Huye College"}
                            />
                          </label>

                          <div className="f2">
                            <label>
                              <span>{isSecondary ? "Trade / combination *" : "Department / programme *"}</span>
                              <input
                                value={form.department}
                                onChange={set("department")}
                                placeholder={isSecondary ? "Software Development / MCB" : "Information Technology"}
                              />
                            </label>
                            <label>
                              <span>{isSecondary ? "SDMS number *" : "Registration number *"}</span>
                              <input
                                value={form.regNo}
                                onChange={set("regNo")}
                                placeholder={isSecondary ? "SDMS…" : "22RP…"}
                              />
                            </label>
                          </div>

                          <div className="f2">
                            <label>
                              <span>School supervisor name</span>
                              <input
                                value={form.supervisorName}
                                onChange={set("supervisorName")}
                                placeholder="The person who signs your report"
                              />
                            </label>
                            <label>
                              <span>School supervisor email</span>
                              <input
                                type="email"
                                value={form.supervisorEmail}
                                onChange={set("supervisorEmail")}
                                placeholder="supervisor@school.rw"
                              />
                            </label>
                          </div>
                        </>
                      )}

                      {/* These are ALWAYS asked, even for returning
                          applicants — they belong to this placement. */}
                      <p className="fgroup fgroup--in">This placement</p>

                      <label>
                        <span>Year / level of study</span>
                        <input
                          value={form.yearOfStudy}
                          onChange={set("yearOfStudy")}
                          placeholder={isSecondary ? "S5" : "Year 3"}
                        />
                      </label>

                      <div className="f2">
                        <label>
                          <span>Start date</span>
                          <input type="date" value={form.internshipStart} onChange={set("internshipStart")} />
                        </label>
                        <label>
                          <span>End date</span>
                          <input type="date" value={form.internshipEnd} onChange={set("internshipEnd")} />
                        </label>
                      </div>

                      <p className="fgroup fgroup--in">Passport photo *</p>

                      {preview ? (
                        <div className="photo">
                          <img src={preview} alt="Passport photo preview" />
                          <div className="photo__meta">
                            <strong>{form.photo?.name}</strong>
                            <span>{(form.photo?.size / 1024).toFixed(0)} KB</span>
                          </div>
                          <button className="photo__x" onClick={clearPhoto} aria-label="Remove photo">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="drop">
                          <Upload size={20} />
                          <strong>Attach a passport photo</strong>
                          <span>
                            JPG or PNG, under {MAX_PHOTO_MB} MB. Used for your intern ID badge.
                            {prefilled && " We ask again each time so the badge is current."}
                          </span>
                          <input
                            ref={fileRef}
                            type="file"
                            accept="image/png,image/jpeg"
                            onChange={pickPhoto}
                            hidden
                          />
                        </label>
                      )}
                    </div>
                  )}

                  {/* ========= TRACK SELECT (only when not locked) ========= */}
                  {!isLocked && (
                    <>
                      <p className="fgroup">What you're applying for</p>
                      <label>
                        <span>Track *</span>
                        <select value={form.track} onChange={set("track")}>
                          <optgroup label="Training">
                            {programs.map((p) => (
                              <option key={p.code} value={p.code}>
                                {p.code} — {p.name}
                              </option>
                            ))}
                          </optgroup>
                          <optgroup label="Other">
                            <option value="INTERNSHIP">Internship — Huye</option>
                            <option value="TEAMS">Team training — for my staff</option>
                            <option value="BUILD">Software project — I need something built</option>
                          </optgroup>
                        </select>
                      </label>
                    </>
                  )}

                  {/* ================= MOTIVATION ================= */}
                  {isLocked && <p className="fgroup">Your motivation</p>}

                  <label>
                    <span>Tell us your motivation</span>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={set("message")}
                      placeholder={
                        isStudent
                          ? "What do you want to work on, and what have you built before?"
                          : "A sentence or two is plenty."
                      }
                    />
                  </label>

                  {err && <p className="err">{err}</p>}

                  <button
                    className="btn btn--gold btn--lg btn--full"
                    onClick={submit}
                    disabled={busy}
                  >
                    {busy ? "Sending…" : prefilled ? "Confirm and apply" : "Send application"}{" "}
                    {!busy && <ArrowRight size={18} />}
                  </button>

                  <p className="fnote">
                    * Required. We use these details only to process your application and,
                    for students, to report your attendance to your school.
                  </p>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
