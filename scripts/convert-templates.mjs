import fs from 'fs';
import path from 'path';

const TEMPLATES_DIR = path.join(process.cwd(), 'templates');
const OUT_COMPONENTS_DIR = path.join(process.cwd(), 'src', 'components', 'templates');
const OUT_SCHEMAS_DIR = path.join(process.cwd(), 'src', 'lib', 'schemas');

function toPascalCase(str) {
  return str.replace(/(^\w|-\w)/g, (clearAndText) => clearAndText.replace(/-/, '').toUpperCase());
}

function convertStyles(html) {
  return html.replace(/style="([^"]*)"/g, (match, styles) => {
    const reactStyles = styles.split(';').filter(s => s.trim()).map(s => {
      let [key, value] = s.split(':');
      if(!key || !value) return '';
      key = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
      value = value.trim().replace(/"/g, "'");
      return `${key}: "${value}"`;
    }).filter(s => s).join(', ');
    return `style={{ ${reactStyles} }}`;
  });
}

function processHtmlToJsx(html) {
  let bodyContent = html;
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    bodyContent = bodyMatch[1];
  }

  // STRIP OUT SCRIPT TAGS (React doesn't support raw DOM script injection directly this way, and they cause JSX parsing errors)
  let jsx = bodyContent.replace(/<script[\s\S]*?<\/script>/gi, '');

  jsx = jsx
    .replace(/class=/g, 'className=')
    .replace(/for=/g, 'htmlFor=')
    .replace(/colspan=/ig, 'colSpan=')
    .replace(/rowspan=/ig, 'rowSpan=')
    .replace(/cellpadding=/ig, 'cellPadding=')
    .replace(/cellspacing=/ig, 'cellSpacing=')
    .replace(/tabindex=/ig, 'tabIndex=');

  jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');

  jsx = jsx.replace(/<br>/gi, '<br />');
  jsx = jsx.replace(/<hr>/gi, '<hr />');
  jsx = jsx.replace(/<img([^>]*[^\/])>/gi, '<img$1 />');
  jsx = jsx.replace(/<input([^>]*[^\/])>/gi, '<input$1 />');

  // Handle attribute conditionals BEFORE general tags (e.g. {{#isBold}} style="..."{{/isBold}})
  jsx = jsx.replace(/\{\{\#([a-zA-Z0-9_.-]+)\}\}\s*style="([^"]*)"\s*\{\{\/\1\}\}/g, (match, prop, styles) => {
    const reactStyles = styles.split(';').filter(s => s.trim()).map(s => {
      let [key, value] = s.split(':');
      if(!key || !value) return '';
      key = key.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
      value = value.trim().replace(/"/g, "'");
      return `${key}: "${value}"`;
    }).filter(s => s).join(', ');
    return ` style={data?.${prop} ? { ${reactStyles} } : undefined}`;
  });

  // Do mustache interpolations BEFORE style object conversions to avoid style={{ being caught
  jsx = jsx.replace(/\{\{\{\s*([^}]+?)\s*\}\}\}/g, '{data?.$1}');
  jsx = jsx.replace(/\{\{\#([^}]+?)\}\}/g, '{data?.$1 && (<>');
  jsx = jsx.replace(/\{\{\/([^}]+?)\}\}/g, '</>)}');
  jsx = jsx.replace(/\{\{\^([^}]+?)\}\}/g, '{!data?.$1 && (<>');
  jsx = jsx.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (match, p1) => {
    if (p1 === '.') return '{"-"}';
    return `{data?.${p1}}`;
  });

  // Fix attributes that have quotes around interpolations, like src="{data?.logo}" -> src={data?.logo}
  jsx = jsx.replace(/="(\{data\?\.[^\}]+\})"/g, '=$1');

  // Then convert inline styles
  jsx = convertStyles(jsx);

  // Fix arrays like data?.ekler.0 to data?.ekler?.[0]
  jsx = jsx.replace(/data\?\.(.*?)\.0/g, 'data?.$1?.[0]');

  // Inject suppressHydrationWarning to prevent Next.js errors for missing tbody
  jsx = jsx.replace(/<table/gi, '<table suppressHydrationWarning');

  return `<div className="document-template relative bg-white p-8 w-full max-w-[21cm] mx-auto min-h-[29.7cm] shadow-lg border border-slate-200">\n${jsx}\n</div>`;
}

