// Card.ts

import { cloneTemplate, ensureElement } from '../utils/utils';
import { IProduct } from './ProductModel';

export class Card {
    private readonly _cdnUrl: string;
    private readonly _events: any;
    private readonly _colorsCategory: Record<string, string>;

    constructor(cdnUrl: string, events: any, colorsCategory: Record<string, string>) {
        this._cdnUrl = cdnUrl;
        this._events = events;
        this._colorsCategory = colorsCategory;
    }

    render(product: IProduct): HTMLElement {
        // Получаем шаблон карточки товара
        const template = ensureElement('#card-catalog') as HTMLTemplateElement;
        // Создаем копию шаблона
        const card = cloneTemplate(template);
        // Заполняем поля карточки
        Card.populateCardDetails(card, product, this._cdnUrl, this._colorsCategory);
        // Подключаем событие клика на открытие модала
        card.addEventListener('click', () => this._events.emit('open-product-modal', product));
        return card;
    }

    static populateCardDetails(element: HTMLElement, product: Partial<IProduct>, cdnUrl: string, colorsCategory: Record<string, string>) {
        const { category, title, image, displayText } = product;

        // Устанавливаем категорию товара
        const catEl = ensureElement('.card__category', element);
        if (catEl && category) {
            catEl.classList.remove(...Object.values(colorsCategory));
            catEl.classList.add(colorsCategory[category]);
            catEl.textContent = category;
        }

        // Устанавливаем заголовок товара
        const titleEl = ensureElement('.card__title', element);
        if (titleEl && title) titleEl.textContent = title;

        // Устанавливаем картинку товара
        const imgEl = ensureElement('.card__image', element) as HTMLImageElement;
        if (imgEl && image) imgEl.src = `${cdnUrl}/${image}`;

        // Теперь используем готовую строку цены из модели
        const priceEl = ensureElement('.card__price', element);
        if (priceEl && displayText) priceEl.textContent = displayText;
    }
}