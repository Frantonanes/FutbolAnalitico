import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'

import './RichTextEditor.css'

type Media = {
  _id: string
  name?: string
  url: string
}

type Props = {
  value: string
  onChange: (value: string) => void
  mediaOptions: Media[]
}

export default function RichTextEditor({
  value,
  onChange,
  mediaOptions
}: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false
      })
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    }
  })

  if (!editor) return null

  function addImage(url: string) {
    if (!url) return
    editor.chain().focus().setImage({ src: url }).run()
  }

  function addLink() {
    const url = window.prompt('Pegá el link')
    if (!url) return

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url })
      .run()
  }

  return (
    <div className="rich-editor">
      <div className="rich-editor__toolbar">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}>
          Negrita
        </button>

        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}>
          Cursiva
        </button>

        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          Título
        </button>

        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}>
          Viñetas
        </button>

        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          Lista
        </button>

        <button type="button" onClick={addLink}>
          Link
        </button>

        <select
          defaultValue=""
          onChange={(e) => {
            addImage(e.target.value)
            e.target.value = ''
          }}
        >
          <option value="">Insertar imagen</option>

          {mediaOptions.map((media) => (
            <option key={media._id} value={media.url}>
              {media.name || 'Sin nombre'}
            </option>
          ))}
        </select>
      </div>

      <EditorContent editor={editor} className="rich-editor__content" />
    </div>
  )
}