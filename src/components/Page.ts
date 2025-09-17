// Page.ts

import { ensureElement } from '../utils/utils';

export class Page {
    private readonly _events: any;
    private readonly galleryContainer: HTMLElement;

    constructor(events: any) {
        this._events = events;
        this.galleryContainer = ensureElement('.gallery') as HTMLElement;
    }

    /**
     * Метод для добавления карточки товара в галерею.
     */
    public addProductToGallery(cardElement: HTMLElement): void {
        this.galleryContainer.appendChild(cardElement);
    }

    /**
     * Очистка галереи перед добавлением новых карточек.
     */
    public clearGallery(): void {
        this.galleryContainer.innerHTML = '';
    }
}