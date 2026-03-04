# SonarQube Issues Reference File

## Project: personal-portfolio-next
## Generated: 2026-03-04
## Source: Code Analysis + SonarCloud Dashboard

---

## Issue Summary by Severity

| Severity | Count | Rules |
|----------|-------|-------|
| BLOCKER | 2 | css:S4654 |
| CRITICAL | ~10 | S2004, S3776 |
| MAJOR | ~150 | S6582, S6479, S6848, S4666, S6757, S1854 |
| MINOR | ~100 | S1128, S125, S7764, S7773, S7781, S6606, S2933 |

---

## BLOCKER Issues

### css:S4654 - Unknown CSS property

#### Issue 1: font-smoothing (RESOLVED)
- **File:** `src/components/Navbar/Navbar.css`
- **Line:** 213
- **Severity:** BLOCKER
- **Rule:** css:S4654
- **Message:** Unknown property 'font-smoothing'
- **Original Code:**
  ```css
  font-smoothing: antialiased;
  ```
- **Fix Applied:**
  ```css
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  ```
- **Status:** ✅ FIXED in commit 66015b2

#### Issue 2: user-select missing prefixes
- **File:** `src/components/Organisms/Burger/Burger.css`
- **Line:** 211
- **Severity:** BLOCKER
- **Rule:** css:S4654
- **Message:** Unknown property 'user-select' without vendor prefixes
- **Original Code:**
  ```css
  user-select: none;
  ```
- **Fix Applied:**
  ```css
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  ```
- **Status:** ✅ FIXED in commit 66015b2

---

## CRITICAL Issues

### S3776 - Cognitive Complexity

Files with high cognitive complexity to refactor:
- `src/components/ExperienceSection/ExperienceSection.tsx` (multiple useEffect hooks)
- `src/components/Navbar/NavbarMainSection/NavbarMainSection.tsx`
- `src/page/BlogPage/BlogPage.tsx`

### S2004 - Nested Functions in React Hooks

Files with nested functions inside hooks:
- `src/components/ExperienceSection/ExperienceSection.tsx`
- `src/page/BlogPage/BlogPage.tsx`

---

## MAJOR Issues

### S6582 - Non-null Assertions (!)

#### Issue List:
| File | Line | Code | Status |
|------|------|------|--------|
| `src/page/NotePage/NotePage.tsx` | 35 | `content!.reduce` | PENDING |
| `src/page/LogInPage/LogInPage.tsx` | 54-55 | `userNameRef.current!.value` | PENDING |
| `src/page/BlogPage/BlogContent/TableOfContents/TableOfContents.tsx` | 116, 124 | `tocEntries!.forEach` | PENDING |
| `src/page/BlogPage/BlogContent/TableOfContents/TableOfContents.tsx` | 150-159 | `tocPath!.setAttribute` | PENDING |
| `src/page/RegisterPage/RegisterPage.tsx` | 67-71 | `emailRef.current!.value` | PENDING |
| `src/components/ExperienceSection/ExperienceSection.tsx` | 289 | `experienceSectionScrollRef.current!.getBoundingClientRect` | PENDING |
| `src/page/BlogPage/BlogContent/CodeBlock/CodeBlock.tsx` | 25 | `codeBlockRef.current!.style` | PENDING |
| `src/components/Footer/GetIntoTouchFooterSection/GetIntoTouchFooterSection.tsx` | 17-18 | `messageEmailRef.current!.value` | PENDING |
| `src/components/HeroSection/HeroSection.tsx` | 165 | `pixelatedCodingCatRef.current!.style.zIndex` | PENDING |
| `src/components/Navbar/NavbarMainSection/NavbarMainSection.tsx` | 184 | `burgerButton.current!.contains` | PENDING |

**Fixed:**
| File | Line | Code | Status |
|------|------|------|--------|
| `src/components/Image/Image.tsx` | 34 | `defaultProps!.defaultImageId` | ✅ FIXED |
| `src/components/Navbar/LoginButton/LoginButton.tsx` | 17, 20 | `data.user!.email`, `data.user!.image` | ✅ FIXED |

### S6479 - Array Index as Key

No issues found - all map functions use proper unique keys.

### S6848 - Accessibility

No issues found - no div elements with role="button" detected.

### S4666 - Duplicate CSS Selectors

