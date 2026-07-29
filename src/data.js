/* ============================================================
   ASCEND AI — shared content
   A private training & software company. Not a school.
   ============================================================ */

export const NAV = [
  { label: "Training", to: "/training" },
  { label: "Internships", to: "/internships" },
  { label: "For Teams", to: "/teams" },
  { label: "Our Work", to: "/work" },
  { label: "About", to: "/about" },
];

/* Who we train — four audiences, one company */
export const AUDIENCES = [
  {
    key: "students",
    stage: "Secondary students",
    title: "First contact",
    blurb:
      "Weekend and holiday workshops for S4–S6 students. No prior coding. They leave having built something that runs.",
    format: "In person, Huye — 4 weekends",
    price: "RWF 50,000 · Paid places available",
    points: ["Python from zero", "What AI actually is", "A working first project"],
  },
  {
    key: "graduates",
    stage: "University students & graduates",
    title: "Training/Internship-ready",
    blurb:
      "You have the theory. You need the practice. Full-stack and ML training built around what employers actually ask for.",
    format: "Online, or hybrid at Huye — 4–12 weeks",
    price: "From RWF 50,000",
    points: ["Ship three real projects", "Git, review, deployment", "Direct route to our internship"],
  },
  {
    key: "professionals",
    stage: "Working professionals",
    title: "Applied AI",
    blurb:
      "You already have a job. You want AI in it. Evening and weekend tracks built around the work you do now.",
    format: "Online, evenings — 4–12 weeks",
    price: "From RWF 50,000",
    points: ["Bring your own problem", "Automate one real workflow", "Ship before you finish"],
  },
  {
    key: "teams",
    stage: "Organisations",
    title: "Team training",
    blurb:
      "We train your staff on your systems and your data. Closed cohorts, curriculum built to your brief.",
    format: "On site or online — scoped per client",
    price: "Quoted per engagement",
    points: ["Custom curriculum", "Your data, your tools", "Delivered at your office"],
  },
];

export const PROGRAMS = [
  {
    code: "CS-101",
    name: "Programming Foundations",
    mode: "Online + Huye",
    level: "Beginner",
    weeks: 10,
    price: "RWF 120,000",
    audience: "Students · Graduates",
    desc: "Python, data structures, Git, and the working habits that separate a coder from an engineer.",
  },
  {
    code: "AI-201",
    name: "Machine Learning in Practice",
    mode: "Online",
    level: "Intermediate",
    weeks: 12,
    price: "RWF 220,000",
    audience: "Graduates · Professionals",
    desc: "Regression through deep learning. Every module ends with a model you deploy, not a notebook you abandon.",
  },
  {
    code: "AI-305",
    name: "Applied LLMs & Agents",
    mode: "Online",
    level: "Advanced",
    weeks: 8,
    price: "RWF 320,000",
    audience: "Professionals",
    desc: "Retrieval, evaluation, and putting a language model into production without setting money on fire.",
  },
  {
    code: "SE-210",
    name: "Full-Stack Engineering",
    mode: "Hybrid — Huye",
    level: "Intermediate",
    weeks: 14,
    price: "RWF 250,000",
    audience: "Graduates",
    desc: "React, Node, MySQL, deployment. The exact stack our own client work runs on.",
  },
  {
    code: "DS-150",
    name: "Data Analysis for Professionals",
    mode: "Online, evenings",
    level: "Beginner",
    weeks: 6,
    price: "RWF 140,000",
    audience: "Professionals",
    desc: "For people with spreadsheets and no time. Python, SQL, and dashboards that answer real questions.",
  },
  {
    code: "CV-280",
    name: "Computer Vision Systems",
    mode: "Hybrid — Huye",
    level: "Advanced",
    weeks: 10,
    price: "RWF 300,000",
    audience: "Graduates · Professionals",
    desc: "Detection, segmentation, edge deployment. Built on infrastructure problems Rwanda actually has.",
  },
  {
    code: "AI-100",
    name: "AI for Secondary Students",
    mode: "In person — Huye",
    level: "Beginner",
    weeks: 6,
    price: "RWF 50,000",
    audience: "Secondary students",
    desc: "Weekend workshops. No prior coding. Ends with a project the student demonstrates to their school.",
  },
  {
    code: "TM-400",
    name: "Custom Team Training",
    mode: "On site or online",
    level: "Scoped",
    weeks: 0,
    price: "Quoted",
    audience: "Organisations",
    desc: "Closed cohort for your staff. You tell us the problem; we build the curriculum around it.",
  },
];

/* Internships — physical, at our Huye office */
/* Internship — on site at Huye.
   A placement the intern PAYS FOR. We do not pay a stipend;
   what they get is supervised experience, a portfolio, and a
   signed school report. */
