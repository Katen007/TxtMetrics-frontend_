//import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './styles/ReadIndxsPage.css';
//import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
    //const navigate = useNavigate()
    // const handleStart = (event: React.FormEvent) => {
    //     event.preventDefault();
    //     navigate("/texts")
    // };
    return (
        <div className="home-shell">
            <video autoPlay loop muted playsInline className="home-video-background">
                    <source src="/RIP_FRONTEND_/background/Background.mp4" type="video/mp4" />
                    Ваш браузер не поддерживает видео-тег.
                </video>
            <div className="home-inner">
                <Link to="/texts">
                    <h1 className="page-title home-title-fix">
                    Добро пожаловать в TxtMetric!
                    </h1>
                    <p className="home-lead">
                        Этот сервис рассчитывает индексы читабельности текстов разных стилей.
                    </p>
                </Link>
                {/* <Button className='btn-primary' onClick={handleStart}>
                    Начать
                </Button> */}
            </div>
        </div>
    );
};
