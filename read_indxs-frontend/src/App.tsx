// src/App.tsx
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AppNavbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { TextsListPage } from './pages/TextsListPage';
import { TextDetailPage } from './pages/TextDetailPage';

const MainLayout = () => (
    <>
        <AppNavbar />
        <main style={{ paddingTop:'56px' }}>
            <Outlet />
        </main>
    </>
);

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route element={<MainLayout />}>
                    <Route path="/texts" element={<TextsListPage />} />
                    <Route path="/texts/:id" element={<TextDetailPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
