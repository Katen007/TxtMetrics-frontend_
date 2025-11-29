// src/App.tsx
import { HashRouter , Routes, Route, Outlet, BrowserRouter } from 'react-router-dom';
import { AppNavbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { TextsListPage } from './pages/TextsListPage';
import { TextDetailPage } from './pages/TextDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { OrdersListPage } from './pages/OrdersListPage';
import { OrderPage } from './pages/OrderPage';
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
        <Route path="/login" element={<LoginPage />} />      
        <Route path="/register" element={<RegisterPage />} />  
        <Route element={<MainLayout />}>
            <Route path="/texts" element={<TextsListPage />} />
            <Route path="/texts/:id" element={<TextDetailPage />} />
            <Route path="/profile" element={<ProfilePage />} /> 
            <Route path="/orders" element={<OrdersListPage />} />
            <Route path="/orders/:id" element={<OrderPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
    );
}

export default App;
