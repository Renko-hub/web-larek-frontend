// Page.ts

import { ensureElement } from '../utils/utils';

export class Page {
    private readonly galleryContainer: HTMLElement;

    constructor() {
        this.galleryContainer = ensureElement('.gallery') as HTMLElement;
    }

    /**
     * Метод для добавления единственной карточки товара в галерею.
     */
    public addSingleProductToGallery(cardElement: HTMLElement): void {
        this.galleryContainer.appendChild(cardElement);
    }

    /**
     * Метод для обновления всей галереи продуктов (очистка + добавление всех карточек заново)
     */
    public updateProductsGallery(cardsElements: HTMLElement[]): void {
        this.clearGallery();
        cardsElements.forEach((element) => this.galleryContainer.appendChild(element));
    }

    /**
     * Очистка галереи перед добавлением новых карточек.
     */
    public clearGallery(): void {
        this.galleryContainer.innerHTML = '';
    }
}