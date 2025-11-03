import type { CartIcon, IPaginatedTexts, IText } from '../types';
import { TEXTS_MOCK, CART_MOCK } from './mock';

const API_PREFIX = '/api';

// Получение списка текстов с фильтраией по названию
export const getTexts = async (title: string): Promise<IPaginatedTexts> => {
    const url = title 
        ? `${API_PREFIX}/texts?title=${encodeURIComponent(title)}`
        : `${API_PREFIX}/texts`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Backend is not available');
        }
    const data = await response.json();
    return {
        items: data || [],
        total: data.total || 0
    };
    } catch (error) {
        console.warn('Failed to fetch from backend, using mock data.', error);
        const filteredMockItems = TEXTS_MOCK.items.filter(text =>
            text.title.toLowerCase().includes(title.toLowerCase())
        );
        return { items: filteredMockItems, total: filteredMockItems.length };
    }
};

// Получение одного фактора по ID
export const getTextById = async (id: string): Promise<IText | null> => {
    try {
        const response = await fetch(`${API_PREFIX}/texts/${id}`);
        if (!response.ok) {
            throw new Error('Backend is not available');
        }
        return await response.json();
    } catch (error) {
        console.warn(`Failed to fetch text ${id}, using mock data.`, error);
        const text = TEXTS_MOCK.items.find(f => f.id === parseInt(id));
        return text || null;
    }
};

export const getCardInfo = async (): Promise<CartIcon> => {
    try{
        const response = await fetch(`${API_PREFIX}/readindxs/my-text-cart`);
        if (!response.ok) {
            throw new Error('Backend is not available');
        }
        return await response.json();
    }catch{
        console.warn(`Failed to fetch card data, using mock data.`);
        return CART_MOCK || null;
    }
}