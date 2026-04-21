# Reflekt Auto Care — Site Audit Questions
*Generated: April 10, 2026 — Answer these so development can resume*

---

## 🔴 CRITICAL (Site-Breaking Issues)

### 1. Chatbot Backend — Where will it be hosted?

The AI chatbot **will not work** on GitHub Pages because GitHub Pages can't run the Node.js server (`chatbot-server.js`). The chatbot will appear on every page but every message will fail with a "trouble connecting" error for real visitors.

The server file itself mentions good free options: **Render, Railway, or Fly.io.**

**Your answer:**
> _Where do you want to host the chatbot backend? Or do you want me to set one up for you on a free platform like Render?_

---

### 2. Hero Background Image — Can you provide a JPG/PNG version?

The homepage hero image is saved as `hero-bg.heic` (Apple format). **Chrome, Firefox, and most non-Safari browsers cannot display HEIC files** — your hero section will just show a black background for most visitors.

**Your answer:**
> _Do you have the original photo as a JPG or PNG? Or should I convert the HEIC file that's already in the folder?_

---

## 🟡 NEEDS A DECISION (Currently broken or doing nothing)

### 3. Homepage "Request Booking" Button — What should it do?

The button on the hero form (right side of the homepage) has no action attached. Clicking it currently does absolutely nothing. What should happen when someone clicks it?

Options:
- Redirect to the booking page (`booking.html`)
- Open the Square Appointments URL directly
- Submit the form data to your email (would need a form service like Formspree)

**Your answer:**
> ___________________________________________

---

### 4. Broken Nav Links — Where should these go?

These links exist on every page but currently go nowhere (`href="#"`). Decide what each should do:

- **"Process"** (nav) → ___________________________________________
- **"Reviews"** (nav) → ___________________________________________
- **"Contact"** (nav) → ___________________________________________
- **"Privacy"** (footer) → ___________________________________________
- **"Contact"** (footer) → ___________________________________________

Common options: scroll to a section on the homepage, link to a separate page, open your email, or remove the link entirely.

---

### 5. Square Appointments URL — Do you have it yet?

The booking page still has `YOUR_SQUARE_APPOINTMENTS_URL` as a placeholder. Once you have your actual Square Appointments booking URL (found in Square Dashboard → Appointments → Booking Sites), I can plug it in and the booking page will be fully live.

**Your answer:**
> _Square URL (paste here when ready):_ ___________________________________________

---

### 6. Commercial Inquiry Form — Is the mailto approach OK?

When someone fills out the commercial inquiry form and submits, it tries to open their default email app. This works on most desktops but fails silently for many mobile users and some browsers.

**Your answer:**
> _Is this OK as-is, or do you want me to wire it through a free form service (like Formspree) that sends straight to your Gmail without requiring the visitor to have an email app set up?_

---

## 🔵 QUICK WINS (I can do these without any input from you)

### 7. Eliminate the extra redirect (index.html → reflekt-homepage.html)
I can rename/merge `reflekt-homepage.html` into `index.html` so visitors and search engines don't hit an unnecessary redirect every time. All internal links would be updated automatically.

**Your answer:**
> _Yes / No_

---

### 8. Add a favicon
The site has no favicon, so visitors see a blank tab icon. I can generate one using the gold "R" from your logo.

**Your answer:**
> _Yes / No_

---

*Once these are answered, development resumes immediately.*
