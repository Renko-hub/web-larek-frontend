// Card.ts

import { cloneTemplate, ensureElement } from '../utils/utils';
import { IProduct } from './ProductModel';

/**
 * Компонент представления карточек товаров.
 */
export class Card {
    private readonly _cdnUrl: string; // URL для изображений товаров
    private readonly _events: any; // События приложения
    private readonly _colorsCategory: Record<string, string>; // Цветовая палитра категорий товаров
    private galleryContainer: HTMLElement; // Контейнер галереи товаров

    constructor(cdnUrl: string, events: any, colorsCategory: Record<string, string>) {
        this._cdnUrl = cdnUrl;
        this._events = events;
        this._colorsCategory = colorsCategory;
        this.galleryContainer = ensureElement('.gallery');
    }

    // Рендеринг набора товаров на странице
    renderProducts(products: IProduct | IProduct[]): void {
        this.galleryContainer.innerHTML = ''; // Очищаем контейнер перед рендером
        const items = Array.isArray(products) ? products : [products];
        for (const prod of items) {
            const card = Card.renderProductCard(this._cdnUrl, prod, this._events, this._colorsCategory);
            this.galleryContainer.appendChild(card); // Добавляем новую карточку
        }
    }

    // Статический метод рендера отдельной карточки товара
    static renderProductCard(
        cdnUrl: string,
        product: IProduct,
        events: any,
        colorsCategory: Record<string, string>,
    ): HTMLElement {
        const template = ensureElement('#card-catalog') as HTMLTemplateElement;
        const card = cloneTemplate(template);
        Card.fillProductCard(card, product, cdnUrl, colorsCategory);
        card.addEventListener('click', () => events.emit('open-product-modal', product));
        return card;
    }

    // Заполнение свойств карточки товара
    static fillProductCard(
        element: HTMLElement,
        product: Partial<IProduct>,
        cdnUrl: string,
        colorsCategory: Record<string, string>,
        opts: { skipCategory?: boolean; skipImage?: boolean } = {},
    ): void {
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