// POST /api/contact  — handles the website contact form.
//
// Two optional delivery methods (configure either or both in the
// Cloudflare dashboard -> Pages project -> Settings):
//   1. KV binding  CONTACT_KV       every message is saved (view in Workers KV)
//   2. Env vars    RESEND_API_KEY   + CONTACT_TO (+ optional CONTACT_FROM)
//                  emails each message to MaLinda via resend.com
// If neither is configured the visitor is told to email directly.

const MAX = { name: 120, email: 200, interest: 60, message: 5000 };

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

function clean(v, max) {
  return String(v || "").replace(/\r/g, "").trim().slice(0, max);
}

export async function onRequestPost({ request, env }) {
  let form;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: "Bad request" }, 400);
  }

  // Honeypot: real people never fill this in. Pretend success for bots.
  if (clean(form.get("company"), 200)) return json({ ok: true });

  const data = {
    name: clean(form.get("name"), MAX.name),
    email: clean(form.get("email"), MAX.email),
    interest: clean(form.get("interest"), MAX.interest),
    message: clean(form.get("message"), MAX.message),
    at: new Date().toISOString(),
    country: request.cf && request.cf.country ? request.cf.country : "",
  };

  if (!data.name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return json({ ok: false, error: "Please add your name and a valid email." }, 422);
  }

  let delivered = false;

  if (env.CONTACT_KV) {
    const key = `msg:${data.at}:${crypto.randomUUID().slice(0, 8)}`;
    await env.CONTACT_KV.put(key, JSON.stringify(data));
    delivered = true;
  }

  if (env.RESEND_API_KEY && env.CONTACT_TO) {
    const text =
      `New message from malindaperryconsulting.com\n\n` +
      `Name: ${data.name}\nEmail: ${data.email}\nInterested in: ${data.interest}\n\n${data.message || "(no message)"}\n`;
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env.CONTACT_FROM || "Website <website@malindaperryconsulting.com>",
        to: env.CONTACT_TO.split(",").map((s) => s.trim()),
        reply_to: data.email,
        subject: `Website: ${data.interest || "New message"} from ${data.name}`,
        text,
      }),
    });
    if (r.ok) delivered = true;
  }

  if (!delivered) return json({ ok: false, error: "Contact form isn't connected yet." }, 503);
  return json({ ok: true });
}

export function onRequest() {
  return json({ ok: false, error: "Method not allowed" }, 405);
}
