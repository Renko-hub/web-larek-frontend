// Modal.ts

import { ensureElement } from '../utils/utils';

export class Modal {
    private static instance: Modal | null = null;
    private modalElement: HTMLElement | null = null;
    private contentContainer: HTMLElement | null = null;
    private isOpen: boolean = false;

    // Создание единственного экземпляра модального окна
    constructor(containerId: string) {
        this.modalElement = ensureElement(containerId, document.body);
        this.contentContainer = ensureElement('.modal__content', this.modalElement);
        const closeBtn = ensureElement('.modal__close', this.modalElement)!;
        closeBtn.onclick = () => this.close(); // Обработчик кнопки закрытия
    }

    // Получаем экземпляр модального окна
    static getInstance(containerId: string): Modal {
        return Modal.instance || (Modal.instance = new Modal(containerId));
    }

    // Установка содержимого модального окна
    set content(value: HTMLElement | null) {
        value && this.contentContainer && (this.contentContainer.innerHTML = '', this.contentContainer.appendChild(value));
    }

    // Открывает модальное окно
    open(): void {
        if (!this.isOpen && this.modalElement) {
            this.modalElement.classList.add('modal_active');
            this.isOpen = true;
            document.addEventListener('keydown', this.handleKeyDown.bind(this)); // Esc закрывает модал
            document.addEventListener('mousedown', this.handleMouseDown.bind(this)); // Клик вне зоны закрывает модал
        }
    }

    // Закрывает модальное окно
    close(): void {
        if (this.isOpen && this.modalElement) {
            this.modalElement.classList.remove('modal_active');
            this.isOpen = false;
            document.removeEventListener('keydown', this.handleKeyDown.bind(this));
            document.removeEventListener('mousedown', this.handleMouseDown.bind(this));
        }
    }

    // Нажатие Esc вызывает закрытие модала
    handleKeyDown(event: KeyboardEvent): void {
        event.key === 'Escape' && this.close();
    }

    // Щелчок мыши вне активного элемента также закрывает модал
    handleMouseDown(event: MouseEvent): void {
        const target = event.target as Element;
        this.modalElement && this.isOpen && !(target instanceof Node && this.contentContainer?.contains(target)) && target !== this.modalElement.querySelector('.modal__close') && this.close();
    }
}