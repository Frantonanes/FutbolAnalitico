import { useEffect, useState } from 'react'
import {
  getCategories,
  createCategory,
  deleteCategory
} from '../../../services/contentService'
import { slugify } from '../../../shared/utils/slugify'
import './AdminForm.css'

type Category = {
  _id: string
  name: string
  slug: string
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)

  async function loadCategories() {
  try {
    setLoading(true)

    const data = await getCategories()
    setCategories(data)
  } catch (error) {
    console.error(error)
    alert('Error cargando categorías')
  } finally {
    setLoading(false)
  }
}

  useEffect(() => {
    const controller = new AbortController()

    getCategories(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setCategories(data)
        }
      })
      .catch((error) => {
        if (controller.signal.aborted) return
        console.error(error)
        alert('Error cargando categorías')
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      })

    return () => controller.abort()
  }, [])

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault()

    if (!name.trim()) return

    try {
      await createCategory({
        name: name.trim(),
        slug: slugify(name)
      })

      setName('')
      loadCategories()
    } catch (error) {
      console.error(error)
      alert('Error creando categoría')
    }
  }

  async function handleDelete(id: string) {
    const confirmDelete = confirm(
      '¿Eliminar categoría?'
    )

    if (!confirmDelete) return

    try {
      await deleteCategory(id)

      setCategories(
        categories.filter(
          (category) => category._id !== id
        )
      )
    } catch (error) {
      console.error(error)
      alert('Error eliminando categoría')
    }
  }

  return (
    <div className="admin-form-page">
      <h1>Categorías</h1>

      <form
        onSubmit={handleSubmit}
        className="admin-form"
      >
        <input
          placeholder="Nombre de categoría"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        <button type="submit">
          Crear categoría
        </button>
      </form>

      {loading ? (
  <p>Cargando...</p>
) : categories.length === 0 ? (
  <p>No hay categorías cargadas.</p>
) : (
  <div className="admin-list">
    {categories.map((category) => (
            <div
              key={category._id}
              className="section-preview"
            >
              <strong>
                {category.name}
              </strong>

              <p>
                slug: {category.slug}
              </p>

              <button
                type="button"
                onClick={() =>
                  handleDelete(category._id)
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
