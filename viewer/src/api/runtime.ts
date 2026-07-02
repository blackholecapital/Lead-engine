export async function getRuntimeStatus() {
  const r = await fetch("/api/runtime");

  if (!r.ok)
    throw new Error("Runtime unavailable");

  return r.json();
}
