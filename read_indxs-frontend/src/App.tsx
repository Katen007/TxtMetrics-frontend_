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
import { useEffect } from 'react';
import { invoke } from "@tauri-apps/api/core";
import { useDispatch } from 'react-redux';
import type { AppDispatch } from './store';
import { resetAuth } from './store/slices/userSlice';

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
  const dispatch = useDispatch<AppDispatch>();

  // 1) ВЫХОД ПРИ ОБНОВЛЕНИИ (reload)
  useEffect(() => {
    const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;

    if (nav?.type === 'reload') {
      dispatch(resetAuth());              // сброс Redux user-state
      localStorage.removeItem('token');   // если вы храните токен в localStorage (поменяйте ключ при необходимости)
    }
  }, [dispatch]);

   useEffect(()=>{
        invoke('tauri', {cmd: 'create'})
        .then((resp: any) => console.log(resp))
        .catch((err: any) => console.log(err));
        return ()=>{
            invoke('tauri', {cmd: 'close'})
        .then((resp: any) => console.log(resp))
        .catch((err: any) => console.log(err));
        }

    }, [])
  return (
    <BrowserRouter>
      <Routes>
        {/* всё, что с Navbar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/texts" element={<TextsListPage />} />
          <Route path="/texts/:id" element={<TextDetailPage />} />
          <Route path="/readIndxs" element={<ReadIndexsListPage />} />
          <Route path="/readIndxs/:id" element={<ReadIndexsPage />} />
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
