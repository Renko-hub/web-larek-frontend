// BasketModel.ts

import { IProduct } from './ProductModel';
import { IEvents } from './base/events';

export interface IBasketItem extends IProduct {
    quantity: number; // Количество товара в корзине
    index?: number;   // Индекс товара в корзине
    displayText: string; // Отображаемая цена
}

export class BasketModel {
    private basket: IBasketItem[] = [];
    private readonly events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    get totalPrice(): number {
        return this.basket.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    }

    get totalItems(): number {
        return this.basket.reduce((acc, item) => acc + item.quantity, 0);
    }

    get items(): IBasketItem[] {
        return [...this.basket];
    }

    getSendableItems(): IBasketItem[] {
        return this.items.filter(item => item.price > 0).map(item => ({...item}));
    }

    get emptyMessage(): string {
        return this.basket.length === 0 ? 'Корзина пуста' : '';
    }

    hasItem(id: string): boolean {
        return this.basket.some(item => item.id === id);
    }

    private updateIndexes() {
        this.basket.forEach((item, idx) => item.index = idx + 1);
    }

    change() {
        this.events.emit('basket:change');
    }

    add(product: IProduct) {
        if (!product || !product.id) throw new Error("Некорректный продукт");
        const existingItemIndex = this.basket.findIndex(item => item.id === product.id);
        if (existingItemIndex !== -1) {
            this.basket[existingItemIndex].quantity++;
        } else {
            this.basket.push({ ...product, quantity: 1 });
        }
        this.updateIndexes();
        this.change();
    }

    remove(productId: string) {
        const itemIndex = this.basket.findIndex(item => item.id === productId);
        if (itemIndex !== -1) {
            if (this.basket[itemIndex].quantity > 1) {
                this.basket[itemIndex].quantity--;
            } else {
                this.basket.splice(itemIndex, 1);
            }
        }
        this.updateIndexes();
        this.change();
    }

    clearBasket() {
        if (this.basket.length > 0) {
            this.basket = [];
            this.change();
        }
    }
}