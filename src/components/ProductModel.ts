// ProductModel.ts

import { IEvents } from "./base/events";

export interface IProduct {
    id: string;
    title: string;
    category: string;
    image: string;
    price: number;
    quantity?: number;
    description?: string;
}

/**
 * Модель хранения продуктов магазина.
 */
export class ProductsModel {
    private _products: IProduct[] = []; // Внутреннее хранилище списка продуктов
    protected readonly events: IEvents; // Объект системы событий для уведомления компонентов

    constructor(events: IEvents) {
        this.events = events;
    }

    // Установка массива продуктов
    set(products: IProduct[]) {
        this._products = products;
        this.events.emit('products:show'); // Уведомляет систему о готовности показать продукты
    }

    // Возврат копии внутреннего массива продуктов
    get(): IProduct[] {
        return this._products.slice(); // Возвращается копия массива, чтобы предотвратить прямое изменение
    }
}