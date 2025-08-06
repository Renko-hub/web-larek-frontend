// BasketView.ts

import { BaseModal } from './BaseModal';
import { BasketModel } from './BasketModel';
import { EventEmitter } from './base/events';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { createProductCard } from './Components';
import { OrderView } from './OrderView';

// Экспорт класса представления корзины, наследуемого от базового модального окна
export class BasketView extends BaseModal {
  // Статическое поле экземпляра класса, используемое для реализации паттерна Singleton
  private static _instance: BasketView | null = null;

  // Приватное свойство для хранения диспетчера событий
  private events: EventEmitter | null = null;

  // Конструктор принимает экземпляр диспетчера событий и вызывает конструктор родительского класса
  private constructor(events: EventEmitter) {
    super('#modal-container'); // Передаем селектор контейнера модальных окон
    this.events = events; // Сохраняем переданный экземпляр события
  }

  // Метод для получения единственного экземпляра класса (паттерн Singleton)
  public static getInstance(events: EventEmitter): BasketView {
    return BasketView._instance || (BasketView._instance = new BasketView(events)); // Возвращаем существующий экземпляр или создаем новый
  }

  // Инициализация компонента корзины, привязка обработчиков событий
  public initialize(events: EventEmitter): void {
    this.events = events; // Обновляем ссылку на диспетчер событий
    this.events.on('basket:update', () => this.refreshUI()); // Подписываемся на событие обновления корзины

    // Получаем элемент иконки корзины и добавляем обработчик кликов
    const basketIcon = ensureElement('.header__basket');
    if (basketIcon) {
      basketIcon.addEventListener('click', () => this.showBasket()); // Показываем корзину при нажатии на иконку
    }
  }

  // Отображение содержимого корзины в модальном окне
  showBasket(): void {
    // Клонируем шаблон корзины и устанавливаем его содержимое модальному окну
    const modalContent = cloneTemplate('#basket')!;
    this.setContent(modalContent); // Устанавливаем контент модала

    // Получаем элементы списка товаров, итоговой суммы и кнопки заказа
    const list = ensureElement('.basket__list', modalContent)! as HTMLUListElement,
          totalPrice = ensureElement('.basket__price', modalContent)! as HTMLDivElement,
          orderButton = ensureElement('.basket__button', modalContent)! as HTMLButtonElement;

    // Получаем список продуктов и общую сумму из модели корзины
    const { basketProducts, basketTotalPrice } = BasketModel.getInstance(this.events);

    // Очищаем список товаров
    list.innerHTML = '';

    // Формируем карточки товаров и добавляем их в список
    basketProducts.forEach((product) => {
      const card = createProductCard(product, () => {
        BasketModel.getInstance(this.events).removeFromBasket(product.id); // Удаление товара из корзины
        this.showBasket(); // Перезагружаем представление корзины
      });
      list.appendChild(card); // Добавляем карточку продукта в список
    });

    // Устанавливаем отображаемую стоимость корзины
    totalPrice.textContent = `${basketTotalPrice} синапсов`; // Используем валюту 'синапс'

    // Деактивируем кнопку оформления заказа, если корзина пуста
    orderButton.disabled = !basketProducts.length;

    // Назначаем обработчик клика на кнопке заказа
    orderButton.onclick = () => {
      this.close(); // Закрываем окно корзины
      OrderView.getInstance().showOrder(); // Открываем форму оформления заказа
    };

    // Открываем модальное окно корзины
    this.open();
  }

  // Скрытие корзины (закрытие модального окна)
  hideBasket(): void {
    this.close();
  }

  // Обновление интерфейса корзины (количество товаров в шапке сайта)
  refreshUI(): void {
    const counterElement = ensureElement('.header__basket-counter');
    if (counterElement && this.events) {
      counterElement.textContent = BasketModel.getInstance(this.events).basketTotalCount.toString(); // Обновляем количество товаров в корзине
    }
  }
}