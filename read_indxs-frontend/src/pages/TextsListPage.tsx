// src/pages/TextsListPage.tsx
import { useEffect } from 'react';
import { Container, Spinner, Form, Badge, Image } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { TextCard } from '../components/TextCard';
import { setServiceFilter } from '../store/slices/filterSlice';
import { fetchTextsList } from '../store/slices/textsSlice';
import { fetchCartBadge } from '../store/slices/cartSlice';

import './styles/TextsListPage.css';
import type { RootState, AppDispatch } from '../store';

export const TextsListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // фильтр из redux
  const filter = useSelector((state: RootState) => state.filter.serviceFilter);
  const { list: texts, loading } = useSelector((state: RootState) => state.texts);
  const { readIndxs_id, count } = useSelector((state: RootState) => state.cart);
  const { isAuthenticated } = useSelector((state: RootState) => state.user);

  // загрузка текстов при изменении фильтра
  useEffect(() => {
    const payload = filter ? { title: filter } : {};
    // @ts-ignore — тип фильтра может быть {}
    dispatch(fetchTextsList(payload as { title?: string }));
  }, [dispatch, filter]);

  // подтягиваем информацию о текущем черновике
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartBadge());
    }
  }, [dispatch, isAuthenticated]);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const payload = filter ? { title: filter } : {};
    // @ts-ignore
    dispatch(fetchTextsList(payload as { title?: string }));
  };

  const handleOpenDraft = () => {
    if (!readIndxs_id) return;
    navigate(`/readIndxs/${readIndxs_id}`);
  };

  const hasDraft = !!readIndxs_id;

  return (
    <div className="texts-page-shell">
      <Container className="texts-container">
        {/* заголовок */}
        <h1 className="page-title--small">Тексты</h1>

        {/* поиск */}
        <Form className="search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Поиск текстов"
            value={filter}
            onChange={(e) => dispatch(setServiceFilter(e.target.value))}
          />
        </Form>

        {/* сетка карточек */}
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" style={{ color: 'var(--blue)' }} />
          </div>
        ) : (
          <section className="grid">
            {texts.map((text) => (
              <TextCard key={text.id} text={text} />
            ))}
          </section>
        )}
      </Container>

      {/* плавающая кнопка перехода к черновику заявки */}
      {isAuthenticated && (
        <div
          className="readIndxs"
          title={
            hasDraft
              ? 'Перейти к текущей заявке'
              : 'Черновик заявки отсутствует'
          }
          onClick={hasDraft ? handleOpenDraft : undefined}
          style={{
            cursor: hasDraft ? 'pointer' : 'not-allowed',
            opacity: hasDraft ? 1 : 0.5,
          }}
        >
          <Image
            src="http://localhost:9000/img/img/cart2.svg"
            className="readIndxs__icon"
            width={24}
            height={24}
            alt="Корзина"
          />
          {count > 0 && (
            <Badge className="readIndxs__badge">{count}</Badge>
          )}
        </div>
      )}
    </div>
  );
};
