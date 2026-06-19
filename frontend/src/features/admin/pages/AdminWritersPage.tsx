import { useEffect, useState } from 'react'
import {
  createWriter,
  deleteWriter,
  getWriters,
  updateWriter
} from '../../../services/writerService'
import type {
  Writer,
  WriterPayload
} from '../../../services/writerService'
import { uploadImage } from '../../../services/uploadService'
import { slugify } from '../../../shared/utils/slugify'
import './AdminForm.css'

const emptyForm: WriterPayload = {
  name: '',
  slug: '',
  image: '',
  role: 'Redactor',
  bio: '',
  twitter: '',
  instagram: ''
}

export default function AdminWritersPage() {
  const [writers, setWriters] = useState<Writer[]>([])
  const [form, setForm] =
    useState<WriterPayload>(emptyForm)

  const [editingId, setEditingId] =
    useState<string | null>(null)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] =
    useState(false)

  async function loadWriters() {
    try {
      setLoading(true)

      const data = await getWriters()
      setWriters(data)
    } catch (error) {
      console.error(error)
      alert('Error cargando escritores')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWriters()
  }, [])

  function handleChange(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value
    }))
  }

  async function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0]

    if (!file) return

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ]

    if (!allowedTypes.includes(file.type)) {
      alert('La imagen debe ser JPG, PNG o WEBP')
      event.target.value = ''
      return
    }

    const maxSize = 5 * 1024 * 1024

    if (file.size > maxSize) {
      alert('La imagen no puede superar los 5 MB')
      event.target.value = ''
      return
    }

    try {
      setUploadingImage(true)

      const result = await uploadImage(file)

      const imageUrl =
        result.url || result.secure_url

      if (!imageUrl) {
        throw new Error(
          'El servidor no devolvió la URL de la imagen'
        )
      }

      setForm((current) => ({
        ...current,
        image: imageUrl
      }))
    } catch (error) {
      console.error(error)

      alert(
        error instanceof Error
          ? error.message
          : 'Error subiendo la imagen'
      )
    } finally {
      setUploadingImage(false)
      event.target.value = ''
    }
  }

  function resetForm() {
    setForm({ ...emptyForm })
    setEditingId(null)
  }

  function handleEdit(writer: Writer) {
    setEditingId(writer._id)

    setForm({
      name: writer.name,
      slug: writer.slug,
      image: writer.image || '',
      role: writer.role || 'Redactor',
      bio: writer.bio || '',
      twitter: writer.twitter || '',
      instagram: writer.instagram || ''
    })

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  async function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault()

    if (!form.name.trim()) {
      alert('Ingresá el nombre del escritor')
      return
    }

    if (!form.image) {
      alert('Seleccioná una foto de perfil')
      return
    }

    if (uploadingImage) {
      alert('Esperá a que termine de subir la imagen')
      return
    }

    const payload: WriterPayload = {
      ...form,
      name: form.name.trim(),
      slug: editingId
        ? form.slug
        : slugify(form.name)
    }

    try {
      setSaving(true)

      if (editingId) {
        await updateWriter(editingId, payload)
      } else {
        await createWriter(payload)
      }

      resetForm()
      await loadWriters()
    } catch (error) {
      console.error(error)

      alert(
        error instanceof Error
          ? error.message
          : 'Error guardando escritor'
      )
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este escritor?')) {
      return
    }

    try {
      await deleteWriter(id)

      setWriters((current) =>
        current.filter(
          (writer) => writer._id !== id
        )
      )

      if (editingId === id) {
        resetForm()
      }
    } catch (error) {
      console.error(error)

      alert(
        error instanceof Error
          ? error.message
          : 'Error eliminando escritor'
      )
    }
  }

  return (
    <div className="admin-form-page">
      <h1>
        {editingId
          ? 'Editar escritor'
          : 'Escritores'}
      </h1>

      <form
        className="admin-form"
        onSubmit={handleSubmit}
      >
        <label>
          Nombre
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nombre y apellido"
            required
          />
        </label>

        <label>
          Cargo
          <input
            name="role"
            value={form.role}
            onChange={handleChange}
            placeholder="Ej: Periodista deportivo"
          />
        </label>

        <label>
          Foto de perfil
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageUpload}
            disabled={uploadingImage}
          />
        </label>

        {uploadingImage && (
          <p>Subiendo imagen...</p>
        )}

        {form.image && (
          <div>
            <img
              src={form.image}
              alt="Vista previa del escritor"
              style={{
                width: 110,
                height: 110,
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />

            <button
              type="button"
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  image: ''
                }))
              }
              disabled={uploadingImage}
            >
              Quitar foto
            </button>
          </div>
        )}

        <label>
          Biografía
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Breve presentación del escritor"
            rows={4}
          />
        </label>

        <label>
          Twitter / X
          <input
            name="twitter"
            value={form.twitter}
            onChange={handleChange}
            placeholder="https://x.com/usuario"
          />
        </label>

        <label>
          Instagram
          <input
            name="instagram"
            value={form.instagram}
            onChange={handleChange}
            placeholder="https://instagram.com/usuario"
          />
        </label>

        <button
          type="submit"
          disabled={saving || uploadingImage}
        >
          {saving
            ? 'Guardando...'
            : editingId
              ? 'Guardar cambios'
              : 'Crear escritor'}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            disabled={saving || uploadingImage}
          >
            Cancelar edición
          </button>
        )}
      </form>

      <h2>Escritores creados</h2>

      {loading ? (
        <p>Cargando...</p>
      ) : writers.length === 0 ? (
        <p>No hay escritores cargados.</p>
      ) : (
        <div className="admin-list">
          {writers.map((writer) => (
            <div
              key={writer._id}
              className="section-preview"
            >
              {writer.image && (
                <img
                  src={writer.image}
                  alt={writer.name}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              )}

              <strong>{writer.name}</strong>
              <p>{writer.role}</p>

              {writer.bio && (
                <p>{writer.bio}</p>
              )}

              <button
                type="button"
                onClick={() => handleEdit(writer)}
              >
                Editar
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDelete(writer._id)
                }
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}