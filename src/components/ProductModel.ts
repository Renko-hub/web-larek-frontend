// ProductModel.ts

// Интерфейс описывает структуру продукта
export interface IProduct {
    id: string;           // Уникальный идентификатор продукта
    title: string;        // Название продукта
    category: string;     // Категория продукта
    image: string;        // Путь к изображению продукта
    price: number;        // Цена продукта
    quantity?: number;    // Количество товара (необязательно)
    description?: string; // Описание товара (необязательно)
}

// Класс модели продуктов
export class ProductsModel {
    private _products: IProduct[] = []; // Приватное хранилище списка товаров

    // Метод установки массива продуктов
    set(products: IProduct[]): void {
        this._products = products;
    }

    // Метод получения копии текущего массива продуктов
    get(): IProduct[] {
        return this._products.slice(); // Возвращаем копию массива
    }

    // Поиск продукта по уникальному ID
    findProductById(id: string): IProduct | undefined {
        return this._products.find(p => p.id === id); // Возвращаем найденный продукт или undefined
    }
}