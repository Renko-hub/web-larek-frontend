// Page.ts

import { Card } from './Card';
import { IProduct } from './ProductModel';
import { ensureElement } from '../utils/utils';
import { CDN_URL, colorsCategory } from '../utils/constants';

export class Page {
    private readonly _events: any;
    private readonly galleryContainer: HTMLElement;

    constructor(events: any) {
        this._events = events;
        this.galleryContainer = ensureElement('.gallery') as HTMLElement;
    }

    addProductToGallery(cardElement: HTMLElement): void {
        this.galleryContainer.appendChild(cardElement);
    }

    clearGallery(): void {
        this.galleryContainer.innerHTML = '';
    }

    renderProducts(products: IProduct[]): void {
        this.clearGallery();
        const cards = products.map(product => {
            const card = new Card(CDN_URL, this._events, colorsCategory);
            return card.render(product);
        });
        cards.forEach(card => this.addProductToGallery(card));
    }
}