"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

type Item = { id: number; name: string };

export default function Home() {
  const [message, setMessage] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [rootRes, itemsRes] = await Promise.all([
          fetch(API_BASE),
          fetch(`${API_BASE}/api/items`),
        ]);
        if (!rootRes.ok || !itemsRes.ok) throw new Error("API error");
        const root = (await rootRes.json()) as { message: string };
        const data = (await itemsRes.json()) as { items: Item[] };
        setMessage(root.message);
        setItems(data.items);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to reach backend");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p style={{ color: "#a1a1aa" }}>Loading…</p>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "3rem 1.5rem",
        maxWidth: "42rem",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          fontSize: "1.875rem",
          fontWeight: 700,
          marginBottom: "0.5rem",
        }}
      >
        LockedIn
      </h1>
      <p style={{ color: "#a1a1aa", marginBottom: "2rem" }}>
        Next.js frontend + Python backend
      </p>

      {error ? (
        <p style={{ color: "#f87171", marginBottom: "1rem" }}>
          Backend error: {error}. Make sure the Python server is running on port
          8000.
        </p>
      ) : (
        <>
          <p style={{ marginBottom: "1.5rem" }}>{message}</p>
          <section>
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                marginBottom: "0.75rem",
              }}
            >
              Items from API
            </h2>
            <ul style={{ listStyle: "none" }}>
              {items.map((item) => (
                <li
                  key={item.id}
                  style={{
                    padding: "0.75rem 1rem",
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "0.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </main>
  );
}
