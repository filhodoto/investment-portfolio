import { useId, useRef, useState } from 'react'

import { FieldShell } from '@/components/ui/Input/FieldShell'
import { Markdown } from '@/components/ui/Markdown/Markdown'
import { cn } from '@/lib/utils'

export interface MarkdownEditorProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  hint?: string
  error?: string
  rows?: number
  containerClassName?: string
}

type Mode = 'write' | 'preview'

const TOOLBAR_BUTTON_CLASSES =
  'rounded px-2 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100'

/** Markdown notes editor: a small formatting toolbar plus a live preview. */
export function MarkdownEditor({
  label,
  value,
  onChange,
  placeholder,
  hint,
  error,
  rows = 5,
  containerClassName,
}: MarkdownEditorProps) {
  const id = useId()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [mode, setMode] = useState<Mode>('write')

  const restoreSelection = (start: number, end: number) => {
    // Wait for React to write the new value before restoring the selection.
    requestAnimationFrame(() => {
      const textarea = textareaRef.current
      if (!textarea) return
      textarea.focus()
      textarea.setSelectionRange(start, end)
    })
  }

  const wrapSelection = (before: string, after = before, placeholderText = '') => {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = value.slice(start, end) || placeholderText
    const next = `${value.slice(0, start)}${before}${selected}${after}${value.slice(end)}`
    onChange(next)
    restoreSelection(start + before.length, start + before.length + selected.length)
  }

  const prefixLines = (prefix: string) => {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const lineStart = value.lastIndexOf('\n', start - 1) + 1
    const nextBreak = value.indexOf('\n', end)
    const lineEnd = nextBreak === -1 ? value.length : nextBreak
    const block = value.slice(lineStart, lineEnd) || 'List item'
    const formatted = block
      .split('\n')
      .map((line) => `${prefix}${line}`)
      .join('\n')
    const next = `${value.slice(0, lineStart)}${formatted}${value.slice(lineEnd)}`
    onChange(next)
    restoreSelection(lineStart + prefix.length, lineStart + formatted.length)
  }

  const insertLink = () => {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = value.slice(start, end) || 'link text'
    const before = `[${selected}](`
    const next = `${value.slice(0, start)}${before}https://)${value.slice(end)}`
    onChange(next)
    // Select the placeholder URL so it can be typed over immediately.
    restoreSelection(start + before.length, start + before.length + 'https://'.length)
  }

  return (
    <FieldShell
      label={label}
      htmlFor={id}
      hint={hint}
      error={error}
      className={containerClassName}
    >
      <div
        className={cn(
          'overflow-hidden rounded-lg bg-white shadow-xs ring-1 ring-slate-300 ring-inset focus-within:ring-2 focus-within:ring-indigo-600 dark:bg-slate-900 dark:ring-slate-700',
          error && 'ring-rose-500 focus-within:ring-rose-500 dark:ring-rose-500',
        )}
      >
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 px-2 py-1.5 dark:border-slate-800">
          {mode === 'write' && (
            <>
              <button
                type="button"
                title="Bold"
                aria-label="Bold"
                onClick={() => wrapSelection('**', '**', 'bold text')}
                className={cn(TOOLBAR_BUTTON_CLASSES, 'font-bold')}
              >
                B
              </button>
              <button
                type="button"
                title="Italic"
                aria-label="Italic"
                onClick={() => wrapSelection('*', '*', 'italic text')}
                className={cn(TOOLBAR_BUTTON_CLASSES, 'italic')}
              >
                I
              </button>
              <button
                type="button"
                title="Heading"
                aria-label="Heading"
                onClick={() => prefixLines('## ')}
                className={TOOLBAR_BUTTON_CLASSES}
              >
                H2
              </button>
              <button
                type="button"
                title="Bullet list"
                aria-label="Bullet list"
                onClick={() => prefixLines('- ')}
                className={TOOLBAR_BUTTON_CLASSES}
              >
                • List
              </button>
              <button
                type="button"
                title="Numbered list"
                aria-label="Numbered list"
                onClick={() => prefixLines('1. ')}
                className={TOOLBAR_BUTTON_CLASSES}
              >
                1. List
              </button>
              <button
                type="button"
                title="Insert link"
                aria-label="Insert link"
                onClick={insertLink}
                className={TOOLBAR_BUTTON_CLASSES}
              >
                Link
              </button>
              <button
                type="button"
                title="Inline code"
                aria-label="Inline code"
                onClick={() => wrapSelection('`', '`', 'code')}
                className={TOOLBAR_BUTTON_CLASSES}
              >
                {'</>'}
              </button>
            </>
          )}

          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMode('write')}
              aria-pressed={mode === 'write'}
              className={cn(
                TOOLBAR_BUTTON_CLASSES,
                mode === 'write' && 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100',
              )}
            >
              Write
            </button>
            <button
              type="button"
              onClick={() => setMode('preview')}
              aria-pressed={mode === 'preview'}
              className={cn(
                TOOLBAR_BUTTON_CLASSES,
                mode === 'preview' &&
                  'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100',
              )}
            >
              Preview
            </button>
          </div>
        </div>

        {mode === 'write' ? (
          <textarea
            ref={textareaRef}
            id={id}
            rows={rows}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            aria-invalid={Boolean(error)}
            className="block w-full resize-y border-0 bg-transparent px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
          />
        ) : (
          <div className="min-h-24 px-3 py-2">
            {value.trim() ? (
              <Markdown>{value}</Markdown>
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-500">Nothing to preview yet.</p>
            )}
          </div>
        )}
      </div>
    </FieldShell>
  )
}
