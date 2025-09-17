// Page.ts

import { Card } from './Card';
import { IProduct } from './ProductModel';
import { ensureElement } from '../utils/utils';

export class Page {
    private readonly _cardComponent: Card;
    private readonly galleryContainer: HTMLElement;
    private readonly events: any;

    constructor(events: any, cdnUrl: string, colorsCategory: Record<string, string>) {
        this._cardComponent = new Card(cdnUrl, events, colorsCategory);
        this.galleryContainer = ensureElement('.gallery') as HTMLElement;
        this.events = events;
    }

    createProductCard(product: IProduct): HTMLElement {
        return this._cardComponent.render(product);
    }

    addProductToGallery(cardElement: HTMLElement): void {
        this.galleryContainer.appendChild(cardElement);
    }

    clearGallery(): void {
        this.galleryContainer.innerHTML = '';
    }

    renderProducts(products: IProduct[]): void {
        this.clearGallery();
        const cards = products.map(product => this.createProductCard(product));
        cards.forEach(card => this.addProductToGallery(card));
    }
}