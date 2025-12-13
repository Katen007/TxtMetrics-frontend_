// src/components/Navbar.tsx
import { useEffect } from 'react';
import { Navbar, Container, Nav, Button, Badge } from 'react-bootstrap';
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

  const { isAuthenticated, user, loading } = useSelector((state: RootState) => state.user);
  // const { readIndxs_id, count } = useSelector((state: RootState) => state.cart);

  // Подтягиваем бейджик корзины, когда пользователь залогинен
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartBadge());
    }
  }, [isAuthenticated, dispatch]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
    } catch (e) {
      console.warn(e);
    } finally {
      // после выхода — на страницу логина
      navigate('/login');
    }
  };

 

  return (
    <Navbar fixed="top" className="app-header" bg="" variant="dark">
      <Container fluid className="app-header__inner">
        <Navbar.Brand as={Link} to="/texts" className="brand">
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
          {/* Кнопка перехода к черновику заявки по заданию */}
          {/* {isAuthenticated && (
            <Button
              as={Link}
              to={readIndxs_id ? `/orders/${readIndxs_id}` : '#'}
              variant={readIndxs_id ? 'outline-light' : 'outline-light'}
              size="sm"
              disabled={!readIndxs_id}
              style={{
                opacity: readIndxs_id ? 1 : 0.5,
                cursor: readIndxs_id ? 'pointer' : 'not-allowed',
              }}
            >
              Черновик&nbsp;
              <Badge bg="light" text="dark">
                {count}
              </Badge>
            </Button>
          )} */}

          {isAuthenticated ? (
            <>
              <Nav.Link as={Link} to="/profile" className="text-white d-flex align-items-center gap-2">
                    <PersonCircle size={20} />
                    <span className="fw-bold">
                        {user?.login|| 'Пользователь'}
                    </span>
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
              <Button
                variant="outline-light"
                size="sm"
                as={Link}
                to="/login"
              >
                Вход
              </Button>
              <Button
                size="sm"
                as={Link}
                to="/register"
                className="btn-orange"
                >
                Регистрация
                </Button>

            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};
