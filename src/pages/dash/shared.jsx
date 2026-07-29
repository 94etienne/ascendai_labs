import {
  Clock,
  Eye,
  Check,
  Pause,
  X,
  Award,
} from "lucide-react";

/* Application status → label, icon, tone, plain-language line.
   Shared by every dashboard so the vocabulary is consistent. */
export const STATUS = {
  new: {
    label: "Submitted",
    icon: <Clock size={12} />,
    tone: "wait",
    says: "We have it. Nobody has read it yet — usually within five working days.",
  },
  reviewing: {
    label: "Reviewing",
    icon: <Eye size={12} />,
    tone: "live",
    says: "Someone on the team is reading it now.",
  },
  accepted: {
    label: "Accepted",
    icon: <Check size={12} />,
    tone: "good",
    says: "You're in. Check your email for the next steps.",
  },
  waitlisted: {
    label: "Waitlisted",
    icon: <Pause size={12} />,
    tone: "hold",
    says: "The cohort is full. You're first in line if a place opens.",
  },
  rejected: {
    label: "Not this time",
    icon: <X size={12} />,
    tone: "no",
    says: "We couldn't offer a place on this one. Apply again, or try another track.",
  },
  completed: {
    label: "Completed",
    icon: <Award size={12} />,
    tone: "done",
    says: "Finished. Your certificate is ready to print.",
  },
};

/* Attendance status → label + tone for the pill colours. */
export const ATT = {
  present: { label: "Present", tone: "good" },
  absent: { label: "Absent", tone: "no" },
  excused: { label: "Excused", tone: "hold" },
  holiday: { label: "Holiday", tone: "wait" },
};

export function fmtDate(s) {
  if (!s) return "—";
  const d = new Date(String(s).replace(" ", "T"));
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function fmtDateLong(s) {
  if (!s) return "—";
  const d = new Date(String(s).replace(" ", "T"));
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/* Today as YYYY-MM-DD in local time — for the date input default. */
export function todayISO() {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

export function firstName(fullName) {
  return String(fullName || "").trim().split(/\s+/)[0] || "there";
}
