"""Site-wide settings. Change these in one place; every page reads them at build time."""

SITE_NAME = "ExaminerPrep Junior"
SITE_URL = "https://junior.examinerprep.com"   # used for canonical links, og:url and the sitemap
TAGLINE = "Maths and Science practice for ages 9 to 14"
LANG = "en-GB"

# Sister site for older students (IGCSE, IB, A Level).
SISTER_NAME = "ExaminerPrep"
SISTER_URL = "https://examinerprep.com"

# Cloudflare Web Analytics token. Empty means no beacon is added to the pages.
CF_BEACON_TOKEN = ""

# Where parents can write about privacy questions (shown on /privacy/). Shared with ExaminerPrep for now.
CONTACT_EMAIL = "info@examinerprep.com"
