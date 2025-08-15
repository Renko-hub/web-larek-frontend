// Page.ts

import { ensureElement, cloneTemplate } from '../utils/utils';
import { CDN_URL, categoryClasses } from '../utils/constants';
import { ProductModel } from './ProductModel';
import { CardView } from './CardView';

type CategoryMapping = Record<string, string>;

const priceText = (price?: number): string =>
    typeof price === 'number'
        ? `${price} синапсов`
        : 'Бесплатно';

const updateCategoryStyle = (
    el: HTMLElement,
    mapping: CategoryMapping,
    category: string
): void => {
    const currentClass = Array.from(el.classList)
        .filter(cls => cls.includes('card__category'))
        .pop() ?? '';
    const mappedClass = mapping[category.trim().toLocaleLowerCase()];
    el.classList.replace(currentClass, mappedClass || '');
};

export class Page {
    private readonly events: any;
    private readonly cardView: CardView;

    constructor(events: any, cardView: CardView) {
        this.events = events;
        this.cardView = cardView;
    }

    showGallery(): void {
    const gallery = ensureElement('.gallery');
    const template = ensureElement('#card-catalog')! as HTMLTemplateElement;
    const products = ProductModel.getInstance(this.events).get();

    if (!gallery) return;

    gallery.innerHTML = '';

    for (const product of products) {
        const clonedElement = cloneTemplate(template);

        const titleEl = ensureElement('.card__title', clonedElement);
        if (titleEl) titleEl.textContent = product.title;

        const categoryEl = ensureElement('.card__category', clonedElement);
        if (categoryEl) categoryEl.textContent = product.category;

        const priceEl = ensureElement('.card__price', clonedElement);
        if (priceEl) priceEl.textContent = priceText(product.price);

        const imageEl = ensureElement('.card__image', clonedElement) as HTMLImageElement | null;
        if (imageEl) imageEl.src = `${CDN_URL}/${product.image}`;

        if (categoryEl) {
            updateCategoryStyle(categoryEl, categoryClasses, product.category);
        }

        clonedElement.addEventListener('click', () => this.cardView.showProductCard(product));
        gallery.appendChild(clonedElement);
    }
}
}