// CardView.ts

import { cloneTemplate, ensureElement } from '../utils/utils';
import { IProduct } from './ProductModel';

export class CardView {
    private static instance: CardView | null = null;

    private readonly cdnUrl: string;
    private readonly colorsCategory: Record<string, string>;
    private readonly events: any;
    private readonly previewTemplate: HTMLTemplateElement;

    constructor(events: any, cdnUrl: string, colorsCategory: Record<string, string>) {
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

        // Отображение категории товара
        const categoryEl = ensureElement('.card__category', card);
        if (categoryEl && product.category) {
            categoryEl.classList.remove(...Object.values(this.colorsCategory));
            categoryEl.classList.add(this.colorsCategory[product.category]);
            categoryEl.textContent = product.category;
        }

        // Название товара
        ensureElement('.card__title', card).textContent = product.title;

        // Изображение товара
        const imgEl = ensureElement('.card__image', card) as HTMLImageElement;
        if (imgEl && product.image) imgEl.src = `${this.cdnUrl}/${product.image}`;

        // Цена товара
        ensureElement('.card__price', card).textContent = product.displayText;

        // Кнопка покупки / удаления из корзины
        const buttonEl = ensureElement('.card__button', card)!;
        buttonEl.onclick = () => {
            if (isInBasket) {
                onRemoveFromBasket(product.id);
            } else {
                onAddToBasket(product);
            }
            this.events.emit('close-card-modal');
        };

        if (isInBasket) buttonEl.textContent = 'Удалить из корзины';

        return card;
    }
}