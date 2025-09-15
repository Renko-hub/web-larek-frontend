// Card.ts

import { cloneTemplate, ensureElement } from '../utils/utils';
import { IProduct } from './ProductModel';

export class Card {
    private readonly _cdnUrl: string;
    private readonly _events: any;
    private readonly _colorsCategory: Record<string, string>;

    // Объект для ссылок на элементы DOM
    private elements: {
        category: HTMLElement | null;
        title: HTMLElement | null;
        image: HTMLImageElement | null;
        price: HTMLElement | null;
    };

    constructor(cdnUrl: string, events: any, colorsCategory: Record<string, string>) {
        this._cdnUrl = cdnUrl;
        this._events = events;
        this._colorsCategory = colorsCategory;
    }

    render(product: IProduct): HTMLElement {
        // Получаем шаблон карточки товара
        const template = ensureElement('#card-catalog') as HTMLTemplateElement;
        // Создаем копию шаблона
        const card = cloneTemplate(template);

        // Сохраняем ссылки на элементы DOM в объект
        this.elements = {
            category: ensureElement('.card__category', card),
            title: ensureElement('.card__title', card),
            image: ensureElement('.card__image', card) as HTMLImageElement,
            price: ensureElement('.card__price', card)
        };

        // Заполняем поля карточки
        this.populateCardDetails(product);

        // Подключаем событие клика на открытие модала - не смог обойти проблему с добавлением в конструктор 
        card.addEventListener('click', () => this._events.emit('open-product-modal', product));
        return card;
    }

    private populateCardDetails(product: Partial<IProduct>): void {
        const { category, title, image, displayText } = product;

        // Категория товара
        if (this.elements.category && category) {
            this.elements.category.classList.remove(...Object.values(this._colorsCategory));
            this.elements.category.classList.add(this._colorsCategory[category]);
            this.elements.category.textContent = category;
        }

        // Заголовок товара
        if (this.elements.title && title) this.elements.title.textContent = title;

        // Картинка товара
        if (this.elements.image && image) this.elements.image.src = `${this._cdnUrl}/${image}`;

        // Цена товара
        if (this.elements.price && displayText) this.elements.price.textContent = displayText;
    }
}