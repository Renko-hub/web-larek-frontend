// CardView.ts

import { cloneTemplate, ensureElement } from '../utils/utils';
import { IProduct } from './ProductModel';
import { Card } from './Card'; // Импортируем класс Card целиком

/**
 * Представление детализированной карточки товара.
 */
export class CardView {
    private static instance: CardView | null = null;

    private readonly cdnUrl: string;
    private readonly colorsCategory: Record<string, string>;
    private readonly events: any;
    private readonly previewTemplate: HTMLTemplateElement;
    private readonly cardTextSelector: string = '.card__text';
    private readonly cardButtonSelector: string = '.card__button';

    private constructor(events: any, cdnUrl: string, colorsCategory: Record<string, string>) {
        this.events = events;
        this.cdnUrl = cdnUrl;
        this.colorsCategory = colorsCategory;
        this.previewTemplate = ensureElement('#card-preview') as HTMLTemplateElement;
        if (!this.previewTemplate) throw new Error("Шаблон #card-preview не найден");
    }

    // Получение единственного экземпляра компонента
    static getInstance(events: any, cdnUrl: string, colorsCategory: Record<string, string>): CardView {
        return CardView.instance || (CardView.instance = new CardView(events, cdnUrl, colorsCategory));
    }

    /**
     * Отображает карточку товара в модальном окне.
     */
    render(product: IProduct, onAddToBasket: (p: IProduct) => void, onRemoveFromBasket: (id: string) => void, isInBasket: boolean): HTMLElement {
        const card = cloneTemplate(this.previewTemplate);
        Card.fillProductCard(card, product, this.cdnUrl, this.colorsCategory); // Правильно вызван статический метод

        const textEl = ensureElement(this.cardTextSelector, card);
        if (textEl && product.description) textEl.textContent = product.description;
    
        const btn = ensureElement(this.cardButtonSelector, card)!;
        btn.onclick = () => {
            if (isInBasket) {
                onRemoveFromBasket(product.id);
            } else {
                onAddToBasket(product);
            }
            this.events.emit('close-card-modal');
        };
    
        if (isInBasket) btn.textContent = 'Удалить из корзины';
    
        return card;
    }

    /**
     * Генерирует базовую карточку товара без привязанных событий.
     */
    createBaseCardWithoutEvents(product: IProduct): HTMLElement {
        const card = cloneTemplate(this.previewTemplate);
        Card.fillProductCard(card, product, this.cdnUrl, this.colorsCategory); // Правильно вызван статический метод
        return card;
    }
}