import { Button } from 'react-bootstrap';
import './styles/ReadIndxsPage.css';
import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
    const navigate = useNavigate()
    const handleStart = (event: React.FormEvent) => {
        event.preventDefault();
        navigate("/texts")
    };
    return (
        <div className="home-shell">
            <div className="home-inner">
                <h1 className="page-title home-title-fix">
                    Добро пожаловать в TxtMetric!
                </h1>
                <p className="home-lead">
                    Этот сервис рассчитывает индексы читабельности текстов разных стилей.
                </p>
                <Button className='btn-primary' onClick={handleStart}>
                    Начать
                </Button>
            </div>
        </div>
    );
};
