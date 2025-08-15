// SuccessView.ts

import { Modal } from './Modal';
import { cloneTemplate, ensureElement } from '../utils/utils';

export class SuccessView {
  private static instance: SuccessView | null = null;
  private modal: Modal | null = null;

  constructor() {}

  public static getInstance(events: any): SuccessView {
    return SuccessView.instance || (SuccessView.instance = new SuccessView());
  }

  initialize(events: any): void {
    this.modal = Modal.getInstance('#modal-container');
  }

  prepareContent(totalAmount: number): HTMLElement {
    const successContent = cloneTemplate('#success')!;
    const descriptionEl = ensureElement('.order-success__description', successContent)!;
    descriptionEl.textContent = `Итого списано: ${totalAmount} синапсов.`;

    const closeButton = ensureElement('.order-success__close', successContent) as HTMLButtonElement;
    closeButton.onclick = () => this.modal?.close();

    return successContent;
  }

  showSuccess(totalAmount: number): void {
    const content = this.prepareContent(totalAmount);
    this.modal?.setContent(content);
    this.modal?.open();
  }
}