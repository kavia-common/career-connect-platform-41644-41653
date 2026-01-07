/**
 * Static skill profile dataset for the Profile page UI.
 *
 * NOTE:
 * This task explicitly requires using a local static dataset (no Supabase / remote APIs).
 * When backend + profile APIs are ready, ProfilePage can switch to a real data source,
 * but should keep the rendering structure consistent.
 */

/**
 * PUBLIC_INTERFACE
 * skillProfiles: in-memory list of skill-based profiles for the Profile page.
 *
 * Expected profile shape:
 * - id (string)
 * - name (string)
 * - role (string)
 * - experience (string)
 * - skills ({ name: string, level: string }[])
 * - interests (string[])
 */
export const skillProfiles = [
  {
    id: "bhoomika-t",
    name: "Bhoomika T",
    role: "Frontend Engineer",
    experience: "3+ years building responsive web apps and design systems.",
    skills: [
      { name: "React", level: "Advanced" },
      { name: "TypeScript", level: "Advanced" },
      { name: "CSS / UI Engineering", level: "Advanced" },
      { name: "Accessibility (a11y)", level: "Intermediate" },
    ],
    interests: ["Design systems", "Performance", "UX polish", "Mentoring"],
  },
  {
    id: "samir-khan",
    name: "Samir Khan",
    role: "Backend Engineer",
    experience: "6+ years designing scalable services, APIs, and data-intensive systems.",
    skills: [
      { name: "Node.js", level: "Advanced" },
      { name: "Python", level: "Advanced" },
      { name: "REST APIs", level: "Advanced" },
      { name: "PostgreSQL", level: "Advanced" },
      { name: "Docker", level: "Intermediate" },
    ],
    interests: ["System design", "Reliability", "Databases", "Observability"],
  },
  {
    id: "aanya-iyer",
    name: "Aanya Iyer",
    role: "Data Analyst",
    experience: "4+ years delivering insights with analytics, dashboards, and experimentation.",
    skills: [
      { name: "SQL", level: "Advanced" },
      { name: "Excel", level: "Advanced" },
      { name: "Python (Pandas)", level: "Intermediate" },
      { name: "Data Visualization", level: "Advanced" },
      { name: "A/B Testing", level: "Intermediate" },
    ],
    interests: ["Storytelling with data", "Business strategy", "Product analytics", "Automation"],
  },
];

/**
 * PUBLIC_INTERFACE
 * skillProfileData: backwards compatible single-profile export used by older UI code.
 * Defaults to the first entry in `skillProfiles`.
 */
export const skillProfileData = skillProfiles[0];
