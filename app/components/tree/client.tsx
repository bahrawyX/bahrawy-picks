'use client'

import { Tree, type TreeNode } from '@/components/bahrawy/tree'
import { CodeBlock } from '@/components/showcase/code-block'
import { DocsPage, DocsSection, DemoCard } from '@/components/showcase/docs-page'

const DATA: TreeNode[] = [
  {
    name: 'src',
    children: [
      {
        name: 'components',
        children: [
          {
            name: 'ui',
            children: [
              { name: 'button.tsx', type: 'file' },
              { name: 'card.tsx', type: 'file' },
              { name: 'dialog.tsx', type: 'file' },
            ],
          },
          { name: 'layout', children: [{ name: 'header.tsx', type: 'file' }] },
        ],
      },
      { name: 'lib', children: [{ name: 'utils.ts', type: 'file' }] },
    ],
  },
  { name: 'public', children: [{ name: 'favicon.ico', type: 'file' }] },
  { name: 'package.json', type: 'file' },
  { name: 'tsconfig.json', type: 'file' },
  { name: 'README.md', type: 'file' },
]

const SNIPPET = `import { Tree } from '@/components/bahrawy/tree'

<Tree
  data={[
    { name: 'src', children: [
      { name: 'components', children: [
        { name: 'ui', children: [
          { name: 'button.tsx', type: 'file' },
          { name: 'card.tsx', type: 'file' },
        ]},
      ]},
    ]},
    { name: 'package.json', type: 'file' },
  ]}
  defaultExpanded={['src', 'src/components']}
  onSelect={(node, path) => console.log(path.join('/'))}
/>`

export default function TreeDocs() {
  return (
    <DocsPage
      title="Tree"
      slug="tree"
      description="A file-tree view. Folder rows have a rotating chevron and a Folder/FolderOpen icon, file rows just the icon. Click a folder to expand or collapse with a spring-eased animation. Gutter guide lines run down the indent so the hierarchy reads at a glance."
      category="65 · data"
    >
      <DocsSection title="Live demo">
        <DemoCard className="min-h-[420px] items-start py-8">
          <div className="w-full max-w-md">
            <Tree
              data={DATA}
              defaultExpanded={['src', 'src/components', 'src/components/ui']}
              onSelect={(node, path) => console.log('select:', path.join('/'))}
            />
          </div>
        </DemoCard>
      </DocsSection>

      <DocsSection title="Usage">
        <CodeBlock code={SNIPPET} language="tsx" />
      </DocsSection>

      <DocsSection title="Props">
        <ul className="grid gap-2 sm:grid-cols-2">
          {[
            ['data', 'Recursive TreeNode[]. Folders have children; files have type: "file".'],
            ['defaultExpanded', 'Array of node ids (or "/"-joined paths) to start open.'],
            ['onSelect', '(node, path) => void — fires when a leaf is clicked.'],
            ['hideGuides', 'Hide the gutter guide lines. Default false.'],
            ['className', 'Extra classes on the outer container.'],
          ].map(([n, b]) => (
            <li key={n} className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
              <code className="font-mono text-xs text-white">{n}</code>
              <p className="mt-1 text-xs text-white/60">{b}</p>
            </li>
          ))}
        </ul>
      </DocsSection>

      <DocsSection title="Dependencies">
        <div className="flex flex-wrap gap-2">
          {['framer-motion', 'lucide-react'].map((d) => (
            <code key={d} className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 font-mono text-xs text-white/80">
              {d}
            </code>
          ))}
        </div>
      </DocsSection>
    </DocsPage>
  )
}
