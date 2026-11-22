/**
 * POST /api/inquiry : lessons form (Cloudflare Pages Function).
 *
 * Bindings and variables, set in Cloudflare: Pages project → Settings → Functions / Variables:
 *   DB              D1 database binding (required). Table: migrations/0001_inquiries.sql
 *   RESEND_API_KEY  secret, optional. With NOTIFY_EMAIL set, each inquiry is also emailed to you through resend.com.
 *   NOTIFY_EMAIL    where to send that email, optional.
 *   MAIL_FROM       verified sender for Resend, e.g. "Lessons <lessons@your-domain>", optional.
 *
 * Answers JSON when the browser asks for it (fetch from static/js/inquiry.js), else redirects to /lessons/thanks/.
 */
const PROGRAMMES = ["UK Key Stage 2", "UK Key Stage 3", "Cambridge Lower Secondary", "IB MYP", "Greek school", "Other or not sure"];
const GOALS = ["catch-up", "keep-up", "stretch", "exam"];
const SUBJECTS = ["Maths", "Science"];

function reply(request, status, error) {
  const wantsJson = (request.headers.get("Accept") || "").includes("application/json");
  if (wantsJson) {
    return new Response(JSON.stringify(error ? { error } : { ok: true }), {
      status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }
  if (!error) return Response.redirect(new URL("/lessons/thanks/", request.url).toString(), 303);
  return new Response(`${error}\n\nPlease go back and try again.`, { status, headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

const clean = (v, max) => String(v ?? "").replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim().slice(0, max);

export async function onRequestPost({ request, env }) {
  let form;
  try { form = await request.formData(); } catch { return reply(request, 400, "We couldn't read the form."); }

  // Bots: the hidden "website" field is filled, or the form was sent less than 3 seconds after opening.
  // "ts" is how long the form was open in ms, measured in the browser (empty without JavaScript).
  const openMs = Number(form.get("ts") || 0);
  if (form.get("website") || (openMs > 0 && openMs < 3000)) return reply(request, 200);

  const d = {
    parent_name: clean(form.get("parent_name"), 80),
    email: clean(form.get("email"), 120).toLowerCase(),
    age: Number(form.get("age")),
    programme: clean(form.get("programme"), 40),
    subjects: form.getAll("subjects").map((s) => clean(s, 20)).filter((s) => SUBJECTS.includes(s)),
    confidence: Number(form.get("confidence")),
    goal: clean(form.get("goal"), 20),
    message: clean(form.get("message"), 1500),
    source: clean(form.get("source"), 60),
  };
  if (!d.parent_name) return reply(request, 400, "Please add your name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) return reply(request, 400, "Please check your email address.");
  if (!(d.age >= 8 && d.age <= 15)) return reply(request, 400, "Please choose your child's age.");
  if (!PROGRAMMES.includes(d.programme)) return reply(request, 400, "Please choose a school programme.");
  if (!d.subjects.length) return reply(request, 400, "Please choose at least one subject.");
  if (!(d.confidence >= 1 && d.confidence <= 5)) return reply(request, 400, "Please choose how confident your child feels.");
  if (!GOALS.includes(d.goal)) return reply(request, 400, "Please choose what you are looking for.");
  if (form.get("consent") !== "yes") return reply(request, 400, "Please tick the box to agree to the privacy notice.");

  if (!env.DB) return reply(request, 503, "The form isn't set up yet. Please try again later.");

  // At most 3 inquiries per email address per hour.
  const recent = await env.DB.prepare(
    "SELECT COUNT(*) AS n FROM inquiries WHERE email = ? AND created_at > strftime('%Y-%m-%dT%H:%M:%SZ','now','-1 hour')"
  ).bind(d.email).first();
  if (recent && recent.n >= 3) return reply(request, 429, "We already have your message. We'll reply soon.");

  await env.DB.prepare(
    "INSERT INTO inquiries (parent_name, email, age, programme, subjects, confidence, goal, message, source) VALUES (?,?,?,?,?,?,?,?,?)"
  ).bind(d.parent_name, d.email, d.age, d.programme, d.subjects.join(", "), d.confidence, d.goal, d.message || null, d.source || null).run();

  if (env.RESEND_API_KEY && env.NOTIFY_EMAIL) {
    const text = [
      `New lessons inquiry`, ``,
      `Parent: ${d.parent_name} <${d.email}>`,
      `Child's age: ${d.age}`, `Programme: ${d.programme}`, `Subjects: ${d.subjects.join(", ")}`,
      `Confidence (1-5): ${d.confidence}`, `Looking for: ${d.goal}`, `Came from: ${d.source || "-"}`, ``,
      d.message || "(no message)",
    ].join("\n");
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: env.MAIL_FROM || "onboarding@resend.dev",
          to: [env.NOTIFY_EMAIL], reply_to: d.email,
          subject: `Lessons inquiry: age ${d.age}, ${d.subjects.join(" + ")}`, text,
        }),
      });
    } catch { /* the inquiry is already saved in D1; a failed email must not lose it */ }
  }
  return reply(request, 200);
}

export const onRequest = ({ request }) => reply(request, 405, "Use the form on /lessons/.");
