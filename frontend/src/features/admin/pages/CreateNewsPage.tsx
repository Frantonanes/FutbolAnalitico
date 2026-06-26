import { useEffect, useState } from 'react'

import { createNews } from '../../../services/newsService'
import {
  getCategories,
  getHashtags,
  getMedia,
  getTeams
} from '../../../services/contentService'
import { getWriters } from '../../../services/writerService'

import type { Writer } from '../../../services/writerService'
import { slugify } from '../../../shared/utils/slugify'
import RichTextEditor from '../components/RichTextEditor'
import HashtagSelector from '../components/HashtagSelector'
import MediaSelector from '../components/MediaSelector'

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
  const [authorId, setAuthorId] = useState('')
  const [image, setImage] = useState('')

  const [categories, setCategories] = useState<Category[]>([])
  const [hashtagOptions, setHashtagOptions] = useState<Hashtag[]>([])
  const [mediaOptions, setMediaOptions] = useState<Media[]>([])
  const [teamOptions, setTeamOptions] = useState<Team[]>([])
  const [writerOptions, setWriterOptions] = useState<Writer[]>([])

  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([])

  const [teams, setTeams] = useState<string[]>([])
  const [selectedTeam, setSelectedTeam] = useState('')
  const [teamSearch, setTeamSearch] = useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

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
      setAuthorId('')
      setImage('')
      setSelectedHashtags([])
      setTeams([])
      setSelectedTeam('')
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

  const filteredTeams = teamOptions.filter((team) =>
    team.name
      .toLowerCase()
      .includes(teamSearch.toLowerCase())
  )

  return (
    <div className="admin-form-page admin-form-page--wide">
      <h1>Crear noticia</h1>

      <form onSubmit={handleSubmit} className="admin-form admin-form--wide">
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

        <MediaSelector
          label="Imagen principal"
          value={image}
          mediaOptions={mediaOptions}
          onChange={setImage}
        />

        <section className="admin-form__editor-section">
          <h2>Contenido de la noticia</h2>

          <RichTextEditor
            value={content}
            onChange={setContent}
            mediaOptions={mediaOptions}
          />
        </section>

        <section className="admin-form__section">
          <h2>Hashtags</h2>

          <HashtagSelector
            options={hashtagOptions}
            selected={selectedHashtags}
            onChange={setSelectedHashtags}
          />
        </section>

        <section className="admin-form__section">
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
        </section>

        <button type="submit" disabled={saving}>
          {saving ? 'Creando...' : 'Crear noticia'}
        </button>
      </form>
    </div>
  )
}