// src/components/TextCard.tsx
import { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import type { IText } from '../types';
import type { AppDispatch, RootState } from '../store';

import { addFactorToDraft } from '../store/slices/cartSlice';
import './styles/TextCard.css';

export const DefaultImage = 'http://localhost:9000/img/img/his.jpg';

interface TextCardProps {
  text: IText;
}

export const TextCard: React.FC<TextCardProps> = ({ text }) => {
  const img = text.image_url || (text as any).imageUrl || DefaultImage;
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!isAuthenticated) {
      return;
    }
    if (!text.id) return;

    try {
      setAdding(true);
      await dispatch(addFactorToDraft(text.id));
    } catch (e) {
      console.error(e);
    } finally {
      setAdding(false);
    }
  };

  return (
    <article className="text-card">
      <div className="text-card__imageWrapper">
        <img className="text-card__image" src={img} alt={text.title} />
      </div>

      <div className="text-card__body">
        <h3 className="text-card__title">{text.title}</h3>

        <div className="text-card__actions">
          <Link to={`/texts/${text.id}`}>
            <Button className="btn-more" type="button">
              Подробнее
            </Button>
          </Link>

          <Button
            className="btn-more"
            type="button"
            onClick={handleAdd}
            disabled={adding || !text.id}
            style={{ marginLeft: '8px' }}
          >
            {adding ? (
              <>
                <Spinner
                  animation="border"
                  size="sm"
                  style={{ marginRight: 6 }}
                />
                Добавляем...
              </>
            ) : (
              'Добавить'
            )}
          </Button>
        </div>
      </div>
    </article>
  );
};
