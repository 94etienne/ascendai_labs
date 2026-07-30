/* ============================================================
   Talks to the Express API.
   Requires VITE_API in client/.env
   ============================================================ */

const BASE = import.meta.env.VITE_API || "https://ascend-server-iog9.onrender.com";

/* Attach the JWT if we have one */
function authHeaders() {
  const t = localStorage.getItem("ascend_jwt");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body.error) msg = body.error;
    } catch {
      /* not JSON — keep the generic message */
    }

    /* Token expired — clear it so the UI stops pretending we're signed in */
    if (res.status === 401) {
      localStorage.removeItem("ascend_jwt");
      localStorage.removeItem("ascend_user");
    }

    throw new Error(msg);
  }

  return res.json();
}

const json = (body) => ({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

/* ---------- programs ---------- */
export function fetchPrograms(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/programs${qs ? `?${qs}` : ""}`);
}

export function fetchProgram(code) {
  return request(`/api/programs/${code}`);
}

export function fetchCohorts(code) {
  return request(`/api/programs/${code}/cohorts`);
}

/* ---------- applications ---------- */
export function submitApplication(formData) {
  /* FormData — do NOT set Content-Type; the browser must add
     the multipart boundary itself. */
  return request("/api/applications", { method: "POST", body: formData });
}

export function fetchApplications(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/applications${qs ? `?${qs}` : ""}`);
}

/* ---------- auth ---------- */
export function setPassword(token, password) {
  return request("/api/auth/set-password", json({ token, password }));
}

export function resetPassword(token, password) {
  return request("/api/auth/reset-password", json({ token, password }));
}

export function login(identifier, password) {
  return request("/api/auth/login", json({ identifier, password }));
}

export function forgotPassword(identifier) {
  return request("/api/auth/forgot-password", json({ identifier }));
}

export function fetchMe() {
  return request("/api/auth/me");
}

/* Stable details we can reuse to save a returning applicant
   from retyping. Requires a token. */
export function fetchPrefill() {
  return request("/api/auth/prefill");
}

export function isSignedIn() {
  return Boolean(localStorage.getItem("ascend_jwt"));
}

export function logout() {
  localStorage.removeItem("ascend_jwt");
  localStorage.removeItem("ascend_user");
}

export function currentUser() {
  try {
    return JSON.parse(localStorage.getItem("ascend_user"));
  } catch {
    return null;
  }
}

/* ---------- certificates ---------- */

/* Public — an employer checking a serial. No token needed. */
export function verifyCertificate(serial) {
  return request(`/api/certificates/verify/${serial}`);
}

/* The download URL — used as an href so the browser handles the
   PDF stream. The JWT can't ride in a header on a plain link, so
   we pass it as a query param; the download route accepts it. */
export function certificateDownloadUrl(serial) {
  const t = localStorage.getItem("ascend_jwt");
  return `${BASE}/api/certificates/${serial}/download${t ? `?token=${t}` : ""}`;
}

/* Admin */
export function issueCertificate(applicationId, hours) {
  return request(`/api/certificates/issue/${applicationId}`, json({ hours }));
}

export function revokeCertificate(serial, reason) {
  return request(`/api/certificates/${serial}/revoke`, json({ reason }));
}

/* ============================================================
   ADMIN — console
   ============================================================ */
export function fetchOverview() {
  return request("/api/admin/overview");
}

export function listUsers(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/admin/users${qs ? `?${qs}` : ""}`);
}

export function listInstructors() {
  return request("/api/admin/instructors");
}

export function setUserRole(id, role) {
  return request(`/api/admin/users/${id}/role`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role }),
  });
}

/* Admin — applications review */
export function updateApplicationStatus(id, status, notes) {
  return request(`/api/applications/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, notes }),
  });
}

/* ============================================================
   INTERNSHIPS
   ============================================================ */
export function fetchInternships() {
  return request("/api/internships");
}

export function fetchInternship(id) {
  return request(`/api/internships/${id}`);
}

/* Admin: turn an accepted application into an active internship */
export function createInternship(applicationId, body) {
  return request(`/api/internships/from-application/${applicationId}`, json(body));
}

export function updateInternship(id, body) {
  return request(`/api/internships/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/* ============================================================
   ATTENDANCE
   ============================================================ */
export function fetchAttendance(internshipId) {
  return request(`/api/attendance/${internshipId}`);
}

/* Instructor/admin: mark one intern for one day */
export function markAttendance(body) {
  return request("/api/attendance", json(body));
}

/* Instructor/admin: roll-call several interns for a day at once */
export function markAttendanceBulk(body) {
  return request("/api/attendance/bulk", json(body));
}
