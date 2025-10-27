import { Navbar, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './styles/Navbar.css';

export const AppNavbar = () => {
    return (
        <Navbar fixed="top" className="app-header" bg="" variant="dark">
            <Container fluid className="app-header__inner">
                <Navbar.Brand
                    as={Link}
                    to="/texts"
                    className="brand"
                >
                    TxtMetric
                </Navbar.Brand>
            </Container>
        </Navbar>
    );
};
