import { useMemo, useState } from 'react'

import './MediaSelector.css'

type Media = {
  _id: string
  name?: string
  url: string
  hashtags?: string[]
}

type Props = {
  label: string
  value: string
  mediaOptions: Media[]
  onChange: (url: string) => void
}

export default function MediaSelector({
  label,
  value,
  mediaOptions,
  onChange
}: Props) {
  const [search, setSearch] = useState('')

  const filteredMedia = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim()

    return mediaOptions.filter((media) =>
      `${media.name || ''} ${media.url} ${media.hashtags?.join(' ') || ''}`
        .toLowerCase()
        .includes(normalizedSearch)
    )
  }, [mediaOptions, search])

  const selectedMedia = mediaOptions.find(
    (media) => media.url === value
  )

  return (
    <label className="media-selector">
      <span className="media-selector__label">
        {label}
      </span>

      <div className="media-selector__controls">
        <input
          className="media-selector__search"
          placeholder="Buscar imagen por nombre o hashtag"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="media-selector__select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Seleccionar imagen</option>

          {filteredMedia.map((media) => (
            <option key={media._id} value={media.url}>
              {media.name || 'Sin nombre'}
            </option>
          ))}
        </select>
      </div>

      {selectedMedia ? (
        <div className="media-selector__preview">
          <img
            src={selectedMedia.url}
            alt={selectedMedia.name || 'Preview'}
          />

          <div className="media-selector__preview-info">
            <strong>
              {selectedMedia.name || 'Sin nombre'}
            </strong>

            <span>{selectedMedia.url}</span>
          </div>

          <button
            type="button"
            className="media-selector__clear"
            onClick={() => onChange('')}
            aria-label="Quitar imagen"
          >
            ×
          </button>
        </div>
      ) : (
        <p className="media-selector__empty">
          Todavía no seleccionaste una imagen.
        </p>
      )}
    </label>
  )
}