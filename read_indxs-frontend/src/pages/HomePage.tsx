import './styles/ReadIndxsPage.css';

export const HomePage = () => {
    return (
        <div className="home-shell">
            <div className="home-inner">
                <h1 className="page-title home-title-fix">
                    Добро пожаловать в TxtMetric!
                </h1>
                <p className="home-lead">
                    Этот сервис рассчитывает индексы читабельности текстов разных стилей.
                </p>
            </div>
        </div>
    );
};
