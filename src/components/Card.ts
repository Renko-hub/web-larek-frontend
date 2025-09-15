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

    // Создаёт и возвращает элемент карточки товара
    render(product: IProduct): HTMLElement {
        const template = ensureElement('#card-catalog') as HTMLTemplateElement;
        const card = cloneTemplate(template);
        Card.fillProductCard(card, product, this._cdnUrl, this._colorsCategory);
        card.addEventListener('click', () => this._events.emit('open-product-modal', product));
        return card;
    }

    // Заполняет поля карточки
    static fillProductCard(element: HTMLElement, product: Partial<IProduct>, cdnUrl: string, colorsCategory: Record<string, string>, opts: { skipCategory?: boolean; skipImage?: boolean } = {}) {
        const { category, title, image, price } = product;
        if (!opts.skipCategory && category) {
            const catEl = ensureElement('.card__category', element);
            if (catEl) {
                catEl.classList.remove(...Object.values(colorsCategory));
                catEl.classList.add(colorsCategory[category]);
                catEl.textContent = category;
            }
        }
        const titleEl = ensureElement('.card__title', element);
        if (titleEl && title) titleEl.textContent = title;
        if (!opts.skipImage && image) {
            const imgEl = ensureElement('.card__image', element) as HTMLImageElement;
            if (imgEl) imgEl.src = `${cdnUrl}/${image}`;
        }
        const priceEl = ensureElement('.card__price', element);
        if (priceEl && typeof price !== 'undefined') {
            priceEl.textContent = typeof price === 'number' ? `${price} синапсов` : 'Бесплатно';
        }
    }
}