Files to review for duplicate selectors:
- `src/components/Navbar/Navbar.css`
- `src/app/globals.css`
- `src/components/Card/Card.css`

### S6757 - React Hooks in Classes

**File:** `src/components/Organisms/BlackHole/BlackHole.tsx`
- **Status:** ✅ ALREADY COMPLIANT - Particle class is defined outside the component

### S1854 - Unused Assignments

Files to review:
- `src/components/ExperienceSection/ExperienceSection.tsx`
- `src/page/BlogPage/BlogPage.tsx`
- `src/components/HeroSection/HeroSection.tsx`

---

## MINOR Issues

### S1128 - Unused Imports (PARTIALLY RESOLVED)

#### Fixed Issues:
| File | Original Import | Status |
|------|-----------------|--------|
| `src/page/ResumePage/ResumePage.tsx` | `import React from "react"` | ✅ FIXED |
| `src/page/SkeletonPage/SkeletonPage.tsx` | `import React from "react"` | ✅ FIXED |
| `src/app/projects/web-experiments/fractal-hills/page.tsx` | `import React from "react"` | ✅ FIXED |
| `src/components/HeroSection/Interface/IHeroState.tsx` | `import React from "react"` | ✅ FIXED |
| `src/components/Navbar/BurgerMenuIcon/BurgerMenuIcon.tsx` | `import React from "react"` | ✅ FIXED |
| `src/components/Atoms/InlineLink/InlineLink.tsx` | `import React from "react"` | ✅ FIXED |
| `src/components/Atoms/Toggle/Toggle.tsx` | `import React from "react"` | ✅ FIXED (changed to named imports) |
| `src/components/Atoms/SmallCard/SmallCard.tsx` | `import React from "react"` | ✅ FIXED |
| `src/components/Card/InProgressBlock/InProgressBlock.tsx` | `import React from "react"` | ✅ FIXED |
| `src/components/ProgressBar/Progressbar.tsx` | `import React from "react"` | ✅ FIXED |
| `src/components/Gallery/Gallery.tsx` | `import React from "react"` | ✅ FIXED |
| `src/components/TagCloud/TagCloud.tsx` | `import React from "react"` | ✅ FIXED |
| `src/components/BlogPostGraphics/BlogPostGraphics.tsx` | `import React from "react"` | ✅ FIXED |
| `src/components/Retro/Retro.tsx` | `import React from "react"` | ✅ FIXED |
| `src/components/Organisms/ZaOcean/ZaOcean.tsx` | `import React from "react"` | ✅ FIXED |
| `src/page/BlogPage/BlogContent/AuthorDetails/AuthorDetails.tsx` | `import React from "react"` | ✅ FIXED |
| `src/page/BlogPage/BlogContent/BlogNote/BlogNote.tsx` | `import React from "react"` | ✅ FIXED |
| `src/page/BlogPage/BlogContent/BlogWarning/BlogWarning.tsx` | `import React from "react"` | ✅ FIXED |
| `src/page/BlogPage/BlogContent/BuyMeACoffeeButton/BuyMeACoffeeButton.tsx` | `import React from "react"` | ✅ FIXED |
| `src/page/BlogPage/BlogContent/TableOfContents/TableOfContents.tsx` | `import React from "react"` | ✅ FIXED |
| `src/page/BlogPage/BlogContent/SkeletonBlogContent/SkeletonBlogContent.tsx` | `import React from "react"` | ✅ FIXED |
| `src/components/ExperienceSection/ExperienceSectionEvent/ExperienceSectionEvent.tsx` | `import React from "react"` | ✅ FIXED |
| `src/components/Footer/Footer.tsx` | `import React from "react"` | ✅ FIXED |
| `src/components/Navbar/LoginButton/LoginButton.tsx` | `import React from "react"` | ✅ FIXED |
| `src/components/GolfedSierpinski/GolfedSierpinski.tsx` | `import React from "react"` | ✅ FIXED |

#### Pending Issues:
More files may have unused React imports. Run `grep -r "import React from" src/` to find all.

### S125 - Commented Code (RESOLVED)

#### Issue 1: middleware.ts
- **File:** `middleware.ts`
- **Lines:** 3-8
- **Original Code:**
  ```typescript
  // Or like this if you need to do something here.
  // export default auth((req) => {
  //   console.log(req.auth) //  { session: { user: { ... } } }
  // })

  // Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  ```
