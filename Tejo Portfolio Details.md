# Tejo Portfolio Details

Fill out each section with real information so the React app and the legacy flip-book can be updated without hunting through files. Leave the headings in place and replace the placeholder guidance with your values.

---

## 1. Personal Snapshot

| Field | Your Value |
| --- | --- |
| Full name (as displayed) | Tejo Sridhar M V S|
| Short tagline (1 line) | AI/ML Developer |
| Long hero paragraph (2–3 sentences) | I work on projects mostly related to AI and machine learning. I also have experience in web development. |
| Location / timezone | Chennai |
| Preferred pronouns | He/Him |
| Mini bio for About page | I do coding and i learn new tech. In my free time, I watch cartoons, read articles, and play cricket. Along with these hobbies, I work on AI, machine learning, and web development projects. |

### Featured Highlights

List 3–4 accomplishments or focus areas for the landing highlights section.

1. 
2. 
3. 
4. 

---

## 2. Contact & Social Links

| Channel | URL / Address | Notes |
| --- | --- | --- |
| Email (public) | tejosridhar.mvs@gmail.com |  |
| Alternate email (for contact form forwarding) | tejosridhar57@gmail.com | |
| LinkedIn | www.linkedin.com/in/tejosridhar | |
| GitHub profile | https://github.com/Tejo0507 | |
| Instagram / Threads | https://www.instagram.com/me.tejo | |
| Any other link | | |

### Contact Form Backend
- Service/provider (e.g., Resend, Formspree, custom API): 
- Endpoint URL: 
- API key / env var name: 

---

## 3. Assets Checklist

| Asset | Path in repo | Specs | Status / Notes |
| --- | --- | --- | --- |
| Profile photo | "E:\Profile Pic\Portfolio Profile.jpg" | 500×500 JPG/PNG | |
| Favicon | `images/favicon.png` | 32×32 or 64×64 PNG/ICO | |
| Resume PDF | `assets/Tejo_Sridhar_CV.pdf` | < 2 MB | |


If you host assets elsewhere (S3, Cloudinary), note the CDN base URL: ` ______________________ `

---

## 4. Project Gallery Data

For each showcased project fill in the table. Duplicate rows as needed (Mini OS Desk, Study Coach, Snippets Vault, etc.).

| ID / slug | Title | One-sentence summary | Year | Difficulty (Beginner/Intermediate/Advanced) | Tech stack list | Repo URL | Live URL | Image path or external link | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mini-os | | | | | | | | | |
| study-coach | | | | | | | | | |
| snippets-vault | | | | | | | | | |
| timeline-lab | | | | | | | | | |
| campus-delivery | | | | | | | | | |
| sensor-board | | | | | | | | | |

### Admin Project Drawer Defaults
If you want different defaults when creating projects in the admin view:
- Default repo URL: https://github.com/Tejo0507/CabEase
- Default live/demo URL: 
- Default cover image path: 

---

## 5. Study Materials & Drive Links

### Global Drive Settings
- Primary Google account / workspace: 
- Shared drive or folder base URL: 
- Do you need a proxy API for thumbnails? (Yes/No)
  - If yes → Proxy endpoint URL: 
  - API key / env var name: 

### Collections & Files
Provide the canonical Google Drive/Docs links. Ensure each file is set to “Anyone with the link can view.” The app automatically extracts IDs from these URLs.

| Title | Subject | Semester | Tags | File type (pdf/google-doc/slide/video/etc.) | Google Drive/Docs link | Collection name | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Linear Algebra Cheat Sheet | | | | | | | |
| Operating Systems Slides | | | | | | | |
| Thermodynamics Lab Walkthrough | | | | | | | |
| Marketing Research Template | | | | | | | |
| Digital Signal Processing Notes | | | | | | | |
| Creative Writing Prompt Reel | | | | | | | |

Add rows for any additional materials you plan to feature.

### Folder IDs for bulk imports
| Purpose | Drive folder link | Extracted ID |
| --- | --- | --- |
| STEM Essentials | | |
| Creative Lab | | |
| Archived Materials | | |

---

## 6. Study Timetable Profiles

For each profile you expect to ship (Finals Sprint, Steady Practice, etc.), capture the headline info.

| Profile ID | Name | Preferred study days | Daily hours | Study window (start-end) | Break schedule (focus/break mins) | Plan span days | Revision frequency (days) | Subjects + exam dates |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| exam-ready | | | | | | | | |
| steady-growth | | | | | | | | |

Subject breakdown example:
```
Subject: Advanced Calculus
- Estimated hours: 
- Difficulty (1–5): 
- Exam date (YYYY-MM-DD): 
- Topics list with estimated minutes
```

---

## 7. Snippets Vault Seed Data

If you want the vault preloaded with your own snippets, list them here or point to a JSON file.

| ID | Title | Language | Tags | Description | Folder | Favorite (Y/N) | Source link |
| --- | --- | --- | --- | --- | --- | --- | --- |

Notes on export/copy preferences: 

---

## 8. AI Lab Tools

| Tool ID | Title | Description | Difficulty (Easy/Medium/Advanced) | Data source / model | Notes |
| --- | --- | --- | --- | --- | --- |
| image-classification | | | | | |
| text-sentiment | | | | | |
| number-predictor | | | | | |
| kmeans | | | | | |
| pca | | | | | |
| tokenizer | | | | | |
| chatbot | | | | | |
| matrix | | | | | |
| scaling | | | | | |

Datasets or API keys needed:
- 

---

## 9. Admin & Security

| Setting | Value |
| --- | --- |
| Admin passphrase (replace `artisan-admin`) | |
| Allowed admins (emails/usernames) | |
| Inactivity timeout (minutes) | |
| Storage backend (localStorage, Supabase, etc.) | |
| Admin API base URL (if any) | |

### Environment Variables
List every secret/env var you’ll need when deploying (e.g., `VITE_DRIVE_PROXY_URL`, `VITE_CONTACT_ENDPOINT`, `VERCEL_ANALYTICS_ID`).

| Variable name | Purpose | Value / placeholder |
| --- | --- | --- |

---

## 10. Analytics, Telemetry & Integrations

| Tool | Status | Notes |
| --- | --- | --- |
| Plausible / Google Analytics ID | | |
| Vercel / Netlify Analytics | | |
| Sentry / error tracking | | |
| Heatmaps / UX tools | | |

---

## 11. Deployment & Hosting

| Environment | Domain / URL | Hosting provider | Notes |
| --- | --- | --- | --- |
| Production | | | |
| Preview / Staging | | | |
| Legacy book-portfolio host | | | |

Deployment command or CI workflow reference: 

---

## 12. Future Enhancements

Use this space to jot down upcoming sections you plan to add (blog, testimonials, certifications, hackathons, etc.) so we can prep data contracts ahead of time.

- 
- 
- 

---

Once this file is filled out, we can systematically update the data files (`src/data/*`), stores, assets, and service worker caches using a single source of truth.
