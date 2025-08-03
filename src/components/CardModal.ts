// CardModal.ts

import { BaseModal } from './BaseModal';
import { Product } from './Model';
import { ensureElement, cloneTemplate } from '../utils/utils';
import { CDN_URL } from '../utils/constants';
import { CartModel } from './Model';

export class CardModal extends BaseModal {
  private static _instance: CardModal | null = null; // Единственный экземпляр объекта (Singleton)

  private constructor() {
    super('#modal-container'); // Передача родительского контейнера модального окна
  }

  // Метод возвращает единственное экземпляра CardModal
  public static getInstance(): CardModal {
    if (!CardModal._instance) {
      CardModal._instance = new CardModal();
    }
    return CardModal._instance;
  }

  // Метод показывает подробную карточку товара
  public static showProductCard(productData: Product): void {
    const instance = CardModal.getInstance(); // Получаем инстанс модала

    const clonedCard = cloneTemplate('#card-preview'); // Создание клонового шаблона карточки товара
    if (!clonedCard) {
      throw new Error('Шаблон карточки товара не найден.'); // Генерация ошибки, если шаблон не найден
    }

    // Установка значений элементов карточки товара
    const imgElement = ensureElement('.card__image', clonedCard) as HTMLImageElement; // Картинка товара
    imgElement.src = `${CDN_URL}/${productData.image}`;                               // Назначение картинки

    const titleElement = ensureElement('.card__title', clonedCard);                   // Заголовок товара
    titleElement.textContent = productData.title;                                     // Назначение заголовка

    const descriptionElement = ensureElement('.card__text', clonedCard);              // Текстовое описание товара
    descriptionElement.textContent = productData.description || '';                   // Назначение текста

    // Проверка и назначение цены товара
    const priceElement = ensureElement('.card__price', clonedCard);
    if (typeof productData.price === 'number' && isFinite(productData.price)) {
      priceElement.textContent = `${productData.price} синапсов`; // Корректная цена
    } else {
      priceElement.textContent = 'Цена неизвестна';               // Цена не указана
    }

    // Обработка кнопки добавления в корзину
    const addBtn = ensureElement('.button.card__button', clonedCard) as HTMLButtonElement;
    addBtn.onclick = () => {
      CartModel.getInstance().addToCart(productData); // Добавляем товар в корзину
      instance.close();                                // Закрываем модал
    };

    // Замещение содержимого модала и его открытие
    instance.replaceContent(clonedCard);
    instance.open();
  }

  // Метод скрывает модальную карточку товара
  public static hideProductCard(): void {
    const instance = CardModal.getInstance();
    instance.close(); // Просто закрываем окно
  }
}