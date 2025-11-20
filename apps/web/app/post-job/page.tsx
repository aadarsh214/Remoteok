"use client";
import { useState } from "react";

export default function PostJobPage() {
  const [state, setState] = useState<{ ok?: boolean; id?: string; error?: string }>({});
  const [title, setTitle] = useState("");
  const [companyId, setCompanyId] = useState("1");
  const [description, setDescription] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, companyId, description, tags: ["Engineer"], location: "India", currency: "INR", remote: true })
    });
    const data = await res.json();
    setState(data.ok ? { ok: true, id: data.data?.id } : { ok: false, error: data.error || "Failed" });
  }

  return (
    <main style={{ maxWidth: 640 }}>
      <h1 className="caveat-title--lg">Post a Remote Job</h1>
      <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
        <input placeholder="Job title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button type="submit">Create</button>
      </form>
      {state.ok && <p style={{ color: "green" }}>Created! ID: {state.id}</p>}
      {state.ok === false && <p style={{ color: "crimson" }}>{state.error}</p>}
      <p style={{ color: "#6B6B6B" }}>Payment integration (Razorpay) stubbed in /api/payments.</p>
    </main>
  );
}
