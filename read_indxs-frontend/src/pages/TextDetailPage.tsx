// src/pages/TextDetailPage.tsx
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Spinner, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

import type { ICrumb } from '../types';
import { DefaultImage } from '../components/TextCard';
import { CustomBreadcrumbs } from '../components/Breadcrumbs';

import { fetchTextById, clearCurrentText } from '../store/slices/textsSlice';
import { addFactorToDraft } from '../store/slices/cartSlice';

import type { RootState, AppDispatch } from '../store';
import './styles/TextDetailPage.css';

export const TextDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();

  const { currentText: text, loading } = useSelector((state: RootState) => state.texts);
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (id) {
      dispatch(fetchTextById(id));
    }

    return () => {
      dispatch(clearCurrentText());
    };
  }, [id, dispatch]);

  const handleAddToDraft = async () => {
    if (!isAuthenticated) {
      return;
    }
    if (!id) return;
    try {
      await dispatch(addFactorToDraft(Number(id)));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading || !text) {
    return (
      <div className="detail-shell">
        <div className="detail-inner">
          <Spinner animation="border" />
        </div>
      </div>
    );
  }

  const crumbs: ICrumb[] = [
    { label: 'Тексты', path: '/texts' },
    { label: text.title || 'Текст', path: `/texts/${text.id}` },
  ];

  return (
    <div className="detail-shell">
      <div className="detail-inner">
        <CustomBreadcrumbs crumbs={crumbs} />

        <section className="detail-header">
          <img
            src={text.image_url || DefaultImage}
            alt={text.title}
            className="detail-image"
          />
          <div className="detail-header-content">
            <h1 className="detail-title">{text.title}</h1>
            <p className="detail-description">{text.description}</p>
          </div>
        </section>

        <section className="detail-meta">
          <div className="price-chip" aria-label="Цена услуги">
            <span className="price-chip__label">Цена:</span>
            <span className="price-chip__value">{text.price} ₽</span>
          </div>
        </section>

        <div className="detail-actions">
          <Button className="btn-more" onClick={handleAddToDraft}>
            Добавить в расчёт
          </Button>
          <Link to="/texts">
            <Button variant="outline-secondary" style={{ marginLeft: 12 }}>
              Назад к списку
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
