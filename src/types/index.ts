// types.ts

export interface IProduct {
  id: string;                 // уникальный идентификатор товара
  title: string;              // название товара
  category: string;           // категория товара
  image: string;              // путь к изображению товара
  price: number;              // цена товара
  description?: string;       // опциональное описание товара
  quantity?: number;          // количество товара в корзине (если актуально)
}

export interface IForm<T extends Element> {
  form: T;
  fields: Record<string, HTMLInputElement>;
  buttons: Record<string, HTMLButtonElement>;
}