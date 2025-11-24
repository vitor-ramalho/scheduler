# 🔑 How to Get Gmail SMTP Credentials for Email Service

## Step-by-Step Guide

### Option 1: Gmail with App Password (Recommended for MVP/Testing)

#### Step 1: Enable 2-Factor Authentication

1. **Go to your Google Account**
   - Visit: https://myaccount.google.com/
   - Or click your profile picture → "Manage your Google Account"

2. **Navigate to Security**
   - Click "Security" in the left sidebar
   - Or visit directly: https://myaccount.google.com/security

3. **Enable 2-Step Verification**
   - Scroll to "How you sign in to Google"
   - Click "2-Step Verification"
   - Click "Get Started"
   - Follow the prompts to set up 2FA (usually via phone)
   - Complete the setup

#### Step 2: Generate App Password

1. **Return to Security Settings**
   - Go back to: https://myaccount.google.com/security

2. **Find App Passwords**
   - In the "How you sign in to Google" section
   - Click "2-Step Verification"
   - Scroll down to find "App passwords" (at the bottom)
   - Or visit directly: https://myaccount.google.com/apppasswords

3. **Generate New App Password**
   - Click "App passwords"
   - You may need to sign in again
   - Select app: **Mail**
   - Select device: **Other (Custom name)**
   - Enter name: **Scheduler App** (or any name you like)
   - Click **Generate**

4. **Copy the Password**
   - You'll see a 16-character password like: `abcd efgh ijkl mnop`
   - **IMPORTANT**: Copy this immediately - you won't see it again!
   - Keep it secure

#### Step 3: Update Your .env File

1. **Open your `.env` file**
   ```bash
   cd /Users/vitorramalho/Documents/Projects/scheduler/api
   nano .env
   # or use your preferred editor: code .env
   ```

2. **Add these lines:**
   ```env
   # Email Configuration
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USER=your.email@gmail.com
   MAIL_PASSWORD=abcd efgh ijkl mnop
   MAIL_FROM=noreply@yourcompany.com
   ```

3. **Replace the values:**
   - `MAIL_USER`: Your Gmail address (e.g., `john.doe@gmail.com`)
   - `MAIL_PASSWORD`: The 16-character app password you just copied
   - `MAIL_FROM`: The "from" address shown in emails (can be anything)

4. **Save the file** (Ctrl+O, then Enter, then Ctrl+X if using nano)

#### Step 4: Test It!

1. **Restart your API:**
   ```bash
   cd /Users/vitorramalho/Documents/Projects/scheduler/api
   npm run start:dev
   ```

2. **Create a test appointment** through your app

3. **Check your email** - both client and professional should receive emails!

---

## Visual Guide: Where to Find App Passwords

```
Google Account (myaccount.google.com)
    ↓
Security Tab
    ↓
2-Step Verification
    ↓
Scroll to Bottom
    ↓
App passwords ← Click here!
    ↓
Select "Mail" + "Other"
    ↓
Generate
    ↓
Copy the 16-character password
```

---

## Example .env Configuration

Here's what your complete `.env` file should look like:

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
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=30d

# Email Configuration (Gmail)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=john.doe@gmail.com
MAIL_PASSWORD=abcd efgh ijkl mnop
MAIL_FROM=noreply@scheduler.com
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: Can't Find "App passwords" Option

**Cause**: 2-Step Verification not enabled or Google Workspace account

**Solution**:
1. Make sure 2FA is fully enabled and working
2. If using Google Workspace, admin may need to enable it
3. Wait a few minutes after enabling 2FA, then check again
4. Try this direct link: https://myaccount.google.com/apppasswords

### Issue 2: "Authentication Failed" Error

**Cause**: Wrong password or not using App Password

**Solution**:
- ✅ Use the 16-character App Password (NOT your regular Gmail password)
- ✅ Remove any spaces from the password
- ✅ Make sure you copied it correctly
- ✅ Try generating a new App Password

### Issue 3: "Less Secure Apps" Message

**Cause**: Trying to use regular password instead of App Password

**Solution**:
- ❌ Don't enable "Less secure app access" (deprecated by Google)
- ✅ Use App Passwords instead (more secure)

