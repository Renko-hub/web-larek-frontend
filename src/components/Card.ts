// Card.ts
import { cloneTemplate, ensureElement } from '../utils/utils';
import { colorsСategory } from '../utils/constants';
import { IProduct } from './ProductModel';

export class Card {
    private readonly _cdnUrl: string; 

    constructor(cdnUrl: string) {
        this._cdnUrl = cdnUrl;
    }

    // Заполняет элементы страницы значениями свойств продукта
    private fillElement(selector: string, element: HTMLElement, value: any, imageSrc?: boolean, categoryColor?: boolean) {
        const target = ensureElement(selector, element);
        if (!target) return;
    
        if (imageSrc) {
            (target as HTMLImageElement).src = value;
        } else if (categoryColor) {
            target.className = '';
            target.classList.add('card__category', colorsСategory[value]); // Применяется категория цвета
            target.textContent = value;
        } else {
            target.textContent = value;
        }
    }

    // Рендерит карточку товара с указанием цены и описанием
    private renderCard(product: IProduct, includeDescription: boolean, setDataAttr: boolean): HTMLElement {
        let templateId = '#card-catalog'; // Шаблон каталога по умолчанию
        
        if (includeDescription) {
            templateId = '#card-preview'; // Переходим на шаблон полной карточки
        }

        const template = ensureElement(templateId) as HTMLTemplateElement;
        const card = cloneTemplate(template);

        this.fillElement('.card__category', card, product.category, undefined, true); // Цвет категории
        this.fillElement('.card__title', card, product.title); // Заголовок товара
        this.fillElement('.card__image', card, `${this._cdnUrl}/${product.image}`, true); // Изображение товара
        this.fillElement('.card__price', card, typeof product.price === 'number' ? `${product.price} синапсов` : 'Бесплатно'); // Цена товара

        if (includeDescription) {
            this.fillElement('.card__text', card, product.description || ''); // Дополнительное описание
        }

        if (setDataAttr) {
            card.setAttribute('data-product-id', JSON.stringify(product)); // Атрибут с информацией о товаре
        }

        return card;
    }

    // Рендер простой карточки товара (без описания)
    public renderSimpleCard(product: IProduct): HTMLElement {
        return this.renderCard(product, false, true);
    }

    // Рендер полной карточки товара (с описанием)
    public renderFullCard(product: IProduct): HTMLElement {
        return this.renderCard(product, true, false);
    }
}