- **Status:** ✅ FIXED in commit 212736d

### S7764 - Prefer globalThis (PARTIALLY RESOLVED)

#### Fixed Issues:
| File | Original Code | Fix Applied | Status |
|------|---------------|-------------|--------|
| `src/components/FractalHills/FractalHills.tsx` | `window.addEventListener` | `globalThis.addEventListener` | ✅ FIXED |
| `src/hooks/useScrollPosition.tsx` | `window.scrollY`, `window.addEventListener` | `globalThis.scrollY`, `globalThis.addEventListener` | ✅ FIXED |
| `src/components/Utility/ScrollUtility.ts` | `window.innerHeight` | `globalThis.innerHeight` | ✅ FIXED |
| `src/components/Utility/AnimationUtility.ts` | `window.setTimeout` | `globalThis.setTimeout` | ✅ FIXED |
| `src/components/GolfedSierpinski/GolfedSierpinski.tsx` | `window.addEventListener` | `globalThis.addEventListener` | ✅ FIXED |

#### Pending Issues:
More files may use `window` instead of `globalThis`. Run `grep -r "window\." src/` to find all.

### S7773 - Number.parseInt (RESOLVED)

#### Issue 1: BlogPage.tsx
- **File:** `src/page/BlogPage/BlogPage.tsx`
- **Line:** 152
- **Original Code:** `.sort((a, b) => parseInt(b) - parseInt(a))`
- **Fix Applied:** `.sort((a, b) => Number.parseInt(b) - Number.parseInt(a))`
- **Status:** ✅ FIXED in commit 19a2590

### S7781 - Use replaceAll (RESOLVED)

#### Issue 1: MarkdownRendererV2.tsx
- **File:** `src/page/BlogPage/BlogContent/MarkdownRendererV2/MarkdownRendererV2.tsx`
- **Line:** 116
- **Original Code:** `p1.replace(/\*/g, "")`
- **Fix Applied:** `p1.replaceAll("*", "")`
- **Status:** ✅ FIXED in commit 19a2590

### S6606 - Nullish Coalescing

Pending - search for `=== undefined` patterns.

### S2933 - Readonly Properties

Pending - search for static properties that should be readonly.

---

## Files Requiring Further Analysis

The following files need to be checked for remaining issues:

1. `src/components/ExperienceSection/ExperienceSection.tsx` - High complexity, unused assignments
2. `src/page/BlogPage/BlogPage.tsx` - High complexity, unused assignments
3. `src/components/HeroSection/HeroSection.tsx` - Non-null assertions, unused assignments
4. `src/page/BlogPage/BlogContent/TableOfContents/TableOfContents.tsx` - Multiple non-null assertions
5. `src/page/LogInPage/LogInPage.tsx` - Non-null assertions
6. `src/page/RegisterPage/RegisterPage.tsx` - Non-null assertions
7. `src/page/NotePage/NotePage.tsx` - Non-null assertions
8. `src/components/Footer/GetIntoTouchFooterSection/GetIntoTouchFooterSection.tsx` - Non-null assertions
9. `src/components/Navbar/NavbarMainSection/NavbarMainSection.tsx` - Non-null assertions, complexity
10. `src/page/BlogPage/BlogContent/CodeBlock/CodeBlock.tsx` - Non-null assertions

---

## Commit History

| Commit | Message | Issues Fixed |
|--------|---------|--------------|
| 66015b2 | Fix BLOCKER issues - CSS non-standard properties | css:S4654 |
| 52f3fbb | Fix MINOR issues - S1128 Unused imports | S1128 (20+ files) |
| 212736d | Fix MINOR issues - S7764 Prefer globalThis, S125 Commented code | S7764, S125 |
| 19a2590 | Fix MINOR issues - S7773 Number.parseInt, S7781 replaceAll | S7773, S7781 |
| 9391e1a | Fix MAJOR issues - S6582 Non-null assertions | S6582 (2 files) |

---

## Next Steps

1. Fix remaining S6582 (Non-null assertions) in 10+ files
2. Fix S1854 (Unused assignments)
3. Fix S6606 (Nullish coalescing)
4. Fix S2933 (Readonly properties)
5. Address S3776/S2004 (Cognitive complexity) - may require significant refactoring
6. Run final build and lint verification
7. Create feature branch and PR
