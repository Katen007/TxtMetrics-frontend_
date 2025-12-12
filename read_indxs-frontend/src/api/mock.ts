import type {CartIcon, IPaginatedTexts} from "../types/index.ts";

export const TEXTS_MOCK: IPaginatedTexts = {
  total: 3,
  items: [
    {
        "id": 1,
        "image_url": "https://img.freepik.com/free-photo/close-up-pages-book_23-2147779276.jpg?semt=ais_incoming&w=740&q=80",
        "title": "Научная статья1",
        "description": "Мы анализируем научные тексты: проверяем структуру, терминологическую насыщенность и вычисляем индексы читабельности (Флеша, Фога, SMOG). Отчёт покажет, насколько материал удобен для чтения и как его упростить.",
        "price": 125
    },
    {
        "id": 2,
        "image_url": "https://img.freepik.com/free-photo/close-up-pages-book_23-2147779276.jpg?semt=ais_incoming&w=740&q=80",
        "title": "Исторический текст",
        "description": "Подходит для архивных и исторических материалов. Оцениваем длину предложений, редкие конструкции и устаревшие формы, строим метрики читабельности и даём рекомендации по адаптации.",
        "price": 400
    },
    {
        "id": 3,
        "image_url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbPLJrvA88iXHq-WRY9y-MjStAsQC34pgG0w\u0026s",
        "title": "Художественный текст",
        "description": "Анализ художественных фрагментов: ритм и длины фраз, доля диалогов, простота восприятия. Сравниваем индексы с популярной литературой и подсказываем, где можно повысить «легкость» чтения.",
        "price": 500
    },
    {
        "id": 4,
        "image_url": "https://dist-fastdev.ngcdn.ru/directus/45f95763-419f-4db0-b016-d04908b4647a.png",
        "title": "Текст 2",
        "description": "Description1",
        "price": 101
    },
    {
        "id": 5,
        "image_url": "https://img.freepik.com/free-photo/close-up-hand-taking-notes_23-2148950524.jpg?semt=ais_hybrid\u0026w=740\u0026q=80",
        "title": "Текст 3",
        "description": "Description2",
        "price": 102
    },
    {
        "id": 6,
        "image_url": "https://www.hse.ru/data/2017/05/17/1171367341/3iStock-610454902.jpg",
        "title": "Текст 4",
        "description": "Description3",
        "price": 103
    },
    {
        "id": 7,
        "image_url": "https://img.freepik.com/free-photo/close-up-hand-taking-notes_23-2148950524.jpg?semt=ais_hybrid\u0026w=740\u0026q=80",
        "title": "Component 4",
        "description": "Description4",
        "price": 104
    },
    {
        "id": 8,
        "image_url": "https://img.freepik.com/free-photo/close-up-hand-taking-notes_23-2148950524.jpg?semt=ais_hybrid\u0026w=740\u0026q=80",
        "title": "Component 5",
        "description": "Description5",
        "price": 105
    },
  ],
};


export const CART_MOCK: CartIcon ={
  draft_readIndxs_id: -1,
  texts_count: 0
};