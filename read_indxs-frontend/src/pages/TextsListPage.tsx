import { useState, useEffect } from 'react';
import { Container, Spinner, Form, Badge, Image } from 'react-bootstrap';
import { TextCard } from '../components/TextCard';
import { getTexts, getCardInfo } from '../api/textApi';
import { type CartIcon, type IText } from '../types';
import './styles/TextsListPage.css';

export const TextsListPage = () => {
    const [texts, setTexts] = useState<IText[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [cartData, setCartData] = useState<CartIcon>();

    const fetchTexts = (filterTitle: string) => {
        setLoading(true);
        getTexts(filterTitle)
            .then(data => {
                if (Array.isArray(data.items)) {
                    setTexts(data.items);
                } else {
                    console.error("Получены неверные данные:", data);
                    setTexts([]);
                }
            })
            .finally(() => setLoading(false));
    };
    const fetchCard = ()=>{
        getCardInfo().then(data => {
            setCartData(data);
        })
    }

    useEffect(() => {
        fetchTexts('');
        fetchCard()
    }, []);

    const handleSearchSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        fetchTexts(searchTerm);
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
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Form>

                {/* сетка карточек */}
                {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" style={{ color: 'var(--blue)' }} />
                    </div>
                ) : (
                    <section className="grid">
                        {texts.map(text => (
                            <TextCard key={text.id} text={text} />
                        ))}
                    </section>
                )}
            </Container>

            {/* плавающая корзина */}
            <div className="readIndxs" title="Текущая заявка">
                <Image
                    src="http://localhost:9000/img/img/cart2.svg"
                    className="readIndxs__icon"
                    width={24}
                    height={24}
                    alt="Корзина"
                />
                {(cartData?.texts_count && cartData.texts_count > 0) ? (
                    <Badge className="readIndxs__badge">{cartData.texts_count}</Badge>
                ):
                <></>}
            </div>
        </div>
    );
};
