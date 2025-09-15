// Page.ts

import { Card } from './Card';
import { IProduct } from './ProductModel';

export class Page {
    private readonly _cardComponent: Card;
    private readonly galleryContainer: HTMLElement;

    constructor(cardComponent: Card) {
        this._cardComponent = cardComponent;
        this.galleryContainer = document.querySelector('.gallery') as HTMLElement;
    }

    // Рендеринг общего списка карточек
    renderProducts(products: IProduct[]): void {
        this.galleryContainer.innerHTML = '';
        const cards = products.map(product => this._cardComponent.render(product));
        cards.forEach(card => this.galleryContainer.appendChild(card));
    }
}