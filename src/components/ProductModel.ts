// ProductModel.ts

// Интерфейс описания одного продукта
export interface IProduct {
    id: string;
    title: string;
    category: string;
    image: string;
    price: number;
   
    quantity?: number;
}

// Интерфейс ответа API, содержащий массив продуктов
export interface ProductsResponse {
    items: IProduct[];
}

// Основная модель продуктов
export class ProductModel {
    private static instance: ProductModel | null = null;
    private products: IProduct[] = [];

    constructor(private readonly events: any) {}

    // Паттерн синглтона
    static getInstance(events: any): ProductModel {
        return ProductModel.instance || (ProductModel.instance = new ProductModel(events));
    }

    // Устанавливаем новые данные и инициируем событие 'products:show'
    set(data: IProduct[]): void {
        this.products = data;
        this.events.emit('products:show');
    }

    // Получаем текущие данные
    get(): IProduct[] {
        return [...this.products]; // возвращаем защищённую копию
    }

    // Поиск продукта по ID
    findProductById(id: string): IProduct | undefined {
        return this.products.find(product => product.id === id);
    }
}