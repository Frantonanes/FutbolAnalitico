import { Routes, Route } from 'react-router-dom'

import HomePage from './features/pages/HomePage/HomePage'
import NewsPage from './features/pages/NewsPage/NewsPage'
import NewsDetailPage from './features/pages/NewsDetailPage/NewsDetailPage'
import PredictionsPage from './features/pages/PredictionsPage/PredictionsPage'
import PredictionDetailPage from './features/pages/PredictionDetailPage/PredictionDetailPage'
import PublicLayout from './shared/PublicLayout/PublicLayout'
import SearchPage from './features/pages/SearchPage/SearchPage'
import AdminLayout from './features/admin/AdminLayout'
import DashboardPage from './features/admin/pages/DashboardPage'
import AdminNewsPage from './features/admin/pages/AdminNewsPage'
import CreateNewsPage from './features/admin/pages/CreateNewsPage'
import AdminPredictionsPage from './features/admin/pages/AdminPredictionsPage'
import CreatePredictionPage from './features/admin/pages/CreatePredictionPage'
import EditNewsPage from './features/admin/pages/EditNewsPage'
import EditPredictionPage from './features/admin/pages/EditPredictionPage'
import CategoryPage from './features/pages/CategoryPage/CategoryPage'
import NotFoundPage from './features/pages/NotFoundPage/NotFoundPage'
import AdminCategoriesPage from './features/admin/pages/AdminCategoriesPage'
import AdminHashtagsPage from './features/admin/pages/AdminHashtagsPage'
import AdminMediaPage from './features/admin/pages/AdminMediaPage'
import AdminCompetitionsPage from './features/admin/pages/AdminCompetitionsPage'
import AdminTeamsPage from './features/admin/pages/AdminTeamsPage'
import AdminWritersPage from './features/admin/pages/AdminWritersPage'

function App() {
  return (
    <Routes>

  <Route element={<PublicLayout />}>
    <Route path="/" element={<HomePage />} />

    <Route path="/noticias" element={<NewsPage />} />
    <Route path="/noticias/:slug" element={<NewsDetailPage />} />

    <Route path="/predicciones" element={<PredictionsPage />} />
    <Route path="/predicciones/:slug" element={<PredictionDetailPage />} />

    <Route path="/buscar" element={<SearchPage />} />
    <Route path="/categoria/:category" element={<CategoryPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Route>

  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<DashboardPage />} />

    <Route
  path="escritores"
  element={<AdminWritersPage />}
/>

    <Route path="noticias" element={<AdminNewsPage />} />
    <Route path="noticias/crear" element={<CreateNewsPage />} />
    <Route path="noticias/editar/:id" element={<EditNewsPage />} />

    <Route path="predicciones" element={<AdminPredictionsPage />} />
    <Route path="predicciones/crear" element={<CreatePredictionPage />} />
    <Route path="predicciones/editar/:id" element={<EditPredictionPage />} />

    <Route
  path="categorias"
  element={<AdminCategoriesPage />}
/>

<Route
  path="hashtags"
  element={<AdminHashtagsPage />}
/>

<Route
  path="media"
  element={<AdminMediaPage />}
/>

<Route
  path="competiciones"
  element={<AdminCompetitionsPage />}
/>

<Route
  path="equipos"
  element={<AdminTeamsPage />}
/>
  </Route>

</Routes>
  )
}

export default App 
