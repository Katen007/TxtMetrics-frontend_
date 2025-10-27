import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Spinner, Button } from 'react-bootstrap';
import { getTextById } from '../api/textApi';
import type { IText } from '../types';
import { DefaultImage } from '../components/TextCard';
import { CustomBreadcrumbs } from '../components/Breadcrumbs';
import './styles/TextDetailPage.css';

export const TextDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [text, setText] = useState<IText | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            setLoading(true);
            getTextById(id)
                .then(data => setText(data))
                .finally(() => setLoading(false));
        }
    }, [id]);

    const displayImage = text?.imageUrl || (text as any)?.image || DefaultImage;

    if (loading) {
        return (
            <div className="detail-page-shell detail-page-shell--center">
                <Spinner
                    animation="border"
                    style={{ color:'var(--blue)', width:'3rem', height:'3rem' }}
                />
            </div>
        );
    }

    if (!text) {
        return (
            <div className="detail-page-shell">
                <div className="page-container not-found-block">
                    <h2>Текст не найден</h2>
                    <Link to="/texts">
                        <Button className="btn-more" style={{ marginTop:'12px' }}>
                            Вернуться к списку
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const breadcrumbs = [
        { label: 'Тексты', path: '/texts' },
        { label: text.title, active: true },
    ];

    return (
        <div className="detail-page-shell">
            <div className="page-container">
                <div className="detail-breadcrumbs-wrapper">
                    <CustomBreadcrumbs crumbs={breadcrumbs} />
                </div>

                <h1 className="page-title">{text.title}</h1>

                <section className="detail-grid">
                    <figure className="card detail-card">
                        <img src={displayImage} alt={text.title} />
                    </figure>

                    <div className="card muted desc">
                        {text.description || text.description}
                    </div>

                    <div className="price-chip" aria-label="Цена услуги">
                        <span className="price-chip__label">Цена:</span>
                        <span className="price-chip__value">{text.price} ₽</span>
                    </div>
                </section>

                <div className="detail-actions">
                    <Button className="btn-more">
                        Добавить в расчёт
                    </Button>
                </div>
            </div>
        </div>
    );
};
