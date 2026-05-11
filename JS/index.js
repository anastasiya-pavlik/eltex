/**
 * Хранилище
 */

const STORAGE_KEY = 'articles';

function getArticles() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveArticles(articles) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
}

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

const toggleBtn = document.getElementById('toggle-btn');
const section = document.querySelector('.main-form');
const cancelBtn = section?.querySelector('.btn-reset');
const form = section?.querySelector('form');

if (toggleBtn && section && cancelBtn && form) {

    toggleBtn.addEventListener('click', () => {
        if (section.classList.contains('is-open')) return;

        section.classList.add('is-open');

        const height = section.scrollHeight;
        section.style.height = height + 'px';

        section.addEventListener('transitionend', () => {
            section.style.height = 'auto';
        }, { once: true });
    });

    cancelBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const height = section.scrollHeight;
        section.style.height = height + 'px';

        requestAnimationFrame(() => {
            section.style.height = '0px';
            section.classList.remove('is-open');
        });

        form.reset();
    });
}

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
const emptyMessage = document.getElementById('empty-message');

function toggleEmptyMessage() {
    const articles = getArticles();

    if (articles.length === 0) {
        emptyMessage.classList.remove('hidden');
    } else {
        emptyMessage.classList.add('hidden');
    }
}

function createArticleElement(data) {
    const article = document.createElement('article');
    article.className = 'article article-grid flex';
    article.dataset.id = data.id;

    article.innerHTML = `
        <button class="article-close" type="button" data-close aria-label="Закрыть">
            <svg width="14" height="18" viewBox="0 0 14 18">
                <path d="M11 6V16H3V6H11ZM9.5 0H4.5L3.5 1H0V3H14V1H10.5L9.5 0ZM13 4H1V16C1 17.1 1.9 18 3 18H11C12.1 18 13 17.1 13 16V4Z" fill="#61C15C"/>
            </svg>
        </button>

        <div class="article-preview flex">
            <a href="#" class="article-preview-link">
                <h3 class="article-title">${data.title}</h3>
            </a>

            <p class="article-preview-time">
                <time datetime="${data.dateISO}">
                    ${data.dateText}
                </time>
            </p>

            <p class="article-preview-description">
                ${data.description}
            </p>
        </div>

        <img class="article-img" src="./img/article3.jpg" alt="Article image">`;

    return article;
}

function renderArticles() {
    const articles = getArticles();

    articles.forEach(data => {
        const article = createArticleElement(data);
        articleContainer.appendChild(article);

        // без анимации при загрузке
        article.classList.add('is-visible');
        article.style.height = 'auto';
    });
}

renderArticles();
toggleEmptyMessage();

addArticleButton.addEventListener('click', function(e) {
    e.preventDefault();

    const title = titleInput.value.trim();
    const description = textInput.value.trim();
    if (!title || !description) return;

    const now = new Date();

    const articleData = {
        id: Date.now().toString(),
        title,
        description,
        dateISO: now.toISOString(),
        dateText: now.toLocaleDateString()
    };

    // сохраняем
    const articles = getArticles();
    articles.push(articleData);
    saveArticles(articles);

    const article = createArticleElement(articleData);
    articleContainer.appendChild(article);

    // анимация
    const height = article.scrollHeight;
    article.style.height = '0px';

    requestAnimationFrame(() => {
        article.classList.add('is-visible');
        article.style.height = height + 'px';
    });

    article.addEventListener('transitionend', () => {
        article.style.height = 'auto';
    }, { once: true });

    titleInput.value = '';
    textInput.value = '';

    toggleEmptyMessage();
});

/**
 * удаление статьи
 */

// Делегирование события — удобно, если статьи добавляются динамически
// articleContainer.addEventListener('click', function(e) {
//     const btn = e.target.closest('[data-close]'); // если клик был на кнопке закрытия
//     if (!btn) return;

//     const article = btn.closest('article'); // находим родительский article
//     if (!article) return;

//     article.remove();
// });

articleContainer.addEventListener('click', function(e) {
    const btn = e.target.closest('[data-close]');
    if (!btn) return;

    const article = btn.closest('.article');
    if (!article) return;

    const id = article.dataset.id;

    //  удаляем из storage
    let articles = getArticles();
    articles = articles.filter(a => a.id !== id);
    saveArticles(articles);

    // анимация удаления
    const height = article.scrollHeight;
    article.style.height = height + 'px';

    requestAnimationFrame(() => {
        article.classList.add('is-removing');
        article.style.height = '0px';
    });

    article.addEventListener('transitionend', () => {
        article.remove();
    }, { once: true });

    toggleEmptyMessage();
});