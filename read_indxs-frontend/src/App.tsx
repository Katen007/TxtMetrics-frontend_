// src/App.tsx
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AppNavbar } from './components/Navbar';

import { HomePage } from './pages/HomePage';
import { TextsListPage } from './pages/TextsListPage';
import { TextDetailPage } from './pages/TextDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { ReadIndexsListPage } from './pages/ReadIndxsListPage';
import { ReadIndexsPage } from './pages/ReadIndxsPage';

const MainLayout = () => (
  <>
    <AppNavbar />
    {/* отступ под фиксированный navbar */}
    <main style={{ paddingTop: '56px' }}>
      <Outlet />
    </main>
  </>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* всё, что с Navbar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/texts" element={<TextsListPage />} />
          <Route path="/texts/:id" element={<TextDetailPage />} />
          <Route path="/orders" element={<ReadIndexsListPage />} />
          <Route path="/orders/:id" element={<ReadIndexsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* гостевые страницы без главного layout (если хочешь — можно тоже внутрь MainLayout) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* на всякий случай — редирект всего неизвестного на главную */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
