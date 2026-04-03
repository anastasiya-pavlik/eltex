/**
 * Открытие диалогового окна
 */
const openModalBtnId = 'openModal';
const dialogId = 'modalwindow';

const openBtn = document.getElementById(openModalBtnId);
const dialog = document.getElementById(dialogId);

/**
 * Открытие (модально, с блокировкой взаимодействия со страницей)
 */
openBtn.addEventListener('click', () => {
    dialog.showModal();
});

/**
 * Закрытие по кнопке x
 */
const closeBtn = dialog.querySelector('[data-close]');
closeBtn.addEventListener('click', () => {
    dialog.close('x');
});

/**
 * Закрытие по клику на подложку:
 * dialog получает click, но проверяем что кликнули именно по самому <dialog>, не по контенту.
 */
dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close('backdrop');
});

/**
 * Открытие формы
 */

const toggleBtn = document.getElementById('toggle-btn'); // кнопка открытия
const section = document.querySelector('.main-form');
const cancelBtn = section.querySelector('.btn-reset'); // кнопка "Отмена"

// Открытие секции
toggleBtn.addEventListener('click', () => {
    if (!section.classList.contains('is-open')) {
        section.classList.add('is-open');
        // устанавливаем max-height равным scrollHeight для плавного раскрытия
        section.style.maxHeight = section.scrollHeight + 'px';
    }
});

// Плавное закрытие секции по кнопке "Отмена"
cancelBtn.addEventListener('click', (e) => {
    e.preventDefault(); // предотвращаем отправку формы
    if (section.classList.contains('is-open')) {
        // сбрасываем max-height на auto, чтобы плавно схлопывать
        const sectionHeight = section.scrollHeight;
        section.style.maxHeight = sectionHeight + 'px'; // зафиксировать текущую высоту
        section.style.opacity = '1'; // убедимся, что opacity на месте

        requestAnimationFrame(() => {
            // плавное схлопывание
            section.style.maxHeight = '0px';
            section.style.opacity = '0';
        });

        section.addEventListener('transitionend', function handler(event) {
            if (event.propertyName === 'max-height') {
                section.classList.remove('is-open');
                section.style.maxHeight = ''; // сбросим, чтобы auto работало при следующем открытии
                section.style.opacity = ''; // сброс
                section.removeEventListener('transitionend', handler);
            }
        });
    }
});

/**
 * добавление статьи
 */
const articleContainer = document.getElementById('article-container');
const articleTemplate = document.getElementById('article-template');
const addArticleButton = document.getElementById('add-article-button');

addArticleButton.addEventListener('click', function(e) {
    e.preventDefault(); // отменяем отправку формы

    // Клонируем шаблон
    const clonedArticle = articleTemplate.content.cloneNode(true);
    const articleElement = clonedArticle.querySelector('article');

    // Добавляем класс для анимации только к новой статье
    articleElement.classList.add('new-article');

    // Вставляем в контейнер
    articleContainer.appendChild(articleElement);

    // Плавное раскрытие
    requestAnimationFrame(() => {
        articleElement.classList.add('is-open');
        articleElement.style.maxHeight = articleElement.scrollHeight + 'px';
    });

    // Сброс max-height после анимации
    articleElement.addEventListener('transitionend', function handler(e) {
        if (e.propertyName === 'max-height') {
            articleElement.style.maxHeight = '';
            articleElement.style.overflow = '';
            // можно убрать класс animation, если нужно
            articleElement.classList.remove('new-article');
            articleElement.removeEventListener('transitionend', handler);
        }
    });
});