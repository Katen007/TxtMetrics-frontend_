import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './styles/Navbar.css';

export const AppNavbar = () => {
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

        </Nav>

      </Container>
    </Navbar>
  );
};
