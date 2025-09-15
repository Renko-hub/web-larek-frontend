// CardView.ts

import { cloneTemplate, ensureElement } from '../utils/utils';
import { IProduct } from './ProductModel';

export class CardView {
    private static instance: CardView | null = null;

    private readonly cdnUrl: string;
    private readonly colorsCategory: Record<string, string>;
    private readonly events: any;
    private readonly previewTemplate: HTMLTemplateElement;

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
    
        // Устанавливаем категорию товара
        const categoryEl = ensureElement('.card__category', card);
        if (categoryEl && product.category) {
            categoryEl.classList.remove(...Object.values(this.colorsCategory));
            categoryEl.classList.add(this.colorsCategory[product.category]);
            categoryEl.textContent = product.category;
        }

        // Устанавливаем название товара
        const titleEl = ensureElement('.card__title', card);
        if (titleEl && product.title) titleEl.textContent = product.title;

        // Устанавливаем изображение товара
        const imgEl = ensureElement('.card__image', card) as HTMLImageElement;
        if (imgEl && product.image) imgEl.src = `${this.cdnUrl}/${product.image}`;

        // Устанавливаем цену товара (готовая строка из модели)
        const priceEl = ensureElement('.card__price', card);
        if (priceEl && product.displayText) priceEl.textContent = product.displayText;

        // Устанавливаем описание товара
        const descriptionEl = ensureElement('.card__text', card);
        if (descriptionEl && product.description) descriptionEl.textContent = product.description;

        // Настраиваем кнопку добавления / удаления из корзины
        const buttonEl = ensureElement('.card__button', card)!;
        buttonEl.onclick = () => {
            if (isInBasket) {
                onRemoveFromBasket(product.id); // Если товар уже в корзине, удаляем его
            } else {
                onAddToBasket(product); // Иначе добавляем товар в корзину
            }
            this.events.emit('close-card-modal'); // Закрываем окно карты товара
        };

        // Меняем надпись на кнопке в зависимости от состояния корзины
        if (isInBasket) {
            buttonEl.textContent = 'Удалить из корзины'; // Если товар в корзине, кнопка должна удалять
        }

        return card;
    }
}