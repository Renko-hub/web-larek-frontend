// ProductModel.ts

import { IEvents } from "./base/events";

export interface IProduct {
    id: string;
    title: string;
    category: string;
    image: string;
    price: number | null;
    quantity?: number;
    description?: string;
    displayText: string; // Готовый текст для отображения цены
}

/**
 * Модель хранения продуктов магазина.
 */
export class ProductsModel {
    private _products: IProduct[] = [];
    protected readonly events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    set(products: IProduct[]) {
        this._products = products.map(product => ({
            ...product,
            displayText: product.displayText ||
                         (typeof product.price === 'number' && product.price > 0 ?
                          `${product.price} синапсов` : 'Бесплатно'),
        }));
        this.events.emit('products:show'); // Автоматически показываем товары после установки
    }

    get(): IProduct[] {
        return [...this._products];
    }
}