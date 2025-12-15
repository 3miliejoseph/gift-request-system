# Deployment Guide

Quick guide to deploy your Gift Request System to Vercel.

## Prerequisites

- [x] GitHub repository with your code
- [x] Vercel account
- [x] Neon (PostgreSQL) account

## Quick Deploy (2 Methods)

### Method 1: Automated Script (Recommended)

**Step 1: Create your `.env` file**

```bash
# Copy the example file
cp .env.example .env

# Edit .env and fill in your actual values:
# - DATABASE_URL from Neon
# - ADMIN_USERNAME (e.g., admin)
# - ADMIN_PASSWORD (choose a secure one)
# - SESSION_SECRET (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
```

**Step 2: Run deployment script**

```bash
# Using Node.js script
cd mockapp
node deploy-to-vercel.js

# OR using Bash script (Mac/Linux)
cd mockapp
chmod +x deploy-to-vercel.sh
./deploy-to-vercel.sh
```

**Step 3: Initialize database**

After deployment:

```bash
# Pull environment variables from Vercel
vercel env pull .env.production.local

# Initialize database
npx prisma db push
```

Done! 🎉

---

### Method 2: Manual Deployment

**Step 1: Get Neon Database URL**

1. Go to [console.neon.tech](https://console.neon.tech)
2. Create new project
3. Copy connection string (starts with `postgresql://`)

**Step 2: Deploy via Vercel Dashboard**

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Add environment variables:
   - `DATABASE_URL` - Your Neon connection string
   - `ADMIN_USERNAME` - `admin`
   - `ADMIN_PASSWORD` - Your secure password
   - `SESSION_SECRET` - Random 32+ character string
4. Click **Deploy**

**Step 3: Initialize Database**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project
vercel link

# Pull environment variables
vercel env pull .env.production.local

# Run database migration
npx prisma db push
```

---

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string from Neon | `postgresql://user:pass@host/db` |
| `ADMIN_USERNAME` | Admin login username | `admin` |
| `ADMIN_PASSWORD` | Admin login password | `SecurePass123!` |
| `SESSION_SECRET` | Random secret for sessions (32+ chars) | Generate with crypto |

### Generate SESSION_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## After Deployment

### 1. Test Your App

Visit your Vercel URL:
- Main app: `https://your-app.vercel.app`
- Admin login: `https://your-app.vercel.app/admin`

### 2. Update Mock App

Update URLs in `mockapp/index.html`:

```javascript
// Change these to your production URLs
document.getElementById('giftSystemUrl').value = 'https://your-app.vercel.app';
document.getElementById('adminSystemUrl').value = 'https://your-app.vercel.app/admin';
```

### 3. Deploy Mock App (Optional)

You can also deploy the mock app to Vercel for testing:

```bash
cd mockapp
vercel
```

---

## Troubleshooting

### Database Connection Error

Make sure your `DATABASE_URL` includes `?sslmode=require`:
```
postgresql://user:pass@host/db?sslmode=require
```

### Prisma Client Error

Re-generate Prisma client:
```bash
npx prisma generate
npx prisma db push
```

### Environment Variables Not Loading

Pull them again:
```bash
vercel env pull .env.production.local
```

### Build Failures

Check Vercel build logs:
1. Go to your project dashboard
2. Click on the failed deployment
3. View "Build Logs"

---

## Redeploy After Changes

Automatic:
- Push to GitHub → Vercel auto-deploys

Manual:
```bash
vercel --prod
```

---

## Cost Estimate

Using free tiers:
- **Vercel**: Free (100GB bandwidth/month)
- **Neon**: Free (0.5GB storage)
- **Total**: $0/month for small teams

---

## Support

- Vercel Docs: https://vercel.com/docs
- Neon Docs: https://neon.tech/docs
- Prisma Docs: https://prisma.io/docs

Need help? Check the main README.md or DEPLOYMENT.md files.

