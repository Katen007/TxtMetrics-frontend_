// src/App.tsx
import { HashRouter , Routes, Route, Outlet } from 'react-router-dom';
import { AppNavbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { TextsListPage } from './pages/TextsListPage';
import { TextDetailPage } from './pages/TextDetailPage';
import { useEffect } from 'react';
import { invoke } from "@tauri-apps/api/core";

const MainLayout = () => (
    <>
        <AppNavbar />
        <main style={{ paddingTop:'56px' }}>
            <Outlet />
        </main>
    </>
);

function App() {
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
        <HashRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route element={<MainLayout />}>
                    <Route path="/texts" element={<TextsListPage />} />
                    <Route path="/texts/:id" element={<TextDetailPage />} />
                </Route>
            </Routes>
        </HashRouter >
    );
}

export default App;