function generateSchemaCode(name, keys, sampleJson) {
  const fields = keys.map(k => `  ${k}: z.any().optional(),`).join('\n');
  return `import { z } from 'zod';\n\nexport const ${name}Schema = z.object({\n${fields}\n}).catchall(z.any());\n\nexport type ${name}Type = z.infer<typeof ${name}Schema>;\n\nexport const default${name}Data: Partial<${name}Type> = ${JSON.stringify(sampleJson, null, 2)};\n`;
}

function generateComponentCode(componentName, schemaName, jsxContent) {
  return `import React from 'react';\nimport { ${schemaName}Type } from '../../../lib/schemas/${schemaName}.schema';\n\ninterface ${componentName}Props {\n  data?: Partial<${schemaName}Type>;\n}\n\nexport function ${componentName}({ data = {} }: ${componentName}Props) {\n  return (\n    ${jsxContent}\n  );\n}\n`;
}

async function run() {
  if (!fs.existsSync(OUT_COMPONENTS_DIR)) fs.mkdirSync(OUT_COMPONENTS_DIR, { recursive: true });
  if (!fs.existsSync(OUT_SCHEMAS_DIR)) fs.mkdirSync(OUT_SCHEMAS_DIR, { recursive: true });

  const categories = fs.readdirSync(TEMPLATES_DIR).filter(f => fs.statSync(path.join(TEMPLATES_DIR, f)).isDirectory());
  
  let totalConverted = 0;
  let registryExports = [];

  for (const category of categories) {
    const categoryPath = path.join(TEMPLATES_DIR, category);
    const catOutDir = path.join(OUT_COMPONENTS_DIR, category);
    if (!fs.existsSync(catOutDir)) fs.mkdirSync(catOutDir, { recursive: true });

    const templates = fs.readdirSync(categoryPath).filter(f => fs.statSync(path.join(categoryPath, f)).isDirectory());

    for (const template of templates) {
      const templatePath = path.join(categoryPath, template);
      const htmlFile = path.join(templatePath, 'index.html');
      const jsonFile = path.join(templatePath, 'index.html.json');

      if (!fs.existsSync(htmlFile)) continue;

      const htmlContent = fs.readFileSync(htmlFile, 'utf8');
      let sampleJson = {};
      let keys = [];

      if (fs.existsSync(jsonFile)) {
        try {
          sampleJson = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));
          keys = Object.keys(sampleJson);
        } catch (e) {
          console.error(`Error parsing JSON for ${template}`);
        }
      } else {
        const matches = [...htmlContent.matchAll(/\{\{\s*([^}]+)\s*\}\}/g)];
        keys = [...new Set(matches.map(m => m[1].replace(/^[#/]/, '')))];
      }

      const componentName = toPascalCase(template);
      const jsx = processHtmlToJsx(htmlContent);
      
      const componentCode = generateComponentCode(componentName, componentName, jsx);
      const schemaCode = generateSchemaCode(componentName, keys, sampleJson);

      fs.writeFileSync(path.join(catOutDir, `${componentName}.tsx`), componentCode);
      fs.writeFileSync(path.join(OUT_SCHEMAS_DIR, `${componentName}.schema.ts`), schemaCode);

      registryExports.push({
        category,
        template,
        componentName,
        importPath: `./${category}/${componentName}`
      });

      console.log(`Converted: ${category}/${template} -> ${componentName}`);
    }
  }

  const indexContent = registryExports.map(r => `export { ${r.componentName} } from '${r.importPath}';`).join('\n') + 
    `\n\nexport const TEMPLATE_REGISTRY = [\n` + 
    registryExports.map(r => `  { id: '${r.template}', name: '${r.componentName}', category: '${r.category}' }`).join(',\n') +
    `\n];\n`;

  fs.writeFileSync(path.join(OUT_COMPONENTS_DIR, 'index.ts'), indexContent);

  console.log(`\n✅ Successfully converted ${totalConverted} templates!`);
}

run().catch(console.error);
