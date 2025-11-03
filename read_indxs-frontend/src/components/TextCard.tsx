import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import type { IText } from '../types';
import './styles/TextCard.css';

export const DefaultImage = 'http://localhost:9000/img/img/his.jpg';

interface TextCardProps {
    text: IText;
}

export const TextCard: React.FC<TextCardProps> = ({ text }) => {
    const img = text.image_url || (text as any).imageUrl || DefaultImage;

    return (
        <article className="text-card" data-id={text.id}>
            <Link to={`/texts/${text.id}`} className="text-card__img-wrapper">
                <img className="text-card__img" src={img} alt={text.title} />
            </Link>

            <div className="text-card__body">
                <h3 className="text-card__title">{text.title}</h3>

                <div className="text-card__actions">
                    <Link to={`/texts/${text.id}`}>
                        <Button className="btn-more" type="button">
                            Подробнее
                        </Button>
                    </Link>
                </div>
            </div>
        </article>
    );
};
