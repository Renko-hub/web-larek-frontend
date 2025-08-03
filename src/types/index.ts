// types.ts

// Интерфейс описывает структуру товара
export interface Product {
  id: string;           // Идентификатор товара
  title: string;        // Название товара
  category: string;     // Категория товара
  image: string;        // Изображение товара
  price: number;        // Цена товара
  description?: string; // Необязательное описание товара
  quantity?: number;    // Количество товара в корзине (необязательно)
  index?: number;       // Позиция товара в списке (необязательно)
}