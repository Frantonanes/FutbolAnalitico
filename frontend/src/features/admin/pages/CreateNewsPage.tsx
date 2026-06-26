import { useEffect, useState } from 'react'

import { createNews } from '../../../services/newsService'
import {
  getCategories,
  getHashtags,
  getMedia,
  searchMedia,
  getTeams
} from '../../../services/contentService'
import { getWriters } from '../../../services/writerService'

import type { Writer } from '../../../services/writerService'
import { slugify } from '../../../shared/utils/slugify'
import RichTextEditor from '../components/RichTextEditor'

import './AdminForm.css'

type Category = {
  _id: string
  name: string
}

type Hashtag = {
  _id: string
  name: string
}

type Media = {
  _id: string
  name?: string
  url: string
  hashtags?: string[]
}

type Team = {
  _id: string
  name: string
  logo?: string
}

function isRichContentEmpty(content: string) {
  return content
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, '')
    .trim().length === 0
}

export default function CreateNewsPage() {
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('')
  const [competition, setCompetition] = useState('')
  const [authorId, setAuthorId] = useState('')
  const [image, setImage] = useState('')

  const [categories, setCategories] = useState<Category[]>([])
  const [hashtagOptions, setHashtagOptions] = useState<Hashtag[]>([])
  const [mediaOptions, setMediaOptions] = useState<Media[]>([])
  const [teamOptions, setTeamOptions] = useState<Team[]>([])
  const [writerOptions, setWriterOptions] = useState<Writer[]>([])

  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([])
  const [selectedImageHashtag, setSelectedImageHashtag] = useState('')

  const [teams, setTeams] = useState<string[]>([])
  const [selectedTeam, setSelectedTeam] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [imageHashtagSearch, setImageHashtagSearch] = useState('')
  const [hashtagSearch, setHashtagSearch] = useState('')
  const [mediaSearch, setMediaSearch] = useState('')
  const [teamSearch, setTeamSearch] = useState('')

  useEffect(() => {
    loadContent()
  }, [])

  async function loadContent() {
    try {
      setLoading(true)

      const [
        categoriesData,
        hashtagsData,
        mediaData,
        teamsData,
        writersData
      ] = await Promise.all([
        getCategories(),
        getHashtags(),
        getMedia(),
        getTeams(),
        getWriters()
      ])

      setCategories(categoriesData)
      setHashtagOptions(hashtagsData)
      setMediaOptions(mediaData)
      setTeamOptions(teamsData)
      setWriterOptions(writersData)
    } catch (error) {
      console.error(error)
      alert('Error cargando datos del formulario')
    } finally {
      setLoading(false)
    }
  }

  async function handleImageHashtagChange(hashtag: string) {
    setSelectedImageHashtag(hashtag)

    try {
      if (!hashtag) {
        const data = await getMedia()
        setMediaOptions(data)
        return
      }

      const data = await searchMedia(hashtag)
      setMediaOptions(data)
    } catch (error) {
      console.error(error)
      alert('Error buscando imágenes')
    }
  }

  function toggleHashtag(hashtag: string) {
    if (selectedHashtags.includes(hashtag)) {
      setSelectedHashtags(
        selectedHashtags.filter((tag) => tag !== hashtag)
      )
      return
    }

    setSelectedHashtags([...selectedHashtags, hashtag])
  }

  function addTeam() {
    if (!selectedTeam) return

    if (teams.includes(selectedTeam)) {
      alert('Ese equipo ya fue agregado')
      return
    }

    setTeams([...teams, selectedTeam])
    setSelectedTeam('')
    setTeamSearch('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim()) {
      alert('Ingresá un título')
      return
    }

    if (!category) {
      alert('Seleccioná una categoría')
      return
    }

    if (!authorId) {
      alert('Seleccioná un escritor')
      return
    }

    if (!image) {
      alert('Seleccioná una imagen principal')
      return
    }

    if (isRichContentEmpty(content)) {
      alert('Escribí el contenido de la noticia')
      return
    }

    try {
      setSaving(true)

      await createNews({
        slug: slugify(title),
        title: title.trim(),
        subtitle,
        content,
        category,
        competition,
        authorId,
        image,
        hashtags: selectedHashtags,
        teams,
        sections: []
      })

      alert('Noticia creada')

      setTitle('')
      setSubtitle('')
      setContent('')
      setCategory('')
      setCompetition('')
      setAuthorId('')
      setImage('')
      setSelectedHashtags([])
      setSelectedImageHashtag('')
      setTeams([])
      setSelectedTeam('')
      setImageHashtagSearch('')
      setHashtagSearch('')
      setMediaSearch('')
      setTeamSearch('')

      loadContent()
    } catch (error) {
      console.error(error)
      alert('Error creando noticia')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="admin-form-page">
        <h1>Crear noticia</h1>
        <p>Cargando formulario...</p>
      </div>
    )
  }

  const filteredImageHashtags = hashtagOptions.filter((hashtag) =>
    hashtag.name
      .toLowerCase()
      .includes(imageHashtagSearch.toLowerCase())
  )

  const filteredHashtags = hashtagOptions.filter((hashtag) =>
    hashtag.name
      .toLowerCase()
      .includes(hashtagSearch.toLowerCase())
  )

  const filteredMedia = mediaOptions.filter((media) =>
    `${media.name || ''} ${media.url} ${media.hashtags?.join(' ') || ''}`
      .toLowerCase()
      .includes(mediaSearch.toLowerCase())
  )

  const filteredTeams = teamOptions.filter((team) =>
    team.name
      .toLowerCase()
      .includes(teamSearch.toLowerCase())
  )

  return (
    <div className="admin-form-page">
      <h1>Crear noticia</h1>

      <form onSubmit={handleSubmit} className="admin-form">
        <input
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Subtítulo"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
        />

        <label>
          Escritor
          <select
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
            required
          >
            <option value="">Seleccionar escritor</option>

            {writerOptions.map((writer) => (
              <option key={writer._id} value={writer._id}>
                {writer.name}
                {writer.role ? ` · ${writer.role}` : ''}
              </option>
            ))}
          </select>
        </label>

        <label>
          Categoría
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Seleccionar categoría</option>

            {categories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>

        <input
          placeholder="Competencia. Ej: Mundial, Champions"
          value={competition}
          onChange={(e) => setCompetition(e.target.value)}
        />

        <label>
          Filtrar imágenes por hashtag

          <input
            placeholder="Buscar hashtag. Ej: argentina"
            value={imageHashtagSearch}
            onChange={(e) => setImageHashtagSearch(e.target.value)}
          />

          <select
            value={selectedImageHashtag}
            onChange={(e) => handleImageHashtagChange(e.target.value)}
          >
            <option value="">Todas las imágenes</option>

            {filteredImageHashtags.map((hashtag) => (
              <option key={hashtag._id} value={hashtag.name}>
                #{hashtag.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Imagen principal

          <input
            placeholder="Buscar imagen por nombre, URL o hashtag"
            value={mediaSearch}
            onChange={(e) => setMediaSearch(e.target.value)}
          />

          <select
            value={image}
            onChange={(e) => setImage(e.target.value)}
          >
            <option value="">Seleccionar imagen</option>

            {filteredMedia.map((media) => (
              <option key={media._id} value={media.url}>
                {media.name || 'Sin nombre'}
              </option>
            ))}
          </select>
        </label>

        {image && (
          <img
            src={image}
            alt="Preview"
            className="image-preview"
          />
        )}

        <h2>Contenido de la noticia</h2>

        <RichTextEditor
          value={content}
          onChange={setContent}
          mediaOptions={filteredMedia}
        />

        <h2>Hashtags</h2>

        <input
          placeholder="Buscar hashtag"
          value={hashtagSearch}
          onChange={(e) => setHashtagSearch(e.target.value)}
        />

        {filteredHashtags.map((hashtag) => (
          <label key={hashtag._id}>
            <input
              type="checkbox"
              checked={selectedHashtags.includes(hashtag.name)}
              onChange={() => toggleHashtag(hashtag.name)}
            />

            #{hashtag.name}
          </label>
        ))}

        <h2>Equipos relacionados</h2>

        <input
          placeholder="Buscar equipo"
          value={teamSearch}
          onChange={(e) => setTeamSearch(e.target.value)}
        />

        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
        >
          <option value="">Seleccionar equipo</option>

          {filteredTeams.map((team) => (
            <option key={team._id} value={team.name}>
              {team.name}
            </option>
          ))}
        </select>

        <button type="button" onClick={addTeam}>
          Agregar equipo
        </button>

        {teams.map((team, index) => (
          <p key={`${team}-${index}`}>
            {team}

            <button
              type="button"
              onClick={() =>
                setTeams(teams.filter((_, i) => i !== index))
              }
            >
              Eliminar
            </button>
          </p>
        ))}

        <button type="submit" disabled={saving}>
          {saving ? 'Creando...' : 'Crear noticia'}
        </button>
      </form>
    </div>
  )
}