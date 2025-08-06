// Page.ts

import { Api } from './base/api';
import { ensureElement, cloneTemplate } from '../utils/utils';
import { API_URL, CDN_URL, categoryClasses } from '../utils/constants';
import { CardView } from './CardView';
import { IProduct } from '../types/index';
import { EventEmitter } from './base/events';

// Класс рендеринга отдельного продукта
export class ProductRenderer {
  constructor(private _element: HTMLElement) {}

  // Рендерит название продукта
  render(product: IProduct, fullView: boolean = false) {
    this.renderTitle(product.title);
    this.renderCategory(product.category);
    this.renderImage(product.image);
    this.renderPrice(product.price);
    if (fullView) this.renderDescription(product.description || '');
  }

  // Устанавливает заголовок продукта
  renderTitle(title: string) {
    const el = ensureElement('.card__title', this._element);
    el && (el.textContent = title);
  }

  // Устанавливает категорию продукта
  renderCategory(category: string) {
  const categoryElement = ensureElement('.card__category', this._element);
  if (categoryElement) {
    categoryElement.textContent = category;
    const oldClass = [...categoryElement.classList].find(className => className.includes('card__category_')); // находим старый класс категории
    const newClass = categoryClasses[category.trim().toLocaleLowerCase()];
    if (oldClass) categoryElement.classList.replace(oldClass, newClass ?? '');
  }
}

  // Устанавливает цену продукта
  renderPrice(price: number | undefined) {
    const el = ensureElement('.card__price', this._element);
    el && (el.textContent = typeof price === 'number' ? `${price} синапсов` : 'Бесплатно');
  }

  // Устанавливает описание продукта
  renderDescription(description: string) {
    const el = ensureElement('.card__text', this._element);
    el && (el.textContent = description);
  }

  // Устанавливает изображение продукта
  renderImage(imagePath: string) {
    const imgEl = ensureElement('.card__image', this._element) as HTMLImageElement | null;
    imgEl && (imgEl.src = `${CDN_URL}/${imagePath}`);
  }
}

// Класс загрузки каталога товаров
class CatalogProductsLoader {
  constructor(private events: EventEmitter) {}

  // Метод асинхронной загрузки списка товаров
  async load(url: string): Promise<void> {
    const api = new Api(API_URL);
    const response = await api.get(url) as { items?: IProduct[] };
    const products = response.items || [];

    const gallery = ensureElement('.gallery');
    const template = ensureElement('#card-catalog')! as HTMLTemplateElement;

    for (const product of products) {
      const element = cloneTemplate(template);
      const renderer = new ProductRenderer(element);
      renderer.render(product);
      element.addEventListener('click', () => CardView.showProductCard(product, this.events));
      gallery?.appendChild(element);
    }
  }
}

// Экспортированная функция загрузки каталога товаров
export async function loadCatalog(events: EventEmitter): Promise<void> {
  return new CatalogProductsLoader(events).load('/product');
}