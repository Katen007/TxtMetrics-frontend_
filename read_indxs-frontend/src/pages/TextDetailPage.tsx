import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Spinner, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import type { ICrumb } from '../types';
import { DefaultImage } from '../components/TextCard';
import { CustomBreadcrumbs } from '../components/Breadcrumbs';

import { fetchTextById, addTextToDraft, clearCurrentText } from '../store/slices/textsSlice';
import type { RootState, AppDispatch } from '../store';

import './styles/TextDetailPage.css';

export const TextDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { currentText: text, loading } = useSelector((state: RootState) => state.texts);

  useEffect(() => {
    if (id) {
      dispatch(fetchTextById(id));
    }

    // при выходе со страницы очищаем currentText
    return () => {
      dispatch(clearCurrentText());
    };
  }, [id, dispatch]);

  const displayImage = text?.image_url || (text as any)?.imageUrl || DefaultImage;

  if (loading || (!text && id)) {
    return (
      <div className="detail-page-shell detail-page-shell--center">
        <Spinner
          animation="border"
          style={{ color: 'var(--blue)', width: '3rem', height: '3rem' }}
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
            <Button className="btn-more" style={{ marginTop: '12px' }}>
              Вернуться к списку
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const crumbs: ICrumb[] = [
    { label: 'Тексты', path: '/texts', active: false },
    { label: text.title ?? 'Текст', active: true },
  ];

  const handleAddToDraft = () => {
    if (!text.id) return;
    dispatch(addTextToDraft(text.id));
  };

  return (
    <div className="detail-page-shell">
      <div className="page-container">
        <div className="detail-breadcrumbs-wrapper">
          <CustomBreadcrumbs crumbs={crumbs} />
        </div>

        <h1 className="page-title">{text.title}</h1>

        <section className="detail-grid">
          <figure className="card detail-card">
            <img src={displayImage} alt={text.title} />
          </figure>

          <div className="card muted desc">
            {text.description}
          </div>

          <div className="price-chip" aria-label="Цена услуги">
            <span className="price-chip__label">Цена:</span>
            <span className="price-chip__value">{text.price} ₽</span>
          </div>
        </section>

        <div className="detail-actions">
          <Button className="btn-more" onClick={handleAddToDraft}>
            Добавить в расчёт
          </Button>
        </div>
      </div>
    </div>
  );
};
