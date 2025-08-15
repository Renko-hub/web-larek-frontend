// CardView.ts

import { Modal } from './Modal';
import { ensureElement, cloneTemplate } from '../utils/utils';
import { IProduct } from './ProductModel';

export class CardView {
    private static instance: CardView | null = null;
    private readonly emitter: any;
    private readonly cdnUrl: string;
    private readonly categoryClasses: Record<string, string>;
    private inBasketIds: Set<string> = new Set();

    private constructor(emitter: any, cdnUrl: string, categoryClasses: Record<string, string>) {
        this.emitter = emitter;
        this.cdnUrl = cdnUrl;
        this.categoryClasses = categoryClasses;
        this.emitter.on('product:in-basket', (ids: string[]) => this.inBasketIds = new Set(ids));
    }

    public static getInstance(emitter: any, cdnUrl: string, categoryClasses: Record<string, string>): CardView {
        return CardView.instance || (CardView.instance = new CardView(emitter, cdnUrl, categoryClasses));
    }

    public showProductCard(product: IProduct | null) {
        if (!product) return;

        const card = cloneTemplate('#card-preview')!;
        ensureElement('.card__title', card)!.textContent = product.title;
        ensureElement('.card__category', card)!.textContent = product.category;
        const imgEl = ensureElement('.card__image', card)! as HTMLImageElement;
        imgEl.src = `${this.cdnUrl}/${product.image}`;
        ensureElement('.card__price', card)!.textContent = typeof product.price === 'number' ? `${product.price} синапсов` : 'Бесплатно';

        const categoryElement = ensureElement('.card__category', card);
        const oldClass = [...categoryElement.classList].find(cn => cn.startsWith('card__category_')) || '';
        const newClass = this.categoryClasses[product.category.trim().toLocaleLowerCase()] || '';
        categoryElement.classList.replace(oldClass, newClass);

        const button = ensureElement('.button.card__button', card) as HTMLButtonElement;
        const isInCart = this.inBasketIds.has(product.id);
        button.textContent = isInCart ? 'Удалить' : 'Купить';

        button.onclick = () => {
            if (isInCart) {
                this.emitter.emit('basket:remove-product', { id: product.id });
            } else {
                this.emitter.emit('basket:add-product', product);
            }
            Modal.getInstance('#modal-container').close();
        };

        Modal.getInstance('#modal-container').setContent(card);
        Modal.getInstance('#modal-container').open();
    }

    updateProductCard(product: IProduct) {
        this.showProductCard(product);
    }
}