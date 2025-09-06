// CardView.ts

import { ensureElement } from '../utils/utils';
import { IProduct } from './ProductModel';
import { Modal } from './Modal';
import { Card } from './Card'; 

export class CardView {
    private static instance: CardView; // Синглтон представления карточки 
    private readonly _eventEmitter: any; // Эммитер событий для взаимодействия с другими компонентами
    private modal: Modal; // Экземпляр модального окна
    private cardService: Card; // Сервис для рендера карточек
    private fullCardElement: HTMLElement | null = null; // Элемент детальной карточки
    private buyButton: HTMLButtonElement | null = null; // Кнопка добавления товара в корзину
    private initialButtonText: string = ''; // Текущая подпись кнопки ("Купить"/"Удалить")

    // Конструктор принимает эммитер событий и сервис рендера карточек
    private constructor(eventEmitter: any, cardService: Card) {
        this._eventEmitter = eventEmitter;
        this.modal = Modal.getInstance('#modal-container'); // Инициализируем модал
        this.cardService = cardService; // Подключаем сервис рендера карточек
    }

    // Статический метод возвращает экземпляр CardView
    public static getInstance(eventEmitter: any, cardService: Card): CardView {
        if (!CardView.instance) {
            CardView.instance = new CardView(eventEmitter, cardService);
        }
        return CardView.instance;
    }

    // Открывает подробную карточку товара
    openCard(product: IProduct): void {
        this.fullCardElement = this.cardService.renderFullCard(product); // Рендерим полный продукт
        if (!this.fullCardElement) return;

        // Получаем кнопку покупки один раз
        this.buyButton = ensureElement('.card__button', this.fullCardElement) as HTMLButtonElement;
        if (!this.buyButton) return;

        // Сначала получаем подписью кнопки из шаблона
        this.initialButtonText = this.buyButton.textContent || 'Купить';

        // Теперь проверяем наличие товара в корзине и устанавливаем правильное состояние кнопки
        this._eventEmitter.emit('request:basket-data', (data: any[]) => {
            const existsInBasket = data.some((item) => item.id === product.id); // Проверяем наличие товара в корзине

            if (existsInBasket) {
                this.buyButton.textContent = 'Удалить из корзины';
            } else {
                this.buyButton.textContent = this.initialButtonText; // Оставляем оригинальную подпись кнопки
            }

            // Назначаем обработчик события
            this.buyButton.addEventListener('click', () => {
                if (existsInBasket) { // Проверяем состояние товара в корзине
                    this._eventEmitter.emit('remove-from-basket', { productId: product.id }); // Удаляем товар из корзины
                } else {
                    this._eventEmitter.emit('add-to-basket', product); // Добавляем товар в корзину
                }
                this.modal.close(); // Закрываем окно после нажатия
            }, { once: true }); // Удаляем событие после первого срабатывания
        });

        // Показываем модальное окно с картой
        this.modal.setContent(this.fullCardElement);
        this.modal.open();
    }

    // Закрытие окна просмотра карты
    close(): void {
        this.modal.close();
    }
}