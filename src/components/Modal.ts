// Modal.ts

import { ensureElement } from '../utils/utils';

export class Modal {
    private static instance: Modal | null = null;
    private modalElement: HTMLElement | null = null;
    private contentContainer: HTMLElement | null = null;
    private _isOpen: boolean = false;

    // Создание экземпляра модального окна и установка слушателей событий
    constructor(containerId: string) {
        this.modalElement = ensureElement(containerId, document.body);
        this.contentContainer = ensureElement('.modal__content', this.modalElement);
        const closeBtn = ensureElement('.modal__close', this.modalElement);
        closeBtn!.onclick = () => this.close();
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('mousedown', this.handleMouseDown.bind(this));
    }

    // Возвращает единственный экземпляр модального окна
    static getInstance(containerId: string): Modal {
        return Modal.instance || (Modal.instance = new Modal(containerId));
    }

    // Устанавливает содержимое модального окна
    set content(value: HTMLElement | null) {
        value && this.contentContainer && (this.contentContainer.innerHTML = '', this.contentContainer.appendChild(value));
    }

    // Открывает модальное окно
    open(): void {
        this.modalElement && !this._isOpen && (this.modalElement.classList.add('modal_active'), this._isOpen = true);
    }

    // Закрывает модальное окно
    close(): void {
        this.modalElement && this._isOpen && (this.modalElement.classList.remove('modal_active'), this._isOpen = false);
    }

    // Обработчик нажатия клавиши Escape для закрытия модала
    handleKeyDown(event: KeyboardEvent): void {
        event.key === 'Escape' && this._isOpen && this.close();
    }

    // Обработчик щелчка мышью для закрытия модала при клике вне активной зоны
    handleMouseDown(event: MouseEvent): void {
        const target = event.target as Element;
        this.modalElement &&
          this._isOpen &&
          !this.contentContainer?.contains(target) &&
          target !== this.modalElement.querySelector('.modal__close') &&
          this.close();
    }
}