import { useState, useEffect } from 'react';
import { Container, Spinner, Form, Badge, Image } from 'react-bootstrap';
import { TextCard } from '../components/TextCard';
import { useSelector, useDispatch } from 'react-redux';
import { setServiceFilter } from '../store/slices/filterSlice';
import { fetchTextsList } from '../store/slices/textsSlice';
import { api } from '../api';
import type { HandlerCartIconResponse } from '../api/Api';
import './styles/TextsListPage.css';
import type { RootState, AppDispatch } from '../store';

export const TextsListPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  // фильтр из redux
  const filter = useSelector((state: RootState) => state.filter.serviceFilter);

  // тексты и загрузка — из textsSlice
  const { list: texts, loading } = useSelector((state: RootState) => state.texts);

  // данные по "корзине" (черновик индексов)
  const [cartData, setCartData] = useState<HandlerCartIconResponse | null>(null);

  // загрузка текстов при изменении фильтра
  useEffect(() => {
    // если фильтр пустой, можно передавать undefined или {}
    const payload = filter ? { title: filter } : {};
    // @ts-ignore — если ругается на тип undefined | {}
    dispatch(fetchTextsList(payload as { title?: string }));
  }, [dispatch, filter]);

  // загрузка информации о текущей заявке (значок корзины)
  useEffect(() => {
    api.readindxs
      .myTextCartList()
      .then((resp) => setCartData(resp.data))
      .catch((err) => {
        console.error('Ошибка загрузки информации о заявке:', err);
      });
  }, []);

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const payload = filter ? { title: filter } : {};
    // @ts-ignore
    dispatch(fetchTextsList(payload as { title?: string }));
  };

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

      {/* плавающая "корзина" с текущей заявкой */}
      <div className="readIndxs" title="Текущая заявка">
        <Image
          src="http://localhost:9000/img/img/cart2.svg"
          className="readIndxs__icon"
          width={24}
          height={24}
          alt="Корзина"
        />
        {cartData?.texts_count && cartData.texts_count > 0 ? (
          <Badge className="readIndxs__badge">{cartData.texts_count}</Badge>
        ) : null}
      </div>
    </div>
  );
};
