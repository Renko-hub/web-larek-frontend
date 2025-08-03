// Page.ts

import { EventEmitter } from './base/events';
import { BasketModal } from './BasketModal';
import { Api } from './base/api';
import { ensureElement, cloneTemplate } from '../utils/utils';
import { API_URL } from '../utils/constants';
import { CardModal } from './CardModal';
import { CDN_URL, categoryClasses } from '../utils/constants';
import { Product } from '../types/index';

// Создаем экземпляр EventEmitter для обработки событий страницы
const pageEventsEmitter = new EventEmitter();

// Инициализируем обработку открытия корзины
pageEventsEmitter.on('open-basket', () => BasketModal.getInstance().showBasket());

// Функция загрузки и рендеринга продуктов
export async function loadAndRenderProducts() {
  try {
    const api = new Api(API_URL);
    const { items } = await api.get('/product') as { items: Product[] };
    
    if (!items) return;

    const galleryContainer = ensureElement('.gallery', document.body)!;
    const cardCatalogTemplate = ensureElement('#card-catalog', document.body)! as HTMLTemplateElement;

    for (const product of items) {
      const clonedCard = cloneTemplate(cardCatalogTemplate);
      
      // Получаем элементы карточки и наполняем их информацией
      const [
        titleElement,
        categoryElement,
        imageElement,
        priceElement
      ] = ['.card__title', '.card__category', '.card__image', '.card__price'].map(selector =>
        ensureElement(selector, clonedCard)!
      );

      titleElement.textContent = product.title;
      categoryElement.textContent = product.category;
      (imageElement as HTMLImageElement).src = `${CDN_URL}/${product.image}`; // Присваиваем изображение

      // Отображение цены с дополнительной проверкой
      const priceText = (
        typeof product.price === 'number' && isFinite(product.price)
          ? `${product.price} синапсов`
          : 'Цена неизвестна'
      );
      priceElement.textContent = priceText;

      // Добавляем стили категории, если существуют
      const styleClass = categoryClasses[product.category.toLowerCase()];
      if (styleClass) categoryElement.classList.add(styleClass);

      // Настройка события клика на карточку
      clonedCard.addEventListener('click', () => pageEventsEmitter.emit('productClick', product));

      // Добавляем карточку в галерею
      galleryContainer.appendChild(clonedCard);
    }
  } catch (err) {
    console.error(`Ошибка загрузки товаров: ${err.message}`);
  }
}

// Назначаем событие клика на корзину
ensureElement('.header__basket')!.addEventListener('click', () => pageEventsEmitter.emit('open-basket'));

// Обрабатываем клики по продуктам и показываем карточку товара
pageEventsEmitter.on('productClick', (product: Product) => CardModal.showProductCard(product));