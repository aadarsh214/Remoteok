export type JobTheme = "black" | "purple" | "white" | "teal";

export interface JobFixture {
  id: number;
  title: string;
  company: string;
  companyTagline?: string;
  remoteScope: string;
  salary: string;
  tags: string[];
  postedDays: number;
  theme: JobTheme;
  isAd?: boolean;
  badges?: Array<{
    label: string;
    type: "remote" | "salary" | "contract" | "verified" | "benefit";
    icon?: string;
  }>;
  about?: string;
}

export const jobFixtures: JobFixture[] = [
  {
    id: 1,
    title: "Nomad Insurance by SafetyWing",
    company: "SafetyWing",
    companyTagline: "Global health coverage for remote workers and nomads",
    remoteScope: "Worldwide",
    salary: "$55k - $95k",
    tags: ["Insurance", "Health", "Global"],
    postedDays: 5,
    theme: "teal",
    isAd: true,
    badges: [
      { label: "Sponsored", type: "benefit", icon: "feather" },
      { label: "Remote OK", type: "remote" }
    ],
    about: "Nomad Insurance by SafetyWing — Global health coverage for remote workers and nomads"
  },
  {
    id: 2,
    title: "Spokesperson & Community Host",
    company: "labs Ai",
    remoteScope: "Worldwide",
    salary: "$30k - $50k",
    tags: ["Marketing", "Edu", "Customer Support"],
    postedDays: 8,
    theme: "black",
    badges: [
      { label: "Worldwide", type: "remote" },
      { label: "$30k - $50k", type: "salary" }
    ],
    about: "Represent Labs AI across global online events and community channels."
  },
  {
    id: 3,
    title: "Software Engineer",
    company: "Jump",
    remoteScope: "Worldwide",
    salary: "$60k - $120k",
    tags: ["Engineer", "AI", "Backend"],
    postedDays: 14,
    theme: "purple",
    badges: [
      { label: "Worldwide", type: "remote" },
      { label: "$60k - $120k", type: "salary" },
      { label: "Contractor", type: "contract" }
    ],
    about: "Join Jump to build resilient infrastructure for AI-enabled products."
  },
  {
    id: 4,
    title: "Coding Bootcamp - Job Guaranteed",
    company: "Metana",
    remoteScope: "Worldwide",
    salary: "$40k - $120k",
    tags: ["Bootcamp", "No Tech Background Needed"],
    postedDays: 22,
    theme: "white",
    badges: [
      { label: "Worldwide", type: "remote" },
      { label: "$40k - $120k", type: "salary" },
      { label: "Verified", type: "verified" }
    ],
    about: "Metana ensures job placement with a full refund if you are not hired."
  },
  {
    id: 5,
    title: "Customer Support Specialist",
    company: "Orbit",
    remoteScope: "Americas",
    salary: "$45k - $70k",
    tags: ["Support", "SaaS", "Customer Success"],
    postedDays: 6,
    theme: "white",
    badges: [
      { label: "Americas", type: "remote" },
      { label: "$45k - $70k", type: "salary" }
    ],
    about: "Orbit delivers unified customer analytics for remote-first teams."
  },
  {
    id: 6,
    title: "Senior Product Designer",
    company: "Aurora",
    remoteScope: "EMEA",
    salary: "$80k - $140k",
    tags: ["Design", "UX", "Figma"],
    postedDays: 18,
    theme: "white",
    badges: [
      { label: "EMEA", type: "remote" },
      { label: "$80k - $140k", type: "salary" },
      { label: "Contract", type: "contract" }
    ],
    about: "Aurora builds tools for distributed product teams with bold design systems."
  }
];
