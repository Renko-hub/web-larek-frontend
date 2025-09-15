// CardView.ts

import { cloneTemplate, ensureElement } from '../utils/utils';
import { IProduct } from './ProductModel';

export class CardView {
    private static instance: CardView | null = null;

    private readonly cdnUrl: string;
    private readonly colorsCategory: Record<string, string>;
    private readonly events: any;
    private readonly previewTemplate: HTMLTemplateElement;
    private readonly categorySelector: string = '.card__category';
    private readonly titleSelector: string = '.card__title';
    private readonly imageSelector: string = '.card__image';
    private readonly priceSelector: string = '.card__price';
    private readonly textSelector: string = '.card__text';
    private readonly buttonSelector: string = '.card__button';

    private constructor(events: any, cdnUrl: string, colorsCategory: Record<string, string>) {
        this.events = events;
        this.cdnUrl = cdnUrl;
        this.colorsCategory = colorsCategory;
        this.previewTemplate = ensureElement('#card-preview') as HTMLTemplateElement;
    }

    static getInstance(events: any, cdnUrl: string, colorsCategory: Record<string, string>): CardView {
        return CardView.instance || (CardView.instance = new CardView(events, cdnUrl, colorsCategory));
    }

    render(product: IProduct, onAddToBasket: (p: IProduct) => void, onRemoveFromBasket: (id: string) => void, isInBasket: boolean): HTMLElement {
        const card = cloneTemplate(this.previewTemplate);
    
        // Определяем категории и классы элемента
        const categoryEl = ensureElement(this.categorySelector, card);
        if (categoryEl && product.category) {
            categoryEl.classList.remove(...Object.values(this.colorsCategory));
            categoryEl.classList.add(this.colorsCategory[product.category]);
            categoryEl.textContent = product.category;
        }

        // Название товара
        const titleEl = ensureElement(this.titleSelector, card);
        if (titleEl && product.title) titleEl.textContent = product.title;

        // Изображение товара
        const imgEl = ensureElement(this.imageSelector, card) as HTMLImageElement;
        if (imgEl && product.image) imgEl.src = `${this.cdnUrl}/${product.image}`;

        // Цена товара
        const priceEl = ensureElement(this.priceSelector, card);
        if (priceEl && product.displayText) priceEl.textContent = product.displayText;

        // Описание товара
        const descriptionEl = ensureElement(this.textSelector, card);
        if (descriptionEl && product.description) descriptionEl.textContent = product.description;

        // Кнопка добавляет или удаляет товар из корзины
        const buttonEl = ensureElement(this.buttonSelector, card)!;
        buttonEl.onclick = () => {
            if (isInBasket) {
                onRemoveFromBasket(product.id); // Удаление из корзины
            } else {
                onAddToBasket(product); // Добавление в корзину
            }
            this.events.emit('close-card-modal');
        };

        // Надпись кнопки зависит от наличия товара в корзине
        if (isInBasket) {
            buttonEl.textContent = 'Удалить из корзины';
        }

        return card;
    }
}