export const INTERNSHIP = {
  length: "1, 3, or 6 months",
  location: "On site — Huye office",
  cost: "From RWF 50,000",
  intake: "Rolling — apply any time",
  seats: "20+ places per intake",
};

export const PHASES = [
  ["Weeks 1–2", "Onboarding", "You get a laptop, a desk, the codebase, and a mentor. First pull request merged before you leave week two."],
  ["Weeks 3–10", "Delivery", "You own a component of a product we are shipping to a paying client. Daily standup. Weekly review."],
  ["Weeks 11–18", "Ownership", "You lead a feature end to end — spec, build, test, deploy. Your name is on it."],
  ["Final weeks", "Placement", "Portfolio review, interview prep, and introductions to the companies we work with."],
];

export const WORK = [
  {
    client: "Agricultural cooperative network",
    title: "Yield forecasting for smallholder farms",
    tag: "Machine Learning",
    year: "2025",
    result: "Harvest predictions delivered by SMS in Kinyarwanda to 4,000 farmers.",
  },
  {
    client: "Regional utility",
    title: "Vision monitoring for grid infrastructure",
    tag: "Computer Vision",
    year: "2025",
    result: "Automated inspection across 200km of transmission line.",
  },
  {
    client: "District education office",
    title: "Student performance early-warning system",
    tag: "Data + Web",
    year: "2024",
    result: "Flags at-risk students six weeks before term exams.",
  },
  {
    client: "Health NGO",
    title: "Kinyarwanda voice intake for rural clinics",
    tag: "Speech + NLP",
    year: "2024",
    result: "Cut patient registration time by two-thirds.",
  },
  {
    client: "Logistics operator",
    title: "Route optimisation across the Southern Province",
    tag: "Optimisation",
    year: "2024",
    result: "Fuel spend down 18% in the first quarter after rollout.",
  },
  {
    client: "Microfinance institution",
    title: "Credit scoring on thin-file applicants",
    tag: "Machine Learning",
    year: "2023",
    result: "Approval decisions in minutes instead of days.",
  },
];

export const SERVICES = [
  {
    name: "Machine learning systems",
    desc: "Forecasting, scoring, classification. Models that run in production and get monitored, not models that die in a notebook.",
  },
  {
    name: "Computer vision",
    desc: "Detection and inspection for infrastructure, agriculture, and manufacturing. Cloud or on the edge.",
  },
  {
    name: "Web and mobile platforms",
    desc: "React, Node, MySQL. Dashboards, portals, and internal tools built to be maintained after we leave.",
  },
  {
    name: "Data engineering",
    desc: "Pipelines, warehouses, and the unglamorous plumbing that makes everything else possible.",
  },
];

export const STATS = [
  { value: "above 100", label: "People trained" },
  { value: "Above 62", label: "Interns placed" },
  { value: "Above 31", label: "Projects delivered" },
  { value: "2026", label: "Founded in Huye" },
];

export const FAQ = [
  {
    q: "Are you a university?",
    a: "No. Ascend AI is a private company. We run short, practical training programs and a paid internship, and we build software for clients. We do not award degrees and we are not accredited to. What you get from us is skill, a portfolio, and a reference.",
  },
  {
    q: "Is training online or in person?",
    a: "Both, depending on the program. Most professional and graduate tracks run online. Secondary-student workshops run in person at our Huye office. A few programs are hybrid — online lectures with in-person labs.",
  },
  {
    q: "Is the internship online?",
    a: "No. The internship is on site at our Huye office, full time. You sit with the team, on real client work. That is the whole point — it does not translate to a remote arrangement.",
  },
  {
    q: "Is the internship paid?",
    a: "Yes, a monthly stipend. You are doing work that ships to a paying client, so you are paid for it.",
  },
  {
    q: "Do I need to be a graduate to intern?",
    a: "No. We take university students on placement year and recent graduates. What we need is that you can already code — the internship is where you learn to ship, not where you learn to program. If you cannot code yet, start with one of our training tracks.",
  },
  {
    q: "What language is training delivered in?",
    a: "English, with Kinyarwanda support throughout. Secondary-student workshops are taught bilingually.",
  },
  {
    q: "Can my company sponsor a cohort?",
    a: "Yes. We run closed team training — you tell us the problem your staff need to solve, we build the curriculum around it and deliver it at your office or online.",
  },
];

export const VALUES = [
  ["Practical over theoretical", "Every program ends in something that runs. No certificates for attendance."],
  ["Small cohorts", "We cap enrolment because review takes time and time is what makes people good."],
  ["Rwandan problems", "Our client work is here. Our training is built on it. The two feed each other."],
  ["Honest about fit", "If we are not the right people for your project, we say so and point you elsewhere."],
];
