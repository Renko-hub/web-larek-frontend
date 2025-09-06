// SuccessView.ts

// Представление успешного завершения покупки
import { cloneTemplate, ensureElement } from '../utils/utils';
import { Modal } from './Modal';

export class SuccessView {
    private static instance: SuccessView; // Синглтон представление успеха
    private readonly _eventEmitter: any; // Эммитер событий для взаимодействия с другими компонентами
    private modal: Modal; // Экземпляр модального окна
    private totalSumEl: HTMLElement | null = null; // Элемент отображения итоговой суммы
    private closeButtonInModal: HTMLElement | null = null; // Кнопка закрытия модала

    private constructor(eventEmitter: any) {
        this._eventEmitter = eventEmitter;
        this.modal = Modal.getInstance('modal-container'); // Инициализируем модал
    }

    // Получаем singleton-экземпляр SuccessView
    public static getInstance(eventEmitter: any): SuccessView {
        if (!SuccessView.instance) {
            SuccessView.instance = new SuccessView(eventEmitter);
        }
        return SuccessView.instance;
    }

    // Открытие окна успешного завершения заказа
    openSuccess(): void {
        this._eventEmitter.emit('order-success');
        this._eventEmitter.emit('successview:opened');
        const successTemplate = ensureElement('#success') as HTMLTemplateElement; // Шаблон успешного завершения
        if (successTemplate) {
            const successClone = cloneTemplate(successTemplate);
            if (successClone) {
                this.modal.setContent(successClone); // Устанавливаем контент модала
                this.totalSumEl = ensureElement('.order-success__description', successClone); // Сообщение с суммой
                this.closeButtonInModal = ensureElement('.order-success__close', successClone); // Кнопка закрытия модала

                if (this.totalSumEl) {
                    this._eventEmitter.emit('request:basket-total-sum', (totalSum: number) => {
                        this.totalSumEl.textContent = `Списано ${totalSum} синапсов`; // Вывести общую сумму списания
                    });
                }

                if (this.closeButtonInModal) {
                    this.closeButtonInModal.addEventListener('click', () => this.close(), { once: true }); // Однократное закрытие модала
                }

                this.modal.open(); // Открываем модал
            }
        }
    }

    // Закрыть окно успешного завершения заказа
    close(): void {
        this.modal.close();
        this._eventEmitter.emit('successview:closed');
    }
}