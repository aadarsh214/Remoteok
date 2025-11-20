import { slugify, nowIso } from "./utils";
import { embedText } from "./embeddings";

export type Role = "seeker" | "employer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  verified?: boolean;
  plan?: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  verified?: boolean;
}

export interface Job {
  id: string;
  title: string;
  slug: string;
  companyId: string;
  description: string;
  tags: string[];
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  remote: boolean;
  createdAt: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  resumeUrl?: string;
  skills: string[];
  experience: string; // free text
  vectorEmbedding?: number[]; // demo only
  aiSummary?: string;
}

export interface Match {
  id: string;
  jobId: string;
  candidateId: string;
  score: number;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  plan: string;
  status: "created" | "paid" | "failed";
  razorpayId?: string;
}

export interface Category { id: string; name: string; slug: string }
export interface Tag { id: string; name: string }
export interface JobTag { jobId: string; tagId: string }

// In-memory demo DB. Replace with Prisma/Supabase implementation.
const ids = { user: 1, company: 1, job: 1, candidate: 1, match: 1, tx: 1 };
const nextId = (key: keyof typeof ids) => String(ids[key]++);

const users: User[] = [
  { id: nextId("user"), name: "Ava", email: "ava@example.com", role: "employer", verified: true },
  { id: nextId("user"), name: "Ravi", email: "ravi@example.com", role: "seeker" }
];

const companies: Company[] = [
  { id: nextId("company"), name: "Jump", website: "https://jump.example", verified: true },
  { id: nextId("company"), name: "Metana", website: "https://metana.example" }
];

const jobs: Job[] = [
  {
    id: nextId("job"),
    title: "Software Engineer",
    slug: "software-engineer",
    companyId: companies[0]!.id,
    description: "Build backend services and distributed systems.",
    tags: ["Engineer", "Backend", "AI"],
    location: "Worldwide",
    salaryMin: 600000,
    salaryMax: 2000000,
    currency: "INR",
    remote: true,
    createdAt: nowIso(),
  },
  {
    id: nextId("job"),
    title: "Coding Bootcamp - Job Guaranteed",
    slug: "coding-bootcamp-job-guaranteed",
    companyId: companies[1]!.id,
    description: "Bootcamp with placement support.",
    tags: ["Bootcamp", "Education"],
    location: "Worldwide",
    salaryMin: 400000,
    salaryMax: 1200000,
    currency: "INR",
    remote: true,
    createdAt: nowIso(),
  }
];

const candidates: Candidate[] = [
  {
    id: nextId("candidate"),
    name: "Neha Verma",
    email: "neha@example.com",
    skills: ["TypeScript", "Node.js", "PostgreSQL"],
    experience: "4+ years backend services and APIs for fintech.",
    aiSummary: "Backend TS engineer with strong SQL and infra.",
  },
  {
    id: nextId("candidate"),
    name: "Arjun Iyer",
    email: "arjun@example.com",
    skills: ["React", "Next.js", "TailwindCSS"],
    experience: "3 years front-end and full-stack at startups.",
    aiSummary: "Product-focused FE dev, great UX and SSR.",
  },
  {
    id: nextId("candidate"),
    name: "Priya Sharma",
    email: "priya@example.com",
    skills: ["Python", "LLMs", "Vector DBs"],
    experience: "2 years ML + RAG pipelines, embeddings, Pinecone.",
    aiSummary: "RAG engineer, OpenAI embeddings, Pinecone ops.",
  }
];

// Precompute fake embeddings for demo matching
for (const c of candidates) {
  c.vectorEmbedding = embedText((c.aiSummary || "") + " " + c.skills.join(" "));
}

export const db = {
  users,
  companies,
  jobs,
  candidates,
};

// Job ops
export function listJobs() {
  return jobs.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getJobById(id: string) {
  return jobs.find((j) => j.id === id) || null;
}

export function getJobBySlug(slug: string) {
  return jobs.find((j) => j.slug === slug) || null;
}

export function createJob(input: Omit<Job, "id" | "slug" | "createdAt"> & { slug?: string }) {
  const id = nextId("job");
  const slug = input.slug ?? slugify(input.title);
  const job: Job = { ...input, id, slug, createdAt: nowIso() };
  jobs.push(job);
  return job;
}

export function updateJob(id: string, patch: Partial<Job>) {
  const j = getJobById(id);
  if (!j) return null;
  Object.assign(j, patch);
  if (patch.title) j.slug = slugify(patch.title);
  return j;
}

export function deleteJob(id: string) {
  const idx = jobs.findIndex((j) => j.id === id);
  if (idx === -1) return false;
  jobs.splice(idx, 1);
  return true;
}

// Candidate ops
export function listCandidates() { return candidates.slice(); }
export function getCandidateById(id: string) { return candidates.find(c => c.id === id) || null; }
export function createCandidate(input: Omit<Candidate, "id" | "vectorEmbedding">) {
  const id = nextId("candidate");
  const c: Candidate = { ...input, id };
  c.vectorEmbedding = embedText((c.aiSummary || "") + " " + c.skills.join(" "));
  candidates.push(c);
  return c;
}
export function updateCandidate(id: string, patch: Partial<Candidate>) {
  const c = getCandidateById(id);
  if (!c) return null;
  Object.assign(c, patch);
  c.vectorEmbedding = embedText((c.aiSummary || "") + " " + c.skills.join(" "));
  return c;
}
