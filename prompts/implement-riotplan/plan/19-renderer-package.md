# Step 19: Renderer Package

## Objective

Create `@riotprompt/riotplan-renderer` package for generating PDF, HTML, and DOCX outputs from plans.

## Background

From RIOTPLAN_ANALYSIS.md (R20):

> Plans need to be shared, but different audiences need different views.

Two rendering modes:
- `--full`: Everything—feedback, history, evidence, changelog
- `--current` (default): Just the plan as it is now, clean and focused

## Tasks

### 1. Create Package Structure

```
riotplan-renderer/
├── src/
│   ├── index.ts
│   ├── types.ts
│   ├── markdown/
│   │   └── generator.ts      # Generate single markdown
│   ├── html/
│   │   ├── generator.ts      # Generate HTML
│   │   └── templates/
│   │       ├── default.html
│   │       └── styles.css
│   ├── pdf/
│   │   └── generator.ts      # Generate PDF (via HTML)
│   └── docx/
│       └── generator.ts      # Generate DOCX
├── package.json
└── tsconfig.json
```

### 2. Define Render Options

```typescript
export interface RenderOptions {
  /** Output format */
  format: 'markdown' | 'html' | 'pdf' | 'docx';
  
  /** Rendering mode */
  mode: 'full' | 'current';
  
  /** Include specific sections */
  include?: ('feedback' | 'evidence' | 'history' | 'steps')[];
  
  /** Exclude specific sections */
  exclude?: string[];
  
  /** Render at specific version */
  version?: string;
  
  /** Custom template */
  template?: string;
  
  /** Output path (if not stdout) */
  output?: string;
}

export interface RenderResult {
  /** Rendered content */
  content: string | Buffer;
  
  /** Format */
  format: string;
  
  /** Path if written to file */
  path?: string;
}
```

### 3. Implement Markdown Generator

```typescript
export async function renderMarkdown(
  plan: Plan,
  options: RenderOptions
): Promise<string> {
  let content = '';
  
  // Title
  content += `# ${plan.metadata.name}\n\n`;
  
  // Summary
  if (plan.files.summary) {
    const summary = await readFile(
      join(plan.metadata.path, plan.files.summary), 
      'utf-8'
    );
    content += summary + '\n\n';
  }
  
  // Status (if current mode)
  if (options.mode === 'current') {
    content += generateStatusSection(plan);
  }
  
  // Steps
  content += '## Steps\n\n';
  for (const step of plan.steps) {
    content += `### Step ${step.number}: ${step.title}\n\n`;
    const stepContent = await readFile(step.filePath, 'utf-8');
    content += stepContent + '\n\n';
  }
  
  // Feedback (if full mode)
  if (options.mode === 'full' && plan.feedback) {
    content += generateFeedbackSection(plan.feedback);
  }
  
  // Evidence (if full mode)
  if (options.mode === 'full' && plan.evidence) {
    content += generateEvidenceSection(plan.evidence);
  }
  
  return content;
}
```

### 4. Implement HTML Generator

```typescript
export async function renderHtml(
  plan: Plan,
  options: RenderOptions
): Promise<string> {
  const markdown = await renderMarkdown(plan, options);
  const htmlContent = marked.parse(markdown);
  
  const template = await loadTemplate(options.template || 'default');
  
  return template
    .replace('{{title}}', plan.metadata.name)
    .replace('{{content}}', htmlContent)
    .replace('{{styles}}', await loadStyles());
}
```

### 5. Implement PDF Generator

```typescript
// Using puppeteer for PDF generation
export async function renderPdf(
  plan: Plan,
  options: RenderOptions
): Promise<Buffer> {
  const html = await renderHtml(plan, options);
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  
  const pdf = await page.pdf({
    format: 'A4',
    margin: { top: '1in', bottom: '1in', left: '1in', right: '1in' }
  });
  
  await browser.close();
  return pdf;
}
```

### 6. Implement DOCX Generator

```typescript
// Using docx package
export async function renderDocx(
  plan: Plan,
  options: RenderOptions
): Promise<Buffer> {
  const markdown = await renderMarkdown(plan, options);
  
  // Convert markdown to docx elements
  const doc = new Document({
    sections: [{
      children: markdownToDocxElements(markdown)
    }]
  });
  
  return Packer.toBuffer(doc);
}
```

### 7. Main Render Function

```typescript
export async function render(
  plan: Plan,
  options: RenderOptions
): Promise<RenderResult> {
  let content: string | Buffer;
  
  switch (options.format) {
    case 'markdown':
      content = await renderMarkdown(plan, options);
      break;
    case 'html':
      content = await renderHtml(plan, options);
      break;
    case 'pdf':
      content = await renderPdf(plan, options);
      break;
    case 'docx':
      content = await renderDocx(plan, options);
      break;
  }
  
  // Write to file if output specified
  if (options.output) {
    await writeFile(options.output, content);
  }
  
  return { content, format: options.format, path: options.output };
}
```

## Acceptance Criteria

- [ ] Package created with correct structure
- [ ] Markdown rendering works
- [ ] HTML rendering with styling works
- [ ] PDF generation works
- [ ] DOCX generation works
- [ ] Both `full` and `current` modes work
- [ ] **`npm run precommit` passes** ← Definition of Done

## Files Changed

- `riotplan-renderer/` - New package (all files)

## Dependencies

- Step 02 (Plan Loading)
- Step 04 (Feedback Capture)

## Notes

- PDF requires puppeteer (large dependency)
- Consider making PDF/DOCX optional
- Templates should be customizable

