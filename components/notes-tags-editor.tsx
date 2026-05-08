'use client'

import { useRef, useState, useTransition } from 'react'

import { X } from 'lucide-react'

import { addTag, removeTag, saveNote } from '@/actions/notes-tags'

interface Tag {
  id: string
  label: string
}

interface Props {
  recordingId: string
  initialNote: string
  initialTags: Tag[]
}

export function NoteTagsEditor({ recordingId, initialNote, initialTags }: Props) {
  const [note, setNote] = useState(initialNote)
  const [tags, setTags] = useState<Tag[]>(initialTags)
  const [tagInput, setTagInput] = useState('')
  const [noteSaved, setNoteSaved] = useState(false)
  const [, startTransition] = useTransition()
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleNoteChange(val: string) {
    setNote(val)
    setNoteSaved(false)
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(() => {
      startTransition(async () => {
        await saveNote(recordingId, val)
        setNoteSaved(true)
        setTimeout(() => setNoteSaved(false), 2500)
      })
    }, 800)
  }

  function handleAddTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return
    e.preventDefault()
    const label = tagInput.trim()
    if (!label || tags.some((t) => t.label === label)) return
    const tempId = crypto.randomUUID()
    setTags((prev) => [...prev, { id: tempId, label }])
    setTagInput('')
    startTransition(async () => {
      await addTag(recordingId, label)
    })
  }

  function handleRemoveTag(tag: Tag) {
    setTags((prev) => prev.filter((t) => t.id !== tag.id))
    startTransition(async () => {
      await removeTag(tag.id, recordingId)
    })
  }

  return (
    <div className="space-y-4">
      {/* Tags */}
      <div>
        <label className="text-muted-foreground mb-2 block text-xs font-medium uppercase tracking-wide">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="bg-muted flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
            >
              {tag.label}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-muted-foreground hover:text-foreground ml-0.5"
                aria-label={`Tag ${tag.label} entfernen`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <div className="flex items-center gap-1">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Tag hinzufügen…"
              className="border-input bg-background text-foreground placeholder:text-muted-foreground rounded-full border px-3 py-1 text-xs outline-none focus:ring-2"
            />
            {tagInput && (
              <span className="text-muted-foreground text-xs">↵</span>
            )}
          </div>
        </div>
      </div>

      {/* Note */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
            Notiz
          </label>
          {noteSaved && (
            <span className="text-muted-foreground text-xs">Gespeichert ✓</span>
          )}
        </div>
        <textarea
          rows={3}
          value={note}
          onChange={(e) => handleNoteChange(e.target.value)}
          placeholder="Notizen zur Aufnahme…"
          className="border-input bg-background text-foreground placeholder:text-muted-foreground w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
        />
      </div>
    </div>
  )
}
