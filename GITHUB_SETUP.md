# GitHub Setup Guide

## ✅ Local Testing Passed!

Your actor works perfectly locally. Now let's push to GitHub and deploy to Apify.

---

## Step 1: Create GitHub Repository

### Option A: Create on GitHub.com (Recommended)

1. Go to: **https://github.com/new**

2. Fill in:
   - **Repository name**: `codemap-apify-actor`
   - **Description**: `AI-optimized codebase maps generator - Turn GitHub repos into instant AI context for ChatGPT & Claude`
   - **Visibility**: ✅ **Public** (required for free Apify tier)
   - **Initialize**: ❌ Don't add README, .gitignore, or license (we have them)

3. Click **"Create repository"**

### Option B: Use GitHub CLI

```bash
# If you have gh CLI installed
gh repo create codemap-apify-actor --public --source=. --remote=origin
```

---

## Step 2: Push Code to GitHub

After creating the repo, GitHub shows these commands. Run them:

```bash
cd C:\Users\Pool\Desktop\codemap-apify-actor

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/codemap-apify-actor.git

# Rename branch to main
git branch -M main

# Commit all files
git commit -m "Initial commit: Codemap Apify Actor MVP

- Complete actor with GitHub cloning
- Codemap generation and parsing
- Multiple output formats (Markdown, JSON)
- Error handling and cleanup
- Local testing passed successfully
- Ready for Apify deployment"

# Push to GitHub
git push -u origin main
```

---

## Step 3: Verify on GitHub

1. Go to your repository: `https://github.com/YOUR_USERNAME/codemap-apify-actor`
2. You should see all files:
   - ✅ `.actor/` directory
   - ✅ `src/` directory
   - ✅ `Dockerfile`
   - ✅ `README.md`
   - ✅ All other files

---

## Step 4: Deploy to Apify from GitHub

### Using Apify Console (Web UI)

1. Go to: **https://console.apify.com/actors**
2. Click **"Import from Git"** button
3. Enter your repo URL: `https://github.com/YOUR_USERNAME/codemap-apify-actor`
4. Click **"Import"**
5. Apify will:
   - Clone your repo
   - Build the Docker image
   - Deploy the actor
   - Make it available in your account

### Using Apify CLI

```bash
# Install Apify CLI (if not installed)
npm install -g apify-cli

# Login to Apify
apify login

# Push to Apify (from project directory)
cd C:\Users\Pool\Desktop\codemap-apify-actor
apify push
```

---

## Step 5: Test on Apify Cloud

1. Go to your actor in Apify Console
2. Click **"Try it"**
3. Enter test input:

```json
{
  "repositoryUrl": "https://github.com/JordanCoin/codemap",
  "branch": "main",
  "outputFormat": "both",
  "includeDependencies": false
}
```

4. Click **"Start"**
5. Wait ~30 seconds
6. Check **"Results"** tab for output

---

## Step 6: Publish to Apify Store

Once testing works:

1. In actor settings, click **"Publish to Store"**
2. Fill in:
   - **Title**: "Codemap Generator - AI-Ready Repository Analysis"
   - **Description**: Copy from README.md
   - **Categories**: Development, AI, Documentation
   - **Pricing**: Set up tiers (Free, Basic $9, Pro $29, Enterprise $99)

3. Upload screenshots:
   - Input form
   - Output sample
   - Usage in ChatGPT (demo)

4. Submit for review (1-3 days)

---

## Quick Reference Commands

```bash
# Check git status
git status

# View remote
git remote -v

# View commit log
git log --oneline

# Push changes (after edits)
git add .
git commit -m "Update: description of changes"
git push

# Pull latest from Apify
apify pull

# Test locally
node test-local.js

# Deploy to Apify
apify push
```

---

## Troubleshooting

### "Permission denied" when pushing

**Solution**: Set up GitHub authentication

```bash
# Option 1: Use GitHub CLI
gh auth login

# Option 2: Use Personal Access Token
# Go to: https://github.com/settings/tokens
# Create token with 'repo' scope
# Use as password when git asks
```

### "Remote already exists"

**Solution**: Update remote URL

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/codemap-apify-actor.git
```

### Can't find Apify actor after import

**Solution**: Check actor list

```bash
apify actor ls
```

---

## Your Repository Should Contain

```
codemap-apify-actor/
├── .actor/
│   ├── actor.json              ✅
│   └── input_schema.json       ✅
├── src/
│   ├── main.js                 ✅
│   ├── github-cloner.js        ✅
│   ├── codemap-runner.js       ✅
│   └── output-formatter.js     ✅
├── Dockerfile                  ✅
├── package.json                ✅
├── README.md                   ✅
├── .gitignore                  ✅
└── test-local.js               ✅ (optional for GitHub)
```

---

## Next Steps After Deployment

1. ✅ **Test on Apify cloud** - Verify it works
2. ✅ **Set up pricing** - Configure subscription tiers
3. ✅ **Publish to store** - Submit for review
4. ✅ **Market your actor** - Product Hunt, Twitter, Reddit
5. ✅ **Monitor usage** - Track runs and revenue

---

## Success Checklist

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Imported to Apify (or pushed via CLI)
- [ ] Tested on Apify cloud
- [ ] Actor works successfully
- [ ] Screenshots taken
- [ ] Published to store
- [ ] Pricing configured
- [ ] Ready to launch! 🚀

---

**Your GitHub URL** (after creation):
`https://github.com/YOUR_USERNAME/codemap-apify-actor`

**Your Apify Actor URL** (after deployment):
`https://console.apify.com/actors/YOUR_ACTOR_ID`

---

Good luck! You're one push away from having a deployable, money-making Apify actor! 💰
