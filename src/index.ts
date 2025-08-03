// index.ts

// Подключаем компоненты и стили
import './scss/styles.scss';
import { loadAndRenderProducts } from './components/Page';

// После полной загрузки страницы запускаем загрузку и рендеринг продуктов
window.onload = () => {
  loadAndRenderProducts()
    .then(() => console.info('Продукты успешно загружены.'))
    .catch((err) => console.error('Ошибка загрузки продуктов:', err));
};