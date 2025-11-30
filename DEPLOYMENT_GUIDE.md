# 🚀 Deployment Guide - Codemap Apify Actor

## Prerequisites

1. **Apify Account**
   - Sign up at https://apify.com (free tier available)
   - Get your API token from Settings

2. **Apify CLI**
   ```bash
   npm install -g apify-cli
   ```

3. **GitHub Account** (for version control)

---

## Step 1: Set Up Apify CLI

```bash
# Login to Apify
apify login

# Enter your API token when prompted
```

---

## Step 2: Initialize Actor (Already Done!)

The project structure is already set up. You have:

```
codemap-apify-actor/
├── .actor/
│   ├── actor.json          ✅ Actor configuration
│   └── input_schema.json   ✅ Input validation
├── src/
│   ├── main.js            ✅ Main entry point
│   ├── github-cloner.js   ✅ GitHub integration
│   ├── codemap-runner.js  ✅ Codemap execution
│   └── output-formatter.js ✅ Output formatting
├── Dockerfile             ✅ Container config
├── package.json           ✅ Dependencies
└── README.md              ✅ Documentation
```

---

## Step 3: Test Locally (Optional)

### Install Dependencies

```bash
cd C:\Users\Pool\Desktop\codemap-apify-actor
npm install
```

### Download Codemap Binary for Local Testing

```bash
# Create binaries directory
mkdir binaries

# For Windows (local testing)
cd binaries
curl -L -o codemap-windows.zip https://github.com/JordanCoin/codemap/releases/download/v2.4/codemap-windows-amd64.zip
unzip codemap-windows.zip
mv codemap-windows-amd64/codemap.exe codemap.exe
cd ..
```

### Create Test Input

```bash
# Create apify_storage directory
mkdir apify_storage
mkdir apify_storage/key_value_stores
mkdir apify_storage/key_value_stores/default
```

Create file: `apify_storage/key_value_stores/default/INPUT.json`

```json
{
  "repositoryUrl": "https://github.com/JordanCoin/codemap",
  "branch": "main",
  "outputFormat": "both"
}
```

### Run Locally

```bash
npm start
```

Check output in: `apify_storage/datasets/default/`

---

## Step 4: Deploy to Apify

### Push to Apify

```bash
# From project directory
apify push
```

This will:
1. Build the Docker container
2. Upload to Apify cloud
3. Create the actor in your account

### Verify Deployment

1. Go to https://console.apify.com/actors
2. Find "codemap-generator" in your list
3. Click to open

---

## Step 5: Test on Apify

### Run a Test

1. Click "Try it" in the actor console
2. Enter test input:
   ```json
   {
     "repositoryUrl": "https://github.com/JordanCoin/codemap",
     "branch": "main",
     "outputFormat": "markdown"
   }
   ```
3. Click "Start"
4. Wait 10-30 seconds
5. View results in the "Results" tab

### Check Logs

- Click "Log" tab to see execution details
- Look for ✅ success indicators
- Check for any errors

---

## Step 6: Publish to Apify Store

### Prepare for Publishing

1. **Actor Details**
   - Title: "Codemap Generator - AI-Ready Repository Analysis"
   - Description: Use the description from README.md
   - Categories: Development, AI, Documentation

2. **Screenshots**
   - Take screenshots of:
     - Input form
     - Generated codemap output
     - Usage in ChatGPT (demo)
   - Upload to `.actor/screenshots/`

3. **SEO & Marketing**
   - Keywords: codemap, github, AI, repository, analyzer
   - Use case examples in description

### Submit for Review

1. Go to actor settings
2. Click "Publish to Store"
3. Fill in all required fields
4. Submit for Apify review (usually 1-3 days)

---

## Step 7: Set Up Pricing

### Pricing Tiers

Navigate to actor settings → Pricing

**Free Tier** (to attract users):
- 10 runs/month
- No credit card required

**Basic - $9/month**:
- 100 runs/month
- Email support

