import type {IPaginatedTexts} from "../types/index.ts";

export const TEXTS_MOCK: IPaginatedTexts = {
  total: 3,
  items: [
    {
      id: 101,
      title: "Курение",
      imageUrl: "http://localhost:9000/factors/Images/smoking.png",
      description: `Мы анализируем научные тексты: проверяем структуру,
терминологическую насыщенность и вычисляем индексы читабельности (Флеша, Фога,
SMOG). Отчёт покажет, насколько материал удобен для чтения и как его упростить.`,
      price: 125,
      status: false,
    },
    {
      id: 102,
      title: "Алкоголизм",
      description: "Алкоголизм увеличивает риск переломов.",
      imageUrl:"http://localhost:9000/factors/Images/alcoholism.png",
      price: 0.8,
      status: false,
    },
    {
      id: 103,
      title: "Предыдущие переломы",
      description: "Предыдущие переломы - это основополагающая причина будущих переломов.",
      imageUrl:"http://localhost:9000/factors/Images/previous fractures.png",
      price: 4.0,
      status: false,
    },
  ],
};