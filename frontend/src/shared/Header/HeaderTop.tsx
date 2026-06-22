import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/FutbolAnaliticoLogo.png'
import { loginAdmin } from '../../services/authService'

import './Header.css'

export default function HeaderTop() {
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [search, setSearch] = useState('')

  const showPassword = username.toLowerCase() === 'w4zn3'

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()

    if (!search.trim()) return

    navigate(`/buscar?q=${encodeURIComponent(search.trim())}`)
    setSearch('')
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    try {
      const data = await loginAdmin(username, password)

      localStorage.setItem('adminToken', data.token)

      setOpen(false)
      setUsername('')
      setPassword('')

      navigate('/admin')
    } catch {
      alert('Credenciales incorrectas')
    }
  }

  return (
    <header className="header-top">
      <Link to="/" className="logo">
  <img
    src={logo}
    alt="Futbol Analítico"
    className="logo-img"
  />
</Link>

      <form className="search-container" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Buscar noticias, equipos o jugadores..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button type="submit" aria-label="Buscar">
          🔍
        </button>
      </form>

      <div className="admin-dropdown">
        <button
          type="button"
          className="news-btn"
          onClick={() => setOpen(!open)}
          aria-label="Abrir acceso admin"
        >
          📰
        </button>

        {open && (
          <form className="admin-panel" onSubmit={handleLogin}>
            <div className="admin-panel__header">
              <h4>Acceso admin</h4>

              <button
                type="button"
                className="admin-panel__close"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>

            <input
              autoComplete="username"
              placeholder="Nombre"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            {showPassword && (
              <input
                type="password"
                autoComplete="current-password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}

            {showPassword && (
              <button type="submit">
                Entrar
              </button>
            )}
          </form>
        )}
      </div>
    </header>
  )
}