**Pro - $29/month**:
- 500 runs/month
- Priority support
- Advanced features

**Enterprise - $99/month**:
- Unlimited runs
- SLA guarantee
- Custom features

### Consumption Pricing

Set per-run pricing:
- Small repos (<100 files): $0.02
- Medium repos (100-1000): $0.03
- Large repos (>1000): $0.05

---

## Step 8: Marketing & Launch

### Pre-Launch Checklist

- [ ] Actor tested and working
- [ ] Published to Apify Store
- [ ] README is comprehensive
- [ ] Screenshots uploaded
- [ ] Pricing configured
- [ ] Support email set up

### Launch Strategy

**Day 1: Soft Launch**
- Share with friends/colleagues
- Post in private communities
- Gather feedback

**Week 1: Public Launch**
- Post on Product Hunt
- Share on Twitter/X
- Post in r/programming, r/ChatGPT
- Share on LinkedIn
- Email coding newsletters

**Week 2: Content Marketing**
- Write blog post: "Save 85% on AI Tokens"
- Create video tutorial
- Post on Hacker News (Show HN)

**Ongoing**:
- Monitor usage
- Fix bugs
- Add features from user feedback
- Build case studies

---

## Step 9: Monitor & Optimize

### Analytics to Track

1. **Usage Metrics**
   - Total runs
   - Success rate
   - Average execution time
   - Popular repositories

2. **Business Metrics**
   - Free → Paid conversion rate
   - Churn rate
   - MRR (Monthly Recurring Revenue)
   - Customer acquisition cost

3. **Performance Metrics**
   - Error rate
   - Timeout rate
   - Average response time

### Optimization

**Performance**:
- Cache popular repos
- Optimize codemap parsing
- Add request queuing

**Features**:
- Add most-requested features
- Improve error messages
- Better documentation

**Pricing**:
- A/B test pricing tiers
- Offer discounts for annual plans
- Create referral program

---

## Step 10: Scale & Grow

### Growth Tactics

**Month 1-3**: Build user base
- Focus on free tier
- Get testimonials
- Build case studies
- Improve based on feedback

**Month 4-6**: Monetization
- Convert free to paid
- Upsell to higher tiers
- Add enterprise features
- Partner with AI tools

**Month 7-12**: Scale
- API access tier
- White-label option
- Team features
- Integration marketplace

### Revenue Goals

- **Month 1**: 100 users, $100 MRR
- **Month 3**: 500 users, $1,000 MRR
- **Month 6**: 2,000 users, $5,000 MRR
- **Month 12**: 10,000 users, $20,000+ MRR

---

## Troubleshooting

### Common Issues

**"Repository not found"**
- Check URL is correct
- Ensure repo is public
- Verify branch name

**"Timeout error"**
- Repo might be too large
- Increase timeout in Dockerfile
- Add pagination for large repos

**"Binary not found"**
- Check Dockerfile download step
- Verify binary has execute permissions
- Test locally first

### Getting Help

- **Apify Support**: support@apify.com
- **Community**: https://discord.gg/apify
- **Documentation**: https://docs.apify.com

---

## Quick Commands Reference

```bash
# Login
apify login

# Test locally
npm start

# Deploy to Apify
apify push

# View logs
apify call [YOUR_ACTOR_ID]

# Pull latest version
apify pull

# Create new version
apify push --version-number 1.1.0
```

---

## Success Checklist

- [ ] Apify account created
- [ ] CLI installed and logged in
- [ ] Actor deployed successfully
- [ ] Tested on Apify cloud
- [ ] Published to store
- [ ] Pricing configured
- [ ] Marketing materials ready
- [ ] Launched publicly
- [ ] First paying customer! 🎉

---

**Estimated Time to Deploy**: 2-3 hours
**Estimated Time to First Sale**: 1-2 weeks
**Potential Monthly Revenue**: $1,000-10,000+

Good luck! 🚀
