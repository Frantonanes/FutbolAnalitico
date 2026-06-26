import { useMemo, useState } from 'react'

import './HashtagSelector.css'

type Hashtag = {
  _id: string
  name: string
}

type Props = {
  options: Hashtag[]
  selected: string[]
  onChange: (hashtags: string[]) => void
}

export default function HashtagSelector({
  options,
  selected,
  onChange
}: Props) {
  const [search, setSearch] = useState('')

  const filteredOptions = useMemo(() => {
    const normalizedSearch = search.toLowerCase().trim()

    return options
      .filter((hashtag) =>
        hashtag.name.toLowerCase().includes(normalizedSearch)
      )
      .filter((hashtag) => !selected.includes(hashtag.name))
      .slice(0, 8)
  }, [options, search, selected])

  function addHashtag(hashtag: string) {
    onChange([...selected, hashtag])
    setSearch('')
  }

  function removeHashtag(hashtag: string) {
    onChange(selected.filter((tag) => tag !== hashtag))
  }

  return (
    <div className="hashtag-selector">
      <div className="hashtag-selector__selected">
        {selected.length === 0 ? (
          <span className="hashtag-selector__empty">
            Todavía no seleccionaste hashtags
          </span>
        ) : (
          selected.map((hashtag) => (
            <button
              key={hashtag}
              type="button"
              className="hashtag-selector__chip"
              onClick={() => removeHashtag(hashtag)}
            >
              #{hashtag}
              <span>×</span>
            </button>
          ))
        )}
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar hashtag. Ej: argentina"
      />

      {search && filteredOptions.length > 0 && (
        <div className="hashtag-selector__options">
          {filteredOptions.map((hashtag) => (
            <button
              key={hashtag._id}
              type="button"
              onClick={() => addHashtag(hashtag.name)}
            >
              #{hashtag.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}