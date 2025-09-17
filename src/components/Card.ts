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
        const template = ensureElement('#card-catalog') as HTMLTemplateElement;
        const card = cloneTemplate(template);
        
        // Категория товара
        const categoryEl = ensureElement('.card__category', card);
        if (categoryEl && product.category) {
            categoryEl.classList.remove(...Object.values(this._colorsCategory));
            categoryEl.classList.add(this._colorsCategory[product.category]);
            categoryEl.textContent = product.category;
        }

        // Название товара
        ensureElement('.card__title', card).textContent = product.title;

        // Картинка товара
        const imgEl = ensureElement('.card__image', card) as HTMLImageElement;
        if (imgEl && product.image) imgEl.src = `${this._cdnUrl}/${product.image}`;

        // Цена товара
        ensureElement('.card__price', card).textContent = product.displayText;

        // Открытие модального окна при нажатии на карточку
        card.addEventListener('click', () => this._events.emit('open-product-modal', product));

        return card;
    }
}