// src/components/Navbar.tsx
import { useEffect } from 'react';
import { Navbar, Container, Nav, Button/*, Badge*/ } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { PersonCircle, BoxArrowRight } from 'react-bootstrap-icons';
import './styles/Navbar.css';
import type { RootState, AppDispatch } from '../store';
import { logoutUser } from '../store/slices/userSlice';
import { fetchCartBadge } from '../store/slices/cartSlice';

export const AppNavbar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isAuthenticated, user, loading } = useSelector(
    (state: RootState) => state.user
  );
  // const { readIndxs_id, count } = useSelector((state: RootState) => state.cart);

  // Логика как у друга: просто подтягиваем бейдж корзины, если юзер залогинен.
  // НИКАКОГО logout в useEffect — это и ломало вход.
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartBadge());
    }
  }, [isAuthenticated, dispatch]);

  const handleLogout = async () => {
    try {
      // как у друга: сначала выходим
      await dispatch(logoutUser());
      // затем обновляем бейдж (он станет пустым/нулевым)
      dispatch(fetchCartBadge());
    } catch (e) {
      console.warn(e);
    } finally {
      // и уводим на логин
      navigate('/login');
    }
  };
const showUserBlock = isAuthenticated && !!user?.login;
  return (
    <Navbar fixed="top" className="app-header" bg="" variant="dark">
      <Container fluid className="app-header__inner">
        <Navbar.Brand as={Link} to="/" className="brand">
          TxtMetric
        </Navbar.Brand>

        <Nav className="me-auto">
          <Nav.Link as={Link} to="/texts">
            Услуги
          </Nav.Link>

          {isAuthenticated && (
            <Nav.Link as={Link} to="/readIndxs">
              Мои заявки
            </Nav.Link>
          )}
        </Nav>

        <Nav className="ms-auto align-items-center gap-2">
          
          {showUserBlock ? (
  <>
    <Nav.Link
      as={Link}
      to="/profile"
      className="text-white d-flex align-items-center gap-2"
    >
      <PersonCircle size={20} />
      <span className="fw-bold">{user!.login}</span>
    </Nav.Link>

    <Button
      variant="outline-light"
      size="sm"
      onClick={handleLogout}
      disabled={loading}
    >
      Выйти
    </Button>
  </>
) : (
  <>
    <Button variant="outline-light" size="sm" as={Link} to="/login">
      Вход
    </Button>
    <Button size="sm" as={Link} to="/register" className="btn-orange">
      Регистрация
    </Button>
  </>
)}
        </Nav>
      </Container>
    </Navbar>
  );
};
