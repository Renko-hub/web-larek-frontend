// Page.ts

import { Card } from './Card';
import { IProduct } from './ProductModel';
import { ensureElement } from '../utils/utils';

export class Page {
    private readonly _cardComponent: Card;
    private readonly galleryContainer: HTMLElement;

    constructor(cardComponent: Card) {
        this._cardComponent = cardComponent;
        this.galleryContainer = ensureElement('.gallery') as HTMLElement;
    }

    renderProducts(products: IProduct[]): void {
        // Очистка галереи перед отображением новых товаров
        this.galleryContainer.innerHTML = '';
        // Генерация карточек всех товаров
        const cards = products.map(product => this._cardComponent.render(product));
        // Добавление карточек в контейнер
        cards.forEach(card => this.galleryContainer.appendChild(card));
    }
}