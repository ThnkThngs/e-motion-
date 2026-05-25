# Stitch Agent Skills Integration — vlaude Workflow

## Overview

Four Stitch Agent Skills have been installed globally to extend Claude Code's design and development capabilities:

1. **stitch-design** — High-fidelity UI design generation and prompt enhancement
2. **react:components** — Convert Stitch designs into modular React components
3. **design-md** — Synthesize design systems into DESIGN.md "source of truth" documents
4. **remotion** — Create video walkthroughs from Stitch design screens

**Installation location:** `~/.agents/skills/`  
**Repository:** https://github.com/google-labs-code/stitch-skills

---

## Skill Invocation

Stitch skills are invoked via slash commands from Claude Code:

```
/stitch-design       # Design UI screens, enhance design prompts
/react:components    # Convert Stitch designs to React
/design-md           # Document design systems
/remotion            # Create video walkthroughs
```

Each skill is a specialized agent that extends Claude's capabilities in specific domains.

---

## Skill Descriptions & Use Cases

### 1. **stitch-design** — High-Fidelity UI Design

**Purpose:** Generate high-fidelity, consistent UI designs using Stitch MCP Server. Handles prompt enhancement, design system synthesis, and screen generation/editing.

**Key Responsibilities:**
- Transform rough intent into structured design prompts
- Analyze existing designs to create `.stitch/DESIGN.md` "source of truth"
- Route requests to specialized generation or editing workflows
- Ensure visual consistency across all new screens
- Download generated HTML and screenshots

**Primary Workflows:**
- `text-to-design`: Generate new screens from descriptions
- `edit-design`: Edit existing Stitch screens
- `generate-design-md`: Create a design system document

**Use Cases for vlaude:**
- Design new Warisan landing page variations
- Create additional Heritage template previews
- Design marketing assets (social media graphics, email headers)
- Document the Warisan design system in a shareable format

**Example:**
```
/stitch-design

User: "Create a new card layout for the Heritage templates showcase 
featuring the Songket Riau palette (#c9a24e gold, #1a2040 indigo). 
Use glassmorphism effects with ornamental corner patterns."
```

---

### 2. **react:components** — Design to React Code

**Purpose:** Convert Stitch designs into modular, production-ready React components.

**Key Workflows:**
1. Retrieve design metadata from Stitch MCP
2. Download HTML and screenshots
3. Extract component structure and styling
4. Generate clean, typed React components
5. Validate output against architecture checklist

**Architectural Rules:**
- Modular components (separate files, avoid monoliths)
- Logic isolation (custom hooks in `src/hooks/`)
- Data decoupling (static text/URLs in `src/data/mockData.ts`)
- Type safety (Readonly TypeScript interfaces for all props)
- Theme mapping (extract Tailwind config, sync with design tokens)

**Use Cases for vlaude:**
- Convert Stitch-designed components to React
- Generate component libraries from design mockups
- Ensure TypeScript compliance and proper prop typing
- Extract and normalize Tailwind configuration from designs

**Example:**
```
/react:components

User: "Convert the Warisan Hero section from my Stitch project 
into a React component that integrates with the existing vlaude 
component structure."
```

---

### 3. **design-md** — Design System Documentation

**Purpose:** Analyze Stitch projects and synthesize design systems into structured DESIGN.md files that serve as prompting "source of truth."

**Analysis Steps:**
1. Retrieve project metadata from Stitch
2. Extract color palettes with hex codes
3. Document typography rules and usage
4. Describe component styling patterns
5. Explain layout and whitespace principles

**Output Format:**
- Visual theme and atmosphere (mood, aesthetic)
- Color palette with semantic names and hex codes
- Typography rules (font families, weights, spacing)
- Component styling patterns (buttons, cards, inputs)
- Layout principles and grid system

**Use Cases for vlaude:**
- Document the Warisan design system officially
- Create a DESIGN.md that guides future design work
- Ensure consistency across all Warisan variations
- Share design guidelines with stakeholders

**Example:**
```
/design-md

User: "Analyze my Warisan landing page design and generate a 
DESIGN.md file that documents the color palette, typography, 
component patterns, and layout principles so future designs 
stay consistent."
```

---

### 4. **remotion** — Video Walkthroughs

**Purpose:** Create professional walkthrough videos from Stitch design screens using Remotion.

**Video Features:**
- Screen slides with zoom animations
- Smooth fade/slide transitions
- Text overlays and contextual callouts
- Progress indicators
- Interactive hotspot animations

**Workflow:**
1. Retrieve screens from Stitch project
2. Download screenshots and metadata
3. Create Remotion composition with components
4. Configure transitions and animations
5. Render final video (MP4, WebM)

**Use Cases for vlaude:**
- Create walkthrough videos of the Warisan builder interface
- Showcase Heritage template features
- Generate marketing demo videos
- Document user flows visually

**Example:**
```
/remotion

User: "Create a walkthrough video showing the Warisan card builder 
form in action — from template selection through preview to 
publishing. Include smooth transitions and highlight key features."
```

---

## Integration with vlaude Workflow

### Design System Workflow

**Scenario:** Extending the Warisan design system

