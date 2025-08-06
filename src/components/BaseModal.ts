// BaseModal.ts

import { ensureElement } from '../utils/utils';

// Базовый класс модального окна
export class BaseModal {
  protected modalElement: HTMLElement | null = null;
  protected content: HTMLElement | null = null;

  // Конструктор класса с передачей контейнера модалки
  constructor(containerId: string) {
    this.modalElement = ensureElement(containerId, document.body);
    this.content = ensureElement('.modal__content', this.modalElement);
    this.initializeListeners();
  }

  // Публичный метод открывающий модальное окно
  open(): void {
    this.modalElement && this.modalElement.classList.add('modal_active');
  }

  // Публичный метод закрывающий модальное окно
  close(): void {
    this.modalElement && this.modalElement.classList.remove('modal_active');
    this.uninitializeListeners();
  }

  // Метод установки нового содержимого внутри модального окна
  setContent(newContent: Node): void {
    this.content && (this.content.innerHTML = '', this.content.appendChild(newContent));
  }

  // Закрывает модалку при нажатии клавиши Escape
  protected handleKeyDown(evt: KeyboardEvent): void {
    evt.key === 'Escape' && this.close();
  }

  // Закрывает модалку при клике вне области содержимого
  protected handleOutsideClick(evt: MouseEvent): void {
    const target = evt.target as Element;
    if (!target || !this.content?.contains(target)) {
      this.close();
    }
  }

  // Приватный метод инициализации слушателей событий
  private initializeListeners(): void {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.body.addEventListener('click', this.handleOutsideClick.bind(this), true);

    const closeBtn = ensureElement('.modal__close', this.modalElement);
    closeBtn && closeBtn.addEventListener('click', () => this.close());
  }

  // Приватный метод удаления слушателей событий
  private uninitializeListeners(): void {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
    document.body.removeEventListener('click', this.handleOutsideClick.bind(this), true);

    const closeBtn = ensureElement('.modal__close', this.modalElement);
    closeBtn && closeBtn.removeEventListener('click', () => this.close());
  }
}