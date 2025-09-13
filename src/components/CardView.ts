// CardView.ts

import { cloneTemplate, ensureElement } from '../utils/utils';
import { IProduct } from './ProductModel';
import { Card } from './Card';

/**
 * Представление детализированной карточки товара.
 */
export class CardView {
    private static instance: CardView | null = null;

    private readonly cdnUrl: string;
    private readonly colorsCategory: Record<string, string>;
    private events: any;
    private previewTemplate: HTMLTemplateElement; // Шаблон карточки предварительного просмотра

    constructor(events: any, cdnUrl: string, colorsCategory: Record<string, string>) {
        this.events = events;
        this.cdnUrl = cdnUrl;
        this.colorsCategory = colorsCategory;
        this.previewTemplate = ensureElement('#card-preview') as HTMLTemplateElement;
    }

    // Возвращает уникальный экземпляр компонента
    static getInstance(events: any, cdnUrl: string, colorsCategory: Record<string, string>): CardView {
        return CardView.instance || (CardView.instance = new CardView(events, cdnUrl, colorsCategory));
    }

    // Отображает карточку товара в модальном окне
    render(product: IProduct, onAddToBasket: (p: IProduct) => void, onRemoveFromBasket: (id: string) => void, isInBasket: boolean): HTMLElement {
        const card = cloneTemplate(this.previewTemplate);
        Card.fillProductCard(card, product, this.cdnUrl, this.colorsCategory);

        const textEl = ensureElement('.card__text', card);
        if (textEl && product.description) textEl.textContent = product.description;

        const btn = ensureElement('.card__button', card)!;
        if (isInBasket) {
            btn.textContent = 'Удалить из корзины';
            btn.onclick = () => {
                onRemoveFromBasket(product.id);
                this.events.emit('close-card-modal');
            };
        } else {
            btn.onclick = () => onAddToBasket(product);
        }
        return card;
    }

    // Генерирует базовую карточку товара без привязанных событий
    createBaseCardWithoutEvents(product: IProduct): HTMLElement {
        const card = cloneTemplate(this.previewTemplate);
        Card.fillProductCard(card, product, this.cdnUrl, this.colorsCategory);
        return card;
    }
}