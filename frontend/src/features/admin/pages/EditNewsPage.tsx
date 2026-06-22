import { useEffect, useState } from 'react'
import {
  useNavigate,
  useParams
} from 'react-router-dom'

import {
  getNewsById,
  updateNews
} from '../../../services/newsService'

import {
  getCategories,
  getHashtags,
  getMedia,
  searchMedia,
  getTeams
} from '../../../services/contentService'

import { getWriters } from '../../../services/writerService'

import { slugify } from '../../../shared/utils/slugify'
import type { NewsSection } from '../../../shared/types/News'

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

type Writer = {
  _id: string
  name: string
  role?: string
  image?: string
}

export default function EditNewsPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [category, setCategory] = useState('')
  const [competition, setCompetition] = useState('')
  const [image, setImage] = useState('')
  const [authorId, setAuthorId] = useState('')

  const [categories, setCategories] = useState<Category[]>([])
  const [hashtagOptions, setHashtagOptions] =
    useState<Hashtag[]>([])
  const [mediaOptions, setMediaOptions] =
    useState<Media[]>([])
  const [teamOptions, setTeamOptions] =
    useState<Team[]>([])
  const [writerOptions, setWriterOptions] =
    useState<Writer[]>([])

  const [selectedHashtags, setSelectedHashtags] =
    useState<string[]>([])
  const [selectedImageHashtag, setSelectedImageHashtag] =
    useState('')

  const [teams, setTeams] = useState<string[]>([])
  const [selectedTeam, setSelectedTeam] = useState('')

  const [sections, setSections] =
    useState<NewsSection[]>([])
  const [sectionType, setSectionType] =
    useState<NewsSection['type']>('text')
  const [sectionContent, setSectionContent] =
    useState('')
  const [sectionImage, setSectionImage] =
    useState('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!id) return
    const articleId = id
    const controller = new AbortController()

    async function loadPageData() {
      try {
        setLoading(true)

        const [
          article,
          categoriesData,
          hashtagsData,
          mediaData,
          teamsData,
          writersData
        ] = await Promise.all([
          getNewsById(articleId, controller.signal),
          getCategories(controller.signal),
          getHashtags(controller.signal),
          getMedia(controller.signal),
          getTeams(controller.signal),
          getWriters(controller.signal)
        ])

        if (controller.signal.aborted) return

        setTitle(article.title || '')
        setSubtitle(article.subtitle || '')
        setCategory(article.category || '')
        setCompetition(article.competition || '')
        setImage(article.image || '')
        setSelectedHashtags(article.hashtags || [])
        setTeams(article.teams || [])
        setSections(article.sections || [])

        if (typeof article.authorId === 'string') {
          setAuthorId(article.authorId)
        } else {
          setAuthorId(article.authorId?._id || '')
        }

        setCategories(categoriesData)
        setHashtagOptions(hashtagsData)
        setMediaOptions(mediaData)
        setTeamOptions(teamsData)
        setWriterOptions(writersData)
      } catch (error) {
        if (controller.signal.aborted) return
        console.error(error)
        alert('Error cargando noticia')
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadPageData()

    return () => controller.abort()
  }, [id])

  async function handleImageHashtagChange(
    hashtag: string
  ) {
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
        selectedHashtags.filter(
          (tag) => tag !== hashtag
        )
      )
      return
    }

    setSelectedHashtags([
      ...selectedHashtags,
      hashtag
    ])
  }

  function addTeam() {
    if (!selectedTeam) return

    if (teams.includes(selectedTeam)) {
      alert('Ese equipo ya fue agregado')
      return
    }

    setTeams([...teams, selectedTeam])
    setSelectedTeam('')
  }

  function addSection() {
    if (
      sectionType === 'text' &&
      !sectionContent.trim()
    ) {
      alert('Agregá contenido al bloque')
      return
    }

    if (
      sectionType !== 'text' &&
      !sectionImage
    ) {
      alert('Seleccioná una imagen para el bloque')
      return
    }

    if (sectionType === 'image-full') {
      setSections([
        ...sections,
        {
          type: 'image-full',
          image: sectionImage
        }
      ])
    } else {
      setSections([
        ...sections,
        {
          type: sectionType,
          content: sectionContent,
          image: sectionImage
        }
      ])
    }

    setSectionType('text')
    setSectionContent('')
    setSectionImage('')
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault()

    if (!id) return

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

    try {
      setSaving(true)

      await updateNews(id, {
        slug: slugify(title),
        title: title.trim(),
        subtitle,
        category,
        competition,
        image,
        authorId,
        hashtags: selectedHashtags,
        teams,
        sections
      })

      alert('Noticia actualizada')
      navigate('/admin/noticias')
    } catch (error) {
      console.error(error)
      alert('Error actualizando noticia')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="admin-form-page">
        <h1>Editar noticia</h1>
        <p>Cargando noticia...</p>
      </div>
    )
  }

  return (
    <div className="admin-form-page">
      <h1>Editar noticia</h1>

      <form
        onSubmit={handleSubmit}
        className="admin-form"
      >
        <input
          placeholder="Título"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <input
          placeholder="Subtítulo"
          value={subtitle}
          onChange={(e) =>
            setSubtitle(e.target.value)
          }
        />

        <label>
          Escritor
          <select
            value={authorId}
            onChange={(e) =>
              setAuthorId(e.target.value)
            }
          >
            <option value="">
              Seleccionar escritor
            </option>

            {writerOptions.map((writer) => (
              <option
                key={writer._id}
                value={writer._id}
              >
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
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >
            <option value="">
              Seleccionar categoría
            </option>

            {categories.map((cat) => (
              <option
                key={cat._id}
                value={cat.name}
              >
                {cat.name}
              </option>
            ))}
          </select>
        </label>

        <input
          placeholder="Competencia. Ej: Mundial, Champions"
          value={competition}
          onChange={(e) =>
            setCompetition(e.target.value)
          }
        />

        <label>
          Filtrar imágenes por hashtag
          <select
            value={selectedImageHashtag}
            onChange={(e) =>
              handleImageHashtagChange(
                e.target.value
              )
            }
          >
            <option value="">
              Todas las imágenes
            </option>

            {hashtagOptions.map((hashtag) => (
              <option
                key={hashtag._id}
                value={hashtag.name}
              >
                #{hashtag.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Imagen principal
          <select
            value={image}
            onChange={(e) =>
              setImage(e.target.value)
            }
          >
            <option value="">
              Seleccionar imagen
            </option>

            {mediaOptions.map((media) => (
              <option
                key={media._id}
                value={media.url}
              >
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

        <h2>Hashtags</h2>

        {hashtagOptions.map((hashtag) => (
          <label key={hashtag._id}>
            <input
              type="checkbox"
              checked={selectedHashtags.includes(
                hashtag.name
              )}
              onChange={() =>
                toggleHashtag(hashtag.name)
              }
            />
            #{hashtag.name}
          </label>
        ))}

        <h2>Equipos relacionados</h2>

        <select
          value={selectedTeam}
          onChange={(e) =>
            setSelectedTeam(e.target.value)
          }
        >
          <option value="">
            Seleccionar equipo
          </option>

          {teamOptions.map((team) => (
            <option
              key={team._id}
              value={team.name}
            >
              {team.name}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={addTeam}
        >
          Agregar equipo
        </button>

        {teams.map((team, index) => (
          <p key={`${team}-${index}`}>
            {team}

            <button
              type="button"
              onClick={() =>
                setTeams(
                  teams.filter(
                    (_, i) => i !== index
                  )
                )
              }
            >
              Eliminar
            </button>
          </p>
        ))}

        <h2>Secciones de la noticia</h2>

        <select
          value={sectionType}
          onChange={(e) =>
            setSectionType(
              e.target.value as NewsSection['type']
            )
          }
        >
          <option value="text">Texto</option>
          <option value="image-left">
            Imagen izquierda
          </option>
          <option value="image-right">
            Imagen derecha
          </option>
          <option value="image-full">
            Imagen completa
          </option>
        </select>

        {sectionType !== 'image-full' && (
          <textarea
            placeholder="Contenido de la sección"
            value={sectionContent}
            onChange={(e) =>
              setSectionContent(e.target.value)
            }
            rows={6}
          />
        )}

        {sectionType !== 'text' && (
          <>
            <select
              value={sectionImage}
              onChange={(e) =>
                setSectionImage(e.target.value)
              }
            >
              <option value="">
                Seleccionar imagen de sección
              </option>

              {mediaOptions.map((media) => (
                <option
                  key={media._id}
                  value={media.url}
                >
                  {media.name || 'Sin nombre'}
                </option>
              ))}
            </select>

            {sectionImage && (
              <img
                src={sectionImage}
                alt=""
                className="section-image-preview"
              />
            )}
          </>
        )}

        <button
          type="button"
          onClick={addSection}
        >
          Agregar sección
        </button>

        <p>Secciones creadas: {sections.length}</p>

        {sections.map((section, index) => (
          <div
            key={index}
            className="section-preview"
          >
            <strong>{section.type}</strong>

            {'content' in section && (
              <p>{section.content}</p>
            )}

            {'image' in section &&
              section.image && (
                <img
                  src={section.image}
                  alt=""
                  className="section-image-preview"
                />
              )}

            <button
              type="button"
              onClick={() =>
                setSections(
                  sections.filter(
                    (_, i) => i !== index
                  )
                )
              }
            >
              Eliminar sección
            </button>
          </div>
        ))}

        <button
          type="submit" disabled={saving}
        >
          {saving
            ? 'Guardando...'
            : 'Guardar cambios'}
        </button>
      </form>
    </div>
  )
}