### Issue 4: Emails Going to Spam

**Cause**: Gmail not recognizing your domain

**Solution** (for now):
- Ask recipients to check spam folder
- Mark email as "Not Spam"
- For production, set up proper domain authentication (SPF/DKIM)

---

## 🔒 Security Best Practices

### DO:
- ✅ Keep App Password in `.env` file (never commit to Git)
- ✅ Add `.env` to `.gitignore`
- ✅ Use different App Passwords for different apps
- ✅ Revoke App Passwords you're not using
- ✅ Use environment variables in production

### DON'T:
- ❌ Share your App Password
- ❌ Commit `.env` to version control
- ❌ Use your main Gmail password
- ❌ Enable "Less secure apps"
- ❌ Hardcode credentials in code

---

## 🚀 Alternative: Production Email Services

For production, consider these alternatives to Gmail:

### SendGrid (Recommended)
**Pros**: Reliable, good free tier, easy setup
**Free Tier**: 100 emails/day
**Cost**: $19.95/month for 40,000 emails

**Setup**:
1. Sign up: https://sendgrid.com/
2. Verify your domain
3. Create API Key
4. Update `.env`:
   ```env
   MAIL_HOST=smtp.sendgrid.net
   MAIL_PORT=587
   MAIL_USER=apikey
   MAIL_PASSWORD=your-sendgrid-api-key
   MAIL_FROM=noreply@yourdomain.com
   ```

### AWS SES
**Pros**: Very cheap, scalable
**Free Tier**: 62,000 emails/month (first year)
**Cost**: $0.10 per 1,000 emails

**Setup**:
1. Sign up: https://aws.amazon.com/ses/
2. Verify your domain
3. Get SMTP credentials
4. Update `.env` with AWS SMTP settings

### Mailgun
**Pros**: Developer-friendly, good APIs
**Free Tier**: 100 emails/day
**Cost**: $35/month for 50,000 emails

**Setup**:
1. Sign up: https://www.mailgun.com/
2. Verify your domain
3. Get SMTP credentials
4. Update `.env` with Mailgun SMTP settings

---

## 📋 Checklist

Before you start:
- [ ] Have a Gmail account (or create one)
- [ ] Access to the account settings
- [ ] Text editor to edit .env file

Setting up:
- [ ] Enable 2-Step Verification in Google Account
- [ ] Generate App Password for "Mail"
- [ ] Copy the 16-character password
- [ ] Create/update api/.env file
- [ ] Add MAIL_USER with your Gmail address
- [ ] Add MAIL_PASSWORD with the App Password
- [ ] Save the .env file

Testing:
- [ ] Restart the API server
- [ ] Create a test appointment
- [ ] Check client email inbox
- [ ] Check professional email inbox
- [ ] Check spam folders if not in inbox
- [ ] Verify console logs show success

---

## 🎯 Quick Start Commands

```bash
# 1. Navigate to API folder
cd /Users/vitorramalho/Documents/Projects/scheduler/api

# 2. Edit .env file
code .env
# or
nano .env

# 3. Add email configuration (see above)

# 4. Restart API
npm run start:dev

# 5. Test by creating an appointment!
```

---

## 📞 Need Help?

### Gmail Help
- Official Guide: https://support.google.com/accounts/answer/185833
- 2FA Setup: https://support.google.com/accounts/answer/185839
- App Passwords: https://support.google.com/accounts/answer/185833

### If Still Stuck
Common solutions:
1. **Double-check 2FA is enabled** - App passwords won't appear without it
2. **Wait a few minutes** after enabling 2FA
3. **Try incognito mode** when accessing Google Account settings
4. **Use different browser** if having issues
5. **Check Google Account security alerts** for any blocks

---

## ✨ Summary

**What you need:**
1. Gmail account with 2FA enabled
2. App Password (16 characters)
3. Updated .env file

**Time required:** ~5 minutes

**Result:** Emails sent automatically when appointments are created! 🎉

---

**Last Updated**: November 19, 2025  
**Tested With**: Gmail, Google Workspace accounts  
**Status**: Production-ready ✅
