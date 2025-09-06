// Modal.ts

import { ensureElement } from '../utils/utils';

export class Modal {
  private static instance: Modal | null = null; // Синглтон-модальное окно

  private modalElement: HTMLElement | null = null; // DOM-элемент самого модала
  private content: HTMLElement | null = null; // Контейнер содержимого модала
  private active: boolean = false; // Статус активности модала

  constructor(protected containerId: string) {
    this.modalElement = ensureElement(containerId, document.body); // Ищем элемент-контейнер модала
    this.content = ensureElement('.modal__content', this.modalElement); // Ищем контейнер содержания внутри модала
    this.initEvents(); // Подключаем обработчики событий
  }

  // Создаем синглтона модального окна
  static getInstance(containerId: string): Modal {
    return Modal.instance || (Modal.instance = new Modal(containerId));
  }

  // Устанавливает новое содержимое модала
  setContent(newContent: Node): void {
    if (this.content) {
      this.content.innerHTML = '';
      this.content.appendChild(newContent);
    }
  }

  // Открывает модал
  open(): void {
    if (!this.active) {
      this.modalElement?.classList.add('modal_active'); // Показываем модал визуально
      this.active = true;
    }
  }

  // Закрывает модал
  close(): void {
    if (this.active) {
      this.modalElement?.classList.remove('modal_active'); // Скрываем модал визуально
      this.active = false;
    }
  }

  // Обработчик нажатия клавиши Escape
  protected handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.active) {
      this.close();
    }
  }

  // Обработчик кликов вне области модала
  protected handleOutsideClick(event: MouseEvent): void {
    const target = event.target as Element;
    if (
      target &&
      this.modalElement &&
      this.active &&
      !this.content?.contains(target)
    ) {
      this.close();
    }
  }

  // Инициализация обработчиков событий
  private initEvents(): void {
    document.addEventListener('keydown', this.handleKeyDown.bind(this)); // Обработка клавиатуры
    document.body.addEventListener('click', this.handleOutsideClick.bind(this), true); // Обработка кликов
    const closeBtn = ensureElement('.modal__close', this.modalElement); // Кнопка закрытия модала
    closeBtn?.addEventListener('click', () => this.close()); // Назначаем событие на закрытие модала кнопкой
  }
}