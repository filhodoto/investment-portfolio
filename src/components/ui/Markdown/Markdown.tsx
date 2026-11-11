import ReactMarkdown, { type Components } from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import remarkGfm from 'remark-gfm'

import { cn } from '@/lib/utils'

const COMPONENTS: Components = {
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  ),
}

export interface MarkdownProps {
  children: string
  className?: string
}

/** Renders Markdown notes. Raw HTML is escaped by react-markdown by default. */
export function Markdown({ children, className }: MarkdownProps) {
  return (
    <div className={cn('prose prose-sm max-w-none prose-slate dark:prose-invert', className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]} components={COMPONENTS}>
        {children}
      </ReactMarkdown>
    </div>
  )
}
