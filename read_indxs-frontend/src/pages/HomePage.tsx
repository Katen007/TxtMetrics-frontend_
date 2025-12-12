//import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './styles/ReadIndxsPage.css';
//import { useNavigate } from 'react-router-dom';
const slides = [
  './background/pic1.jpg',
  './background/pic2.jpg',
  './background/pic3.jpg',
];

export const HomePage = () => {
  return (
    <div className="home-shell">
      {/* фон-карусель */}
      <div
        id="homeBgCarousel"
        className="carousel slide carousel-fade home-bg-carousel"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          {slides.map((src, index) => (
            <div
              key={src}
              className={`carousel-item ${index === 0 ? 'active' : ''}`}
            >
              <img
                src={src}
                className="d-block home-bg-image"
                alt={`Slide ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Текст поверх карусели */}
      <div className="home-overlay">
        <Link to="/texts" className="home-link-reset">
          <h1  className="home-title-fix">
            Добро пожаловать в TxtMetric!
          </h1>
          <p className="home-lead">
            Этот сервис рассчитывает индексы читабельности текстов разных стилей.
          </p>
        </Link>
      </div>
    </div>
  );
};
