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
const form = section.querySelector('form'); // сама форма

// Открытие секции
toggleBtn.addEventListener('click', () => {
    if (!section.classList.contains('is-open')) {
        section.classList.add('is-open');
        // устанавливаем max-height равным scrollHeight для плавного раскрытия
        section.style.maxHeight = section.scrollHeight + 'px';
    }
});

// Плавное закрытие секции по кнопке "Отмена" и очистка формы
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

    // Очистка всех полей формы
    form.reset();
});

/**
 * добавление статьи
 */
// const articleContainer = document.getElementById('article-container');
// const articleTemplate = document.getElementById('article-template');
// const addArticleButton = document.getElementById('add-article-button');

// addArticleButton.addEventListener('click', function(e) {
//     e.preventDefault(); // отменяем отправку формы

//     // Клонируем шаблон
//     const clonedArticle = articleTemplate.content.cloneNode(true);
//     const articleElement = clonedArticle.querySelector('article');

//     // Добавляем класс для анимации только к новой статье
//     articleElement.classList.add('new-article');

//     // Вставляем в контейнер
//     articleContainer.appendChild(articleElement);

//     // Плавное раскрытие
//     requestAnimationFrame(() => {
//         articleElement.classList.add('is-open');
//         articleElement.style.maxHeight = articleElement.scrollHeight + 'px';
//     });

//     // Сброс max-height после анимации
//     articleElement.addEventListener('transitionend', function handler(e) {
//         if (e.propertyName === 'max-height') {
//             articleElement.style.maxHeight = '';
//             articleElement.style.overflow = '';
//             // можно убрать класс animation, если нужно
//             articleElement.classList.remove('new-article');
//             articleElement.removeEventListener('transitionend', handler);
//         }
//     });
// });

const articleContainer = document.getElementById('article-container');
const addArticleButton = document.getElementById('add-article-button');
const titleInput = document.getElementById('title');
const textInput = document.getElementById('artic-text');

addArticleButton.addEventListener('click', function(e) {
    e.preventDefault(); // отменяем стандартное поведение формы

    // Получаем значения из формы
    const title = titleInput.value.trim();
    const description = textInput.value.trim();
    if (!title || !description) return; // не добавляем пустую статью

    // Создаём элемент статьи
    const article = document.createElement('article');
    article.className = 'article-grid flex';
    article.innerHTML = `
            <button class="article-close" type="button" data-close aria-label="Закрыть">
            <svg width="14" height="18" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 6V16H3V6H11ZM9.5 0H4.5L3.5 1H0V3H14V1H10.5L9.5 0ZM13 4H1V16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4Z" fill="#61C15C"/>
            </svg>
            </button>
            <div class="article-preview flex">
                <a href="#" class="article-preview-link">
                    <h3 class="article-title">${title}</h3>
                </a>
                <p class="article-preview-time"><time datetime="${new Date().toISOString()}">${new Date().toLocaleDateString()}</time></p>
                <p class="article-preview-description">${description}</p>
            </div>
            <img class="article-img" src="./img/article3.jpg" alt="Article image">
    `;

    // Стили для плавного появления
    article.style.overflow = 'hidden';
    article.style.maxHeight = '0px';
    article.style.opacity = '0';
    article.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';

    // Добавляем в контейнер
    articleContainer.appendChild(article);

    // Плавное раскрытие
    requestAnimationFrame(() => {
        article.style.maxHeight = article.scrollHeight + 'px';
        article.style.opacity = '1';
    });

    // После анимации убираем inline max-height
    article.addEventListener('transitionend', function handler(e) {
        if (e.propertyName === 'max-height') {
            article.style.maxHeight = '';
            article.style.overflow = '';
            article.removeEventListener('transitionend', handler);
        }
    });

    // Очистка полей формы после добавления
    titleInput.value = '';
    textInput.value = '';
});

/**
 * удаление статьи
 */

// Делегирование события — удобно, если статьи добавляются динамически
articleContainer.addEventListener('click', function(e) {
    const btn = e.target.closest('[data-close]'); // если клик был на кнопке закрытия
    if (!btn) return;

    const article = btn.closest('article'); // находим родительский article
    if (!article) return;

    article.remove();
});