-- Lesson inquiries from /lessons/. Apply with:
--   npx wrangler d1 execute junior-site --remote --file=migrations/0001_inquiries.sql
CREATE TABLE IF NOT EXISTS inquiries (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ','now')),
  parent_name TEXT    NOT NULL,
  email       TEXT    NOT NULL,
  age         INTEGER NOT NULL,
  programme   TEXT    NOT NULL,
  subjects    TEXT    NOT NULL,
  confidence  INTEGER NOT NULL,
  goal        TEXT    NOT NULL,
  message     TEXT,
  source      TEXT,              -- utm_source or referring page, for the funnel
  status      TEXT    NOT NULL DEFAULT 'new'
);
CREATE INDEX IF NOT EXISTS inquiries_email_time ON inquiries (email, created_at);
