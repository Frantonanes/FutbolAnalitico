import { useEffect, useRef, useState } from 'react'
import {
  EditorContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  useEditor,
  type NodeViewProps
} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { NodeSelection } from '@tiptap/pm/state'

import './RichTextEditor.css'

type MediaOption = {
  _id: string
  name?: string
  url: string
  hashtags?: string[]
}

type ImageAlign = 'full' | 'left' | 'right'

type RichTextEditorProps = {
  value: string
  onChange: (value: string) => void
  mediaOptions?: MediaOption[]
}

function RichImageNode({ node, selected, deleteNode }: NodeViewProps) {
  const attrs = node.attrs as {
    src: string
    alt?: string
    title?: string
    align?: ImageAlign
  }
  const align = attrs.align || 'full'

  return (
    <NodeViewWrapper
      as="figure"
      className={`rich-editor-image rich-editor-image--${align} ${
        selected ? 'rich-editor-image--selected' : ''
      }`}
      data-drag-handle
    >
      <button
        type="button"
        className="rich-editor-image__remove"
        onMouseDown={(e) => e.preventDefault()}
onClick={(e) => {
  e.stopPropagation()
  deleteNode()
}}
        aria-label="Eliminar imagen"
        title="Eliminar imagen"
      >
        x
      </button>

      <img
        src={attrs.src}
        alt={attrs.alt || ''}
        title={attrs.title || ''}
      />
    </NodeViewWrapper>
  )
}

const RichImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: 'full',
        parseHTML: (element) =>
          element.getAttribute('data-align') || 'full',
        renderHTML: (attributes) => ({
          'data-align': attributes.align,
          class: `news-content-image news-content-image--${attributes.align || 'full'}`
        })
      }
    }
  },
  addNodeView() {
    return ReactNodeViewRenderer(RichImageNode)
  }
})

export default function RichTextEditor({
  value,
  onChange,
  mediaOptions = []
}: RichTextEditorProps) {
  const [selectedMediaUrl, setSelectedMediaUrl] = useState('')
  const [imageAlign, setImageAlign] = useState<ImageAlign>('full')
  const [mediaSearch, setMediaSearch] = useState('')
  const lastValueRef = useRef(value)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3]
        }
      }),
      RichImage.configure({
        inline: false,
        allowBase64: true
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank'
        }
      })
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'rich-editor__paper'
      },
      handleClickOn(view, pos, node) {
        if (node.type.name !== 'image') return false

        const tr = view.state.tr.setSelection(
          NodeSelection.create(view.state.doc, pos)
        )

        view.dispatch(tr)
        return false
      }
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      lastValueRef.current = html
      onChange(html)
    }
  })

  useEffect(() => {
  if (!editor) return
  if (value === lastValueRef.current) return

  lastValueRef.current = value || ''

  editor.commands.setContent(value || '', {
    emitUpdate: false
  })
}, [editor, value])

  if (!editor) return null

  const filteredMedia = mediaOptions.filter((media) =>
    `${media.name || ''} ${media.url} ${media.hashtags?.join(' ') || ''}`
      .toLowerCase()
      .includes(mediaSearch.toLowerCase())
  )

  function insertImage() {
    if (!editor || !selectedMediaUrl) return

    const selectedMedia = mediaOptions.find(
      (media) => media.url === selectedMediaUrl
    )

    editor
      .chain()
      .focus()
      .insertContent({
        type: 'image',
        attrs: {
          src: selectedMediaUrl,
          alt: selectedMedia?.name || 'Imagen de la noticia',
          title: selectedMedia?.name || '',
          align: imageAlign
        }
      })
      .run()

    setSelectedMediaUrl('')
  }

  function setLink() {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('Pegá el link', previousUrl || 'https://')

    if (url === null) return

    if (!url.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url.trim() })
      .run()
  }

  return (
    <section className="rich-editor">
      <div className="rich-editor__toolbar" aria-label="Herramientas de texto">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
          Negrita
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          Cursiva
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        >
          Título
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
        >
          Subtítulo
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          Lista
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'is-active' : ''}
        >
          Cita
        </button>

        <button
          type="button"
          onClick={setLink}
          className={editor.isActive('link') ? 'is-active' : ''}
        >
          Link
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          Deshacer
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          Rehacer
        </button>
      </div>

      <div className="rich-editor__image-panel">
        <div className="rich-editor__image-fields">
          <label>
            Buscar imagen
            <input
              type="search"
              placeholder="Nombre, URL o hashtag"
              value={mediaSearch}
              onChange={(e) => setMediaSearch(e.target.value)}
            />
          </label>

          <label>
            Imagen para insertar
            <select
              value={selectedMediaUrl}
              onChange={(e) => setSelectedMediaUrl(e.target.value)}
            >
              <option value="">Seleccionar imagen</option>

              {filteredMedia.map((media) => (
                <option key={media._id} value={media.url}>
                  {media.name || 'Sin nombre'}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="rich-editor__image-position" aria-label="Posición de imagen">
          <button
            type="button"
            className={imageAlign === 'full' ? 'is-active' : ''}
            onClick={() => setImageAlign('full')}
          >
            Completa
          </button>

          <button
            type="button"
            className={imageAlign === 'left' ? 'is-active' : ''}
            onClick={() => setImageAlign('left')}
          >
            Izquierda
          </button>

          <button
            type="button"
            className={imageAlign === 'right' ? 'is-active' : ''}
            onClick={() => setImageAlign('right')}
          >
            Derecha
          </button>
        </div>

        {selectedMediaUrl && (
          <img
            className="rich-editor__image-preview"
            src={selectedMediaUrl}
            alt="Vista previa"
          />
        )}

        <button
          type="button"
          className="rich-editor__insert-image"
          onClick={insertImage}
          disabled={!selectedMediaUrl}
        >
          Insertar imagen
        </button>
      </div>

      <EditorContent editor={editor} className="rich-editor__content" />
    </section>
  )
}