```
1. Design in Stitch (/stitch-design)
   └─ Create new section variations respecting Warisan palette

2. Document System (/design-md)
   └─ Generate DESIGN.md for consistency guidance

3. Convert to React (/react:components)
   └─ Transform designs into production-ready components

4. Integrate with vlaude
   └─ Import into src/components/warisan/
   └─ Update TypeScript types
   └─ Connect to i18n system
   └─ Test with existing sections
```

### Component Generation Workflow

**Scenario:** Converting a new design mockup to React

```
1. Start with Stitch design (URL or project ID)
2. Run /react:components
3. Extract:
   └─ Component tree structure
   └─ Tailwind configuration
   └─ Typography and spacing tokens
4. Generates:
   └─ modular components (one file per component)
   └─ src/data/mockData.ts (static content)
   └─ src/hooks/ (custom logic)
5. Validates:
   └─ TypeScript compliance
   └─ Architecture checklist
   └─ Component modularity
```

### Video Marketing Workflow

**Scenario:** Creating a demo video of the Warisan builder

```
1. Stitch screens of builder UI (/stitch-design)
2. Retrieve screens (/remotion)
3. Create composition:
   └─ Screen slides with zoom
   └─ Labeled features
   └─ Call-to-action overlays
4. Render video
5. Use in:
   └─ Landing page hero
   └─ Email campaigns
   └─ Social media
```

---

## Best Practices

### When Using stitch-design

- **Start with reference:** Provide color hex codes and component examples
- **Be specific:** Use design terminology (glassmorphism, brutalism, minimalism)
- **Iterate smartly:** Use `edit-design` for tweaks instead of full regeneration
- **Document atmosphere:** Describe the intended mood and user experience

### When Using react:components

- **Modular thinking:** Design for reusability and single responsibility
- **Type safety first:** Always define `SomeComponentProps` interfaces
- **Extract data:** Keep static content in `mockData.ts`, not in components
- **Validate early:** Run `npm run validate` before integrating

### When Using design-md

- **Semantic naming:** Use natural language + hex codes (not just "blue")
- **Document rationale:** Explain why each design decision exists
- **Consistency focus:** Make DESIGN.md the source of truth for future work
- **Update regularly:** Refresh as design system evolves

### When Using remotion

- **Preview in Studio:** Always test transitions before final render
- **Aspect ratio:** Match video dimensions to target platform (YouTube, social, etc.)
- **Sync audio:** If using voiceover, time text overlays to match speech
- **Optimize assets:** Use compressed images; consider codec selection

---

## File Locations

**Installed skills:**
```
~/.agents/skills/
├── stitch-design/
├── react-components/
├── design-md/
└── remotion/
```

**vlaude integration:**
```
vlaude/.claude/skills/
└── STITCH_INTEGRATION.md (this file)
```

**Generated artifacts:**
```
vlaude/
├── .stitch/
│   ├── DESIGN.md (design system source of truth)
│   └── designs/ (downloaded Stitch designs)
│       ├── hero-section.html
│       └── hero-section.png
├── src/
│   ├── components/warisan/ (generated React components)
│   ├── data/mockData.ts (static content from designs)
│   └── hooks/ (custom logic)
└── video/ (Remotion walkthrough projects)
    └── vlaude-builder-walkthrough/
        └── src/compositions/
```

---

## Commands Reference

### Stitch Design
```bash
# View available Stitch MCP tools
list_tools | grep stitch

# Invoke the design skill
/stitch-design "Create a hero section for Warisan Heritage templates showcase"
```

### React Components
```bash
# Validate generated components
npm run validate src/components/warisan/NewComponent.tsx

# Start dev server to preview
npm run dev
```

### Design MD
```bash
# Generate design system documentation
/design-md "Analyze my Warisan design and create DESIGN.md"

# Result: .stitch/DESIGN.md (shared design source of truth)
```

### Remotion
```bash
# Start Remotion Studio for preview
cd video && npm run dev

# Render final video
npx remotion render WalkthroughComposition output.mp4
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **Stitch MCP not found** | Ensure MCP server is running; check with `list_tools` for `stitch:` prefix |
| **React component validation fails** | Check TypeScript interfaces match `Readonly` pattern; review architecture checklist |
| **Design MD too verbose** | Focus on 5-6 key colors, describe fonts simply, limit components to core patterns |
| **Remotion render is slow** | Reduce resolution; use `--concurrency` flag; compress assets first |
| **Component styles don't match design** | Extract Tailwind config from Stitch HTML; sync with `tailwind.config.js` |

---

## Next Steps

1. **Explore stitch-design** — Create a new Warisan section variation
2. **Document the system** — Generate `.stitch/DESIGN.md` for Warisan
3. **Convert to React** — Turn Stitch designs into typed components
4. **Create demo video** — Build a Remotion walkthrough of the builder

---

## Resources

- **Stitch MCP Repository:** https://github.com/google-labs-code/stitch-skills
- **Stitch Prompting Guide:** https://stitch.withgoogle.com/docs/learn/prompting/
- **Remotion Documentation:** https://www.remotion.dev/docs/
- **React Best Practices:** Available at `/skills/vercel-plugin:react-best-practices`
