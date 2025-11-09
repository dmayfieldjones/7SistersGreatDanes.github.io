# SEO Improvement Plan for 7Sisters Great Danes

## Critical Issues (High Priority)

### 1. Domain Consistency ✅ FIXED
- **Issue**: Mixed domains across the site (`mayfieldjones.com`, `dmayfieldjones.github.io`, `7sistersgreatdanes.com`)
- **Impact**: Hurts SEO, confuses search engines about canonical URLs
- **Fix**: Standardize all URLs to use `https://7sistersgreatdanes.com`
- **Files to update**: 
  - `app/sitemap.ts`
  - `app/robots.ts`
  - `app/schema.tsx`
  - All page metadata files (canonical URLs)
  - Blog post schema

### 2. Sitemap Completeness ✅ FIXED
- **Issue**: Missing important pages (Farm, archive, blog posts, litter pages)
- **Impact**: Search engines don't discover all pages
- **Fix**: Add all pages to sitemap with appropriate priorities
- **Priority levels**:
  - Homepage: 1.0
  - Main pages (About, Great Danes, Litters): 0.8-0.9
  - Secondary pages (Farm, Philosophy, Resources): 0.7-0.8
  - Blog archive: 0.7
  - Individual blog posts: 0.6
  - Contact: 0.5

### 3. LocalBusiness Schema Issues ✅ FIXED
- **Issue**: 
  - Wrong domain (`dmayfieldjones.github.io` instead of `7sistersgreatdanes.com`)
  - Telephone field contains email address
- **Impact**: Schema validation errors, poor local SEO
- **Fix**: Update domain and fix telephone field (remove if no phone number)

### 4. FAQPage Schema ✅ ADDED
- **Issue**: Common Questions page doesn't have FAQPage structured data
- **Impact**: Missed opportunity for rich snippets in search results
- **Fix**: Add FAQPage schema with all questions/answers

### 5. Blog Post Schema ✅ FIXED
- **Issue**: Blog posts use wrong domain in schema
- **Impact**: Articles not properly indexed
- **Fix**: Update Article schema URLs to use correct domain

## Medium Priority Improvements

### 6. Breadcrumbs
- **Issue**: No breadcrumb navigation or schema
- **Impact**: Poor UX and missed SEO opportunity
- **Fix**: Add breadcrumb navigation with BreadcrumbList schema
- **Implementation**: Add to layout or individual pages

### 7. Image Optimization
- **Issue**: Missing explicit width/height attributes
- **Impact**: Cumulative Layout Shift (CLS) affects Core Web Vitals
- **Fix**: Add width/height to all images (especially carousel and gallery images)
- **Status**: Partially done (some images have dimensions)

### 8. Internal Linking
- **Issue**: Could be improved with more contextual links
- **Impact**: Better page authority distribution
- **Fix**: Add more internal links in content (e.g., link to related articles, services)

### 9. Open Graph Images
- **Issue**: Some pages use generic or missing OG images
- **Impact**: Poor social media sharing appearance
- **Fix**: Add specific, high-quality OG images for each page (1200x630px recommended)

### 10. Meta Descriptions
- **Issue**: Some descriptions could be more compelling
- **Impact**: Lower click-through rates from search results
- **Fix**: Write unique, compelling meta descriptions (150-160 characters) for each page

## Lower Priority Improvements

### 11. Content Optimization
- Add more location-specific keywords naturally
- Expand content with more detailed information
- Add more FAQ content based on common searches

### 12. Performance
- ✅ Already optimized with image preloading
- Consider lazy loading for below-fold content
- Optimize font loading

### 13. Mobile Optimization
- ✅ Already responsive
- Verify all interactive elements work on mobile
- Test touch targets

### 14. Accessibility
- Ensure all images have descriptive alt text
- Verify keyboard navigation
- Check color contrast ratios

### 15. Analytics & Monitoring
- ✅ Google Analytics already implemented
- Consider adding Google Search Console verification
- Monitor Core Web Vitals
- Track keyword rankings

## Implementation Priority

1. **Phase 1 (Critical)**: Fix domain consistency, sitemap, and schema issues
2. **Phase 2 (High Impact)**: Add FAQPage schema, improve blog post schema
3. **Phase 3 (Medium Impact)**: Add breadcrumbs, improve internal linking
4. **Phase 4 (Polish)**: Optimize images, improve meta descriptions, add OG images

## Notes

- All changes should maintain backward compatibility
- Test all changes in staging before deploying
- Monitor search console for any errors after deployment
- Keep schema markup validated using Google's Rich Results Test

