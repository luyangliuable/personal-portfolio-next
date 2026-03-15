## Design Context

### Users
- **Primary audience:** Visitors to personal blog content - casual readers exploring random blog posts
- **Context:** Browsing personal content, looking for interesting reads, exploring the author's personality and thoughts
- **Job to be done:** Find engaging content, understand the author's perspective, enjoy the reading experience
- **Emotional goals:** Delight, curiosity, engagement - the interface should feel like an adventure to explore

### Brand Personality
**Bold, Creative, Playful**

The portfolio should feel like stepping into someone's creative mind - confident without being arrogant, expressive without being chaotic. It should surprise and delight visitors while remaining functional.

**Voice & Tone:**
- Conversational but articulate
- Witty without being try-hard
- Personal and authentic
- Inviting exploration

### Aesthetic Direction
**Visual Tone:** Creative/Agency style inspired by Awwwards winners - experimental layouts, distinctive interactions, memorable moments

**Theme:** Dark mode primary with the existing pastel accent palette:
- Background: #0d0d0d (dark mode black)
- Accents: #92d7a6 (green), #85a9c6 (blue), #e3b88f (orange), #cbf4f9 (cyan)
- Typography: Keep M1M Light and Aileron for headings, Fira Code for code

**Anti-References (what to avoid):**
- Corporate/bland aesthetics
- Overly minimal designs that feel empty
- Cluttered/busy layouts
- Generic trendy patterns (overused glassmorphism, same gradients everyone uses)

### Design Principles

1. **Bold First Impressions** - The hero and landing experience should immediately communicate personality. Don't be afraid of strong visual statements that make visitors pause and smile.

2. **Playful Interactions** - Micro-interactions should surprise and delight. Animations should feel alive and responsive, never robotic or purely functional.

3. **Content as King, but Make it Fun** - Blog content should be highly readable but the container should have character. The reading experience itself can be an experience.

4. **Controlled Chaos** - Creative layouts that feel dynamic but never overwhelming. There's a difference between "busy with purpose" and "cluttered."

5. **Respect the User** - WCAG AA compliance and reduced motion support are non-negotiable. Creativity shouldn't come at the cost of accessibility.

6. **Memorable Moments** - Every page should have at least one "wow" moment - something that makes visitors remember this site and want to return.

### Technical Notes
- Next.js 14 with App Router
- Tailwind CSS for styling
- GSAP for advanced animations
- React 18 with TypeScript
- Custom fonts: M1M Light (body), Aileron (headings), Fira Code (monospace)
- Existing interactive elements: Coding cat hero, bento grids, card hover effects
