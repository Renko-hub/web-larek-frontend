// Modal.ts

import { ensureElement } from '../utils/utils';

export class Modal {
  private static instance: Modal | null = null;

  private modalElement: HTMLElement | null = null;
  private content: HTMLElement | null = null;
  private active: boolean = false; // Добавлено поле для отслеживания статуса окна

  constructor(protected containerId: string) {
    this.modalElement = ensureElement(containerId, document.body);
    this.content = ensureElement('.modal__content', this.modalElement);
    this.initEvents();
  }

  static getInstance(containerId: string): Modal {
    return Modal.instance || (Modal.instance = new Modal(containerId));
  }

  open(): void {
    if (!this.active) {
      this.modalElement?.classList.add('modal_active'); // Показываем модальное окно
      this.active = true;                              // Меняем статус окна
    }
  }

  close(): void {
    if (this.active) {
      this.modalElement?.classList.remove('modal_active'); // Скрываем модальное окно
      this.active = false;                                // Меняем статус окна
    }
  }

  setContent(newContent: Node): void {
    this.content.innerHTML = '';
    this.content?.appendChild(newContent);
  }

  getContent(): HTMLElement | null {
    return this.content;
  }

  protected handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.active) { // Закрываем только активное окно
      this.close();
    }
  }

  protected handleOutsideClick(event: MouseEvent): void {
    const target = event.target as Element;
    if (
      target &&
      this.modalElement &&
      this.active &&                         // Закрываем только активное окно
      !this.content?.contains(target)
    ) {
      this.close();
    }
  }

  private initEvents(): void {
    document.addEventListener('keydown', this.handleKeyDown.bind(this)); // События закрытия окна
    document.body.addEventListener('click', this.handleOutsideClick.bind(this), true);
    const closeBtn = ensureElement('.modal__close', this.modalElement);
    closeBtn?.addEventListener('click', () => this.close()); // Стандартная кнопка закрытия
  }
}