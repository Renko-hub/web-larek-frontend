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

    /**
     * Создает карточку продукта и добавляет её в галерею.
     *
     * @param product объект продукта
     */
    public createAndAddProductCard(product: IProduct): void {
        const cardElement = this._cardComponent.render(product); // Рендерим карточку
        this.addProductToGallery(cardElement); // Добавляем её в галерею
    }

    /**
     * Добавляет готовый элемент карточки в галерею.
     *
     * @param cardElement элемент карточки продукта
     */
    public addProductToGallery(cardElement: HTMLElement): void {
        this.galleryContainer.appendChild(cardElement); // Реализует работу с DOM
    }

    /**
     * Очищает галерею от всех карточек.
     */
    public clearGallery(): void {
        this.galleryContainer.innerHTML = ''; // Очистка галереи
    }

    /**
     * Рендерит коллекцию продуктов в галерею.
     *
     * @param products массив объектов продуктов
     */
    public renderProducts(products: IProduct[]): void {
        this.clearGallery(); // Сначала очищаем галерею
        const cards = products.map(product => this.createProductCard(product));
        cards.forEach(card => this.addProductToGallery(card));
    }

    /**
     * Внутренняя вспомогательная функция для рендеринга одной карточки продукта.
     *
     * @param product объект продукта
     * @returns элемент карточки продукта
     */
    private createProductCard(product: IProduct): HTMLElement {
        return this._cardComponent.render(product);
    }
}