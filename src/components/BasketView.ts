// BasketView.ts

import { Modal } from './Modal';
import { ensureElement, cloneTemplate } from '../utils/utils';
import { IProduct } from './ProductModel';

export class BasketView {
    private static instance: BasketView | null = null;
    private readonly emitter: any;
    private readonly cdnUrl: string;
    private readonly categoryClasses: Record<string, string>;

    private constructor(
        emitter: any,
        cdnUrl: string,
        categoryClasses: Record<string, string>,
    ) {
        this.emitter = emitter;
        this.cdnUrl = cdnUrl;
        this.categoryClasses = categoryClasses;
    }

    public static getInstance(
        emitter: any,
        cdnUrl: string,
        categoryClasses: Record<string, string>,
    ): BasketView {
        return BasketView.instance || (BasketView.instance = new BasketView(emitter, cdnUrl, categoryClasses));
    }

    public initialize() {
        ensureElement('.header__basket')!.addEventListener('click', () => this.emitter.emit('basket:open'));
        this.emitter.on('basket:change', () => this.refreshUI());
        this.emitter.on('basket:cleared', () => this.refreshUI());
    }

    private prepareContent({ basketProducts, basketTotalPrice }: { basketProducts: IProduct[], basketTotalPrice: number }): HTMLElement {
    const modalContent = cloneTemplate('#basket')!,
          list = ensureElement('.basket__list', modalContent)! as HTMLUListElement,
          totalPrice = ensureElement('.basket__price', modalContent)! as HTMLDivElement,
          orderButton = ensureElement('.basket__button', modalContent)! as HTMLButtonElement;

    list.innerHTML = '';

    basketProducts.forEach(({ title, price }, index) => {
        const card = cloneTemplate('#card-basket')!;
        const itemIndex = ensureElement('.basket__item-index', card)!;
        const cardTitle = ensureElement('.card__title', card)!;
        const cardPrice = ensureElement('.card__price', card)!;
        const deleteButton = ensureElement('.basket__item-delete', card)! as HTMLButtonElement;

        itemIndex.textContent = `${index + 1}`;
        cardTitle.textContent = title;
        
        let displayedPrice = 'Бесплатно'; 
        if (typeof price !== 'undefined' && price !== null && price > 0) {
            displayedPrice = `${price} синапсов.`;
        }
        
        cardPrice.textContent = displayedPrice;

        deleteButton.onclick = () => {
            this.emitter.emit('basket:remove-product', { id: basketProducts[index].id });
            this.refreshUI();
        };

        list.appendChild(card);
    });

    totalPrice.textContent = `${basketTotalPrice} синапсов`;
    orderButton.disabled = !basketProducts.length;
    orderButton.addEventListener('click', () => this.emitter.emit('order:start'));

    return modalContent;
}

    public setData(data: { basketTotalCount: number, basketTotalPrice: number, basketProducts: IProduct[] }) {
        const counter = ensureElement('.header__basket-counter')!;
        counter.textContent = data.basketTotalCount.toString();
    
        const modal = Modal.getInstance('#modal-container');
        modal.setContent(this.prepareContent(data));
        modal.open();
    }

    public refreshUI() {
        this.emitter.emit('request:basket-data');
    }

    public closeBasket() {
        const modal = Modal.getInstance('#modal-container');
        modal.close();
    }

    public openBasket() {
        const modal = Modal.getInstance('#modal-container');
        modal.open();
    }
}