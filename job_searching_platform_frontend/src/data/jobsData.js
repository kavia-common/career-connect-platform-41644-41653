/**
 * Static jobs dataset for the Jobs search/listing and details pages.
 *
 * NOTE:
 * This task explicitly requires using a local static dataset (no remote APIs).
 * When the backend is ready, the app can switch to jobsApi again, but pages
 * should keep their filtering behavior consistent.
 */

/**
 * PUBLIC_INTERFACE
 * jobsData: in-memory dataset of job postings.
 *
 * Fields are intentionally flexible: JobsPage and JobDetailsPage only rely on:
 * - id (string)
 * - title (string)
 * - company (string)
 * - location (string)
 * - skills (string[])
 * - summary (string, optional)
 * - description (string, optional)
 * - applyUrl (string, optional)
 */
export const jobsData = [
  {
    id: "job-001",
    title: "Frontend Engineer (React)",
    company: "Nimbus Labs",
    location: "Remote (US)",
    jobType: "full_time",
    seniority: "mid",
    postedAt: "2026-01-05T12:00:00Z",
    salaryMin: 110000,
    salaryMax: 145000,
    currency: "USD",
    skills: ["React", "JavaScript", "TypeScript", "CSS", "REST APIs"],
    summary:
      "Build modern React interfaces for a fast-growing SaaS platform with a strong design system culture.",
    description:
      "You will work closely with Product and Design to ship high-quality UI. Responsibilities include building reusable components, optimizing performance, and collaborating on frontend architecture.\n\nRequirements:\n- 3+ years building production web UIs\n- Solid React fundamentals (hooks, state patterns)\n- Experience with TypeScript and component libraries\n\nNice to have:\n- React Query, accessibility, testing practices",
    applyUrl: "https://example.com/apply/job-001",
  },
  {
    id: "job-002",
    title: "Backend Engineer (Node.js)",
    company: "Cobalt Systems",
    location: "Austin, TX (Hybrid)",
    jobType: "full_time",
    seniority: "senior",
    postedAt: "2026-01-03T09:30:00Z",
    salaryMin: 135000,
    salaryMax: 175000,
    currency: "USD",
    skills: ["Node.js", "PostgreSQL", "API Design", "Docker", "CI/CD"],
    summary:
      "Own backend services for job ingestion and search at scale. Focus on reliability and clean API contracts.",
    description:
      "You will design and implement APIs, data pipelines, and service architecture. You’ll partner with frontend to deliver consistent contracts.\n\nRequirements:\n- 5+ years in backend engineering\n- Strong SQL and Postgres experience\n- Comfortable with observability and incident response",
    applyUrl: "https://example.com/apply/job-002",
  },
  {
    id: "job-003",
    title: "Full Stack Developer",
    company: "HarborWorks",
    location: "New York, NY",
    jobType: "contract",
    seniority: "mid",
    postedAt: "2026-01-02T15:20:00Z",
    salaryMin: 80,
    salaryMax: 110,
    currency: "USD",
    skills: ["React", "Node.js", "GraphQL", "PostgreSQL", "Testing"],
    summary:
      "6-month contract building customer-facing features and internal tooling with React + Node.",
    description:
      "You’ll build full-stack features end-to-end, contribute to a GraphQL schema, and help maintain a high-quality CI pipeline.\n\nRequirements:\n- Strong JavaScript/TypeScript\n- Experience with React and Node\n- Familiarity with automated testing and code reviews",
    applyUrl: "https://example.com/apply/job-003",
  },
  {
    id: "job-004",
    title: "Data Analyst (SQL + BI)",
    company: "Northstar Talent",
    location: "London, UK",
    jobType: "full_time",
    seniority: "junior",
    postedAt: "2026-01-01T08:00:00Z",
    salaryMin: 40000,
    salaryMax: 55000,
    currency: "GBP",
    skills: ["SQL", "Power BI", "Excel", "Data Modeling"],
    summary:
      "Help the team turn data into insights. Build dashboards, standardize metrics, and support decision-making.",
    description:
      "You’ll work with stakeholders to define metrics, develop dashboards, and validate data quality.\n\nRequirements:\n- Strong SQL fundamentals\n- Comfortable with BI tooling\n- Clear communication and documentation habits",
    applyUrl: "https://example.com/apply/job-004",
  },
  {
    id: "job-005",
    title: "DevOps Engineer (Cloud Infrastructure)",
    company: "VantaForge",
    location: "Remote (EMEA)",
    jobType: "full_time",
    seniority: "lead",
    postedAt: "2025-12-29T10:10:00Z",
    salaryMin: 90000,
    salaryMax: 120000,
    currency: "EUR",
    skills: ["AWS", "Terraform", "Kubernetes", "Monitoring", "Security"],
    summary:
      "Lead infrastructure improvements across environments with Terraform and Kubernetes, with a focus on security and observability.",
    description:
      "You’ll establish IaC patterns, standardize deployment workflows, and build reliable monitoring and alerting.\n\nRequirements:\n- Strong cloud experience\n- Terraform and Kubernetes in production\n- Security-minded approach to systems",
    applyUrl: "https://example.com/apply/job-005",
  },
];
