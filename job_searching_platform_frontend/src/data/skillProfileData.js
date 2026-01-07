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
 * skillProfileData: in-memory skill-based profile for the Profile page.
 *
 * Expected shape:
 * - name (string)
 * - role (string)
 * - experience (string)
 * - skills ({ name: string, level: string }[])
 * - interests (string[])
 */
export const skillProfileData = {
  // TODO: Replace with the exact provided skillProfileData content from the user instructions.
  // Keeping a sensible default structure so the UI is functional immediately.
  name: "Alex Morgan",
  role: "Software Engineer",
  experience: "5+ years building web applications and scalable APIs.",
  skills: [
    { name: "React", level: "Advanced" },
    { name: "JavaScript", level: "Advanced" },
    { name: "Node.js", level: "Intermediate" },
    { name: "SQL", level: "Intermediate" },
  ],
  interests: ["System design", "Performance optimization", "Mentoring", "Product thinking"],
};
