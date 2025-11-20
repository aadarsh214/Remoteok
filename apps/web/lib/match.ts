import { Candidate, Job } from "./db";
import { embedText, cosineSimilarity } from "./embeddings";

export function rankCandidatesForJob(job: Job, candidates: Candidate[], topK = 5) {
  const jobEmbedding = embedText(job.title + " " + job.description + " " + job.tags.join(" "));
  const scored = candidates.map((c) => {
    const vec = c.vectorEmbedding ?? embedText((c.aiSummary || "") + " " + c.skills.join(" "));
    const score = cosineSimilarity(jobEmbedding, vec);
    return { candidate: c, score };
  });
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}
