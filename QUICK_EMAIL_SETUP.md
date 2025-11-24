# 🚀 Quick Setup: Get Your Email Credentials in 3 Minutes

## What You Need to Do

### Step 1: Get Gmail App Password (2 minutes)

**Click these links in order:**

1. **Enable 2FA**: https://myaccount.google.com/signinoptions/two-step-verification
   - Click "Get Started"
   - Follow prompts (usually send code to your phone)
   - Complete setup

2. **Generate App Password**: https://myaccount.google.com/apppasswords
   - Select: **Mail**
   - Device: **Other (Custom name)**
   - Type: **Scheduler App**
   - Click **Generate**
   - **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

### Step 2: Add to Your .env File (1 minute)

**Open your .env file:**
```bash
cd /Users/vitorramalho/Documents/Projects/scheduler/api
code .env
```

**Add these lines at the end:**
```env
# Email Configuration (for appointment notifications)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=YOUR_EMAIL@gmail.com
MAIL_PASSWORD=YOUR_16_CHAR_APP_PASSWORD
MAIL_FROM=noreply@scheduler.com
```

**Replace:**
- `YOUR_EMAIL@gmail.com` → Your actual Gmail address
- `YOUR_16_CHAR_APP_PASSWORD` → The password you just copied

**Save the file!**

### Step 3: Restart API (10 seconds)

```bash
cd /Users/vitorramalho/Documents/Projects/scheduler/api
npm run start:dev
```

### Step 4: Test (30 seconds)

Create an appointment and check your email! 🎉

---

## Example

Your `.env` file should look like this:

```env
# Application settings
NODE_ENV=development
PORT=3000

# Database settings
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=scheduler

# JWT settings
JWT_SECRET=change-this-to-a-secure-random-string
JWT_EXPIRES_IN=30d

# Payment provider settings
ABACATE_PAY_SECRET_KEY=your-abacate-pay-secret-key-here

# Email Configuration (NEW - ADD THIS!)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=john.doe@gmail.com
MAIL_PASSWORD=abcd efgh ijkl mnop
MAIL_FROM=noreply@scheduler.com
```

---

## ⚠️ Troubleshooting

**Can't find "App passwords"?**
→ Make sure 2-Step Verification is enabled first!

**"Authentication failed" error?**
→ Use the App Password, NOT your regular Gmail password

**Still stuck?**
→ Check the detailed guide: `HOW_TO_GET_EMAIL_CREDENTIALS.md`

---

## ✅ That's It!

**Total time**: ~3 minutes  
**Result**: Emails sent automatically when appointments are created! 🚀

---

**Links You Need:**
- 2FA Setup: https://myaccount.google.com/signinoptions/two-step-verification
- App Password: https://myaccount.google.com/apppasswords
- Detailed Guide: `HOW_TO_GET_EMAIL_CREDENTIALS.md`
