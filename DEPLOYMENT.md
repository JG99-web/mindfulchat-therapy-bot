# Deployment Guide for MindfulChat

## Vercel Deployment Steps

### 1. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your `mindfulchat-therapy-bot` repository
5. Configure environment variables (see below)
6. Click "Deploy"

### 2. Environment Variables (Required)
Add these in Vercel Dashboard → Settings → Environment Variables:

```
OPENAI_API_KEY=sk-your-actual-openai-api-key
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX (from Google Analytics)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your-verification-code
NEXT_PUBLIC_SITE_URL=https://mindfulchatai.com
```

### 3. Google Analytics Setup
1. Go to [analytics.google.com](https://analytics.google.com)
2. Create new property for your domain
3. Get your GA4 Measurement ID (G-XXXXXXXXXX)
4. Add it to Vercel environment variables as `NEXT_PUBLIC_GA_ID`

### 4. Google Search Console Setup
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add your Vercel domain as a property
3. Use the "HTML tag" verification method
4. Copy the verification code from the meta tag
5. Add it to Vercel as `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
6. Submit your sitemap: `https://yourdomain.vercel.app/sitemap.xml`

### 5. Post-Deployment Checklist
- [ ] Test OpenAI API functionality
- [ ] Verify Google Analytics tracking
- [ ] Confirm Google Search Console verification
- [ ] Test all pages and features
- [ ] Check mobile responsiveness
- [ ] Verify PWA functionality

### 6. Custom Domain (Optional)
1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS settings as instructed
4. Update `NEXT_PUBLIC_SITE_URL` environment variable

## Monitoring & Maintenance
- Monitor Google Analytics for user behavior
- Check Google Search Console for SEO performance
- Monitor Vercel Analytics for performance metrics
- Keep OpenAI API usage within limits
