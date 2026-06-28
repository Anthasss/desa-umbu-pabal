---
name: Village Heritage
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#414844'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#717973'
  outline-variant: '#c1c8c2'
  surface-tint: '#3f6653'
  primary: '#012d1d'
  on-primary: '#ffffff'
  primary-container: '#1b4332'
  on-primary-container: '#86af99'
  inverse-primary: '#a5d0b9'
  secondary: '#006878'
  on-secondary: '#ffffff'
  secondary-container: '#69e5ff'
  on-secondary-container: '#006575'
  tertiary: '#3b1f00'
  on-tertiary: '#ffffff'
  tertiary-container: '#56340e'
  on-tertiary-container: '#cd9d6d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c1ecd4'
  primary-fixed-dim: '#a5d0b9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#274e3d'
  secondary-fixed: '#a7edff'
  secondary-fixed-dim: '#58d6f1'
  on-secondary-fixed: '#001f25'
  on-secondary-fixed-variant: '#004e5b'
  tertiary-fixed: '#ffdcbd'
  tertiary-fixed-dim: '#f0bd8b'
  on-tertiary-fixed: '#2c1600'
  on-tertiary-fixed-variant: '#623f18'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  headline-xl:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1200px
  gutter: 24px
  section-padding-desktop: 80px
  section-padding-mobile: 40px
---

## Brand & Style
The design system is anchored in the concept of "Digital Stewardship"—merging traditional community values with modern, efficient governance. The personality is professional, welcoming, and grounded, designed to evoke a sense of stability and growth for residents, visitors, and investors alike.

The visual style follows a **Modern / Corporate** aesthetic with **Minimalist** influences. It prioritizes clarity and ease of navigation, using generous whitespace to ensure that vital village information is never overwhelmed by visual noise. The UI feels established yet progressive, using organic color tones to reflect the village’s natural environment while maintaining a sharp, clean digital structure.

## Colors
The palette is inspired by the landscape and administrative clarity.
- **Primary (Deep Forest Green):** Used for headers, primary navigation, and core branding elements to signify agriculture, growth, and the natural environment.
- **Secondary (Sky Blue):** Used for informational accents, links, and elements related to water or public services, providing a fresh contrast to the deep green.
- **Accent (Warm Gold):** Reserved for high-priority Call-to-Actions (CTAs), buttons, and highlights to ensure they stand out against the organic primary tones.
- **Backgrounds:** A mix of off-white and very light gray is used to define different content sections without the harshness of pure white, enhancing readability.

## Typography
The typography system balances the authoritative presence of **Montserrat** for headings with the high legibility of **Inter** for body text. 
- **Headings:** Use Montserrat in Bold or Semi-Bold weights. For page titles (XL), use a slight negative letter-spacing to create a tighter, more professional look.
- **Body:** Inter is the workhorse for all long-form content, village news, and administrative details. Maintain a generous line-height (1.6) to ensure accessibility for all age groups within the community.
- **Labels:** Small labels and metadata should use Inter Bold in uppercase to distinguish them clearly from body text.

## Layout & Spacing
This design system utilizes a **Fixed Grid** model for desktop to provide a structured, organized feel that mirrors a formal profile.
- **Grid:** A 12-column grid with 24px gutters.
- **Margins:** Desktop margins are flexible to center the 1200px container; mobile margins are set to 20px.
- **Rhythm:** Spacing follows an 8px base unit. Use larger gaps (80px+) between major sections (e.g., Hero to News Feed) to emphasize the minimalist, clean aesthetic.
- **Adaptation:** On mobile, components should stack vertically, and padding should be reduced to 40px between sections to maintain momentum while scrolling.

## Elevation & Depth
To maintain a clean and modern look, the design system avoids heavy, dark shadows.
- **Tonal Layers:** Depth is primarily created through subtle shifts in background color (e.g., a light gray section placed against an off-white page background).
- **Soft Ambient Shadows:** For interactive cards (like News or Announcements), use a very soft, diffused shadow (0px 4px 20px rgba(0, 0, 0, 0.05)) to suggest "lift" without appearing heavy.
- **Outlines:** Use thin, low-contrast borders (1px solid #E9ECEF) for form inputs and static containers to maintain structure without adding visual weight.

## Shapes
The shape language is consistently **Rounded**, promoting an approachable and community-friendly atmosphere.
- **Core Elements:** Buttons, input fields, and small tags use a 0.5rem (8px) radius.
- **Large Containers:** Cards, feature images, and informational modules use a 1rem (16px) radius to feel more modern and prominent.
- **Icons:** Should follow a soft-cornered or rounded style to match the UI elements.

## Components
- **Buttons:** The primary CTA uses the Warm Gold background with dark text for maximum contrast. Secondary buttons use the Deep Forest Green with white text. Ghost buttons use a Green outline.
- **Cards:** Used for news, village gallery items, and staff profiles. They should feature a 16px radius, a subtle 1px border, and a soft shadow on hover to indicate interactivity.
- **Input Fields:** Large, clean fields with 8px rounded corners. Use a light gray background and a primary green border only when focused.
- **Chips/Badges:** Used for category tags (e.g., "News," "Announcement," "Event"). These should be semi-transparent versions of the Secondary Blue or Primary Green with bold, centered text.
- **Lists:** Village statistics or service lists should use custom iconography in Deep Forest Green to guide the eye.
- **Navigation:** A clean top-bar navigation with a prominent "Contact Us" or "Emergency" button in the Accent color.