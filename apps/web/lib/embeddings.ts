// Lightweight, dependency-free embeddings for demo purposes.
// Replace with OpenAI embeddings + Pinecone/Supabase vectors in production.

export const VECTOR_SIZE = 64;

export function embedText(text: string): number[] {
  const v = new Array<number>(VECTOR_SIZE).fill(0);
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    const idx = (c + i) % VECTOR_SIZE;
    v[idx] = (v[idx] ?? 0) + (c % 31) / 31;
  }
  // L2 normalize
  const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
  return v.map((x) => x / norm);
}

export function cosineSimilarity(a: number[], b: number[]): number {
  const len = Math.min(a.length, b.length);
  let dot = 0;
  for (let i = 0; i < len; i++) dot += (a[i] ?? 0) * (b[i] ?? 0);
  return Math.max(-1, Math.min(1, dot));
}
