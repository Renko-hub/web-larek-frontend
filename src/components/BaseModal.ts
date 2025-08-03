// BaseModal.ts

import { ensureElement, setElementData, getElementData, bem } from '../utils/utils';
import { EventEmitter } from './base/events';

// Интерфейс базового модального окна
interface IBaseModal {
  open(): void;
  close(): void;
  replaceContent(newContent: Node): void;
  on(eventName: string, callback: (event: object) => void): void;
  emit(eventName: string, data?: any): void;
}

// Базовая реализация модальных окон
export class BaseModal implements IBaseModal {
  protected modalElement: HTMLElement | null = null;
  protected content: HTMLElement | null = null;

  protected readonly emitter = new EventEmitter();

  // Конструктор класса Modal
  constructor(protected readonly containerId: string) {
    this.modalElement = ensureElement(containerId, document.body);
    this.content = ensureElement('.modal__content', this.modalElement);
    this.initializeListeners();
  }

  // Возвращает элемент, содержащий контент модального окна
  public getContentContainer(): HTMLElement | null {
    return this.content;
  }

  // Показывает модальное окно
  public open(): void {
    if (!this.modalElement || !this.content) return;
    this.modalElement.classList.add('modal_active');
  }

 // Закрывает модальное окно
  public close(): void {
    if (!this.modalElement || !this.content) return;
    this.modalElement.classList.remove('modal_active');
  }

  // Меняет содержимое модального окна новым узлом DOM
  public replaceContent(newContent: Node): void {
    if (!this.content) return;
    this.content.innerHTML = ''; // Очищаем предыдущий контент
    this.content.appendChild(newContent); // Устанавливаем новый контент
  }

  // Регистрация слушателей событий

  public on(eventName: string, callback: (event: object) => void): void {
    this.emitter.on(eventName, callback);
  }

  // Эмитирует событие
  public emit(eventName: string, data?: any): void {
    this.emitter.emit(eventName, data);
  }

  // Обработка нажатия клавиши Escape
  private handleKeyDown(evt: KeyboardEvent): void {
    if (evt.key === 'Escape') {
      this.close();
    }
  }

  // Обработка кликов вне области модального окна
  private handleOutsideClick(evt: MouseEvent): void {
    const targetNode = evt.target as Node;
    if (
      !(targetNode instanceof Element) ||
      !this.content?.contains(targetNode)
    ) {
      this.close();
    }
  }

  // Инициализация слушателей событий
  protected initializeListeners(): void {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.body.addEventListener('click', this.handleOutsideClick.bind(this), true);

    const closeBtn = ensureElement('.modal__close', this.modalElement);
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }
  }

  // Записывает данные элемента модального окна
  protected setModalData(data: Record<string, unknown>): void {
    if (this.modalElement) {
      setElementData(this.modalElement, data);
    }
  }

  // Чтение данных элемента модального окна
  protected getModalData(schema: Record<string, Function>): Record<string, unknown> {
    if (this.modalElement) {
      return getElementData(this.modalElement, schema);
    }
    return {};
  }

  // Генерация BEM-класса
  protected generateBemClass(block: string, element?: string, modifier?: string): string {
    const bemResult = bem(block, element, modifier);
    return bemResult.class;
  }
}