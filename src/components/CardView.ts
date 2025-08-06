// CardView.ts

import { BaseModal } from './BaseModal';
import { IProduct } from '../types/index';
import { ensureElement, cloneTemplate } from '../utils/utils';
import { BasketController } from './BasketController';
import { ProductRenderer } from './Page';
import { EventEmitter } from './base/events';

// Класс для удобного обращения к элементам карточки товара
class CardElements {
  readonly addToCartBtn: HTMLButtonElement | null; // Кнопка добавления/удаления товара из корзины

  constructor(content: HTMLElement) {
    this.addToCartBtn = ensureElement('.button.card__button', content) as HTMLButtonElement | null;
  }
}

// Класс для отображения карточки товара
export class CardView extends BaseModal {
  private static _instance: CardView | null = null; // Поле для реализации паттерна Singleton
  private events: EventEmitter | null = null; // Хранит ссылку на объект диспетчера событий

  // Приватный конструктор для предотвращения прямого инстанцирования
  private constructor(events: EventEmitter) {
    super('#modal-container');
    this.events = events;
  }

  // Реализация паттерна Singleton — метод возвращает единственный экземпляр класса
  public static getInstance(events: EventEmitter): CardView {
    return CardView._instance || (CardView._instance = new CardView(events));
  }

  // Метод инициализации (может быть расширен позже)
  initialize(events: EventEmitter): void {}

  // Статический метод для показа карточки товара
  public static showProductCard(product: IProduct | null, events: EventEmitter): void {
    if (!product) return;

    const instance = CardView.getInstance(events);

    const card = cloneTemplate('#card-preview')!;

    if (!card) {
      return;
    }

    const renderer = new ProductRenderer(card);
    renderer.render(product!, true); // Передаем флаг полного рендера

    const elements = new CardElements(card);

    if (elements.addToCartBtn) {
      const basketCtrl = new BasketController(events);
      const isInBasket = basketCtrl.currentState.findProductById(product!.id) !== undefined;

      elements.addToCartBtn.innerText = isInBasket ? 'Удалить из корзины' : 'Купить';

      elements.addToCartBtn.onclick = () => {
        if (isInBasket) {
          basketCtrl.removeFromBasket(product!.id);
        } else {
          basketCtrl.addToBasket(product!);
        }
        
        CardView.showProductCard(product, events); // Обновляем карточку после изменений
        instance.close(); // Закрываем старую версию карточки
      };
    }

    instance.setContent(card);
    instance.open();
  }

  // Метод закрытия карточки товара
  public static hideProductCard(): void {
    CardView.getInstance(null!).close();
  }
}