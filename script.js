document.addEventListener('DOMContentLoaded', () => {

    // === ЧАСТИЦЫ НА ФОНЕ ===
    const particlesContainer = document.getElementById('particles');
    const PARTICLE_COUNT = 25;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = (8 + Math.random() * 12) + 's';
        p.style.animationDelay = (Math.random() * 10) + 's';
        p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
        particlesContainer.appendChild(p);
    }

    // === СЧЁТЧИК СТАТИСТИКИ ===
    function animateCounter(el, target, duration = 1500) {
        const start = performance.now();
        const update = (time) => {
            const elapsed = time - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target);
            if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    }

    let countersStarted = false;
    const statsSection = document.querySelector('.hero__stats');
    const statsObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !countersStarted) {
            countersStarted = true;
            document.querySelectorAll('.stat__num').forEach(el => {
                animateCounter(el, +el.dataset.target);
            });
        }
    }, { threshold: 0.5 });
    if (statsSection) statsObserver.observe(statsSection);

    // === ПЛАВНЫЙ СКРОЛЛ К КАРТЕ ===
    const btnOpenMap = document.getElementById('btn-open-map');
    btnOpenMap.addEventListener('click', () => {
        document.getElementById('map-section').scrollIntoView({ behavior: 'smooth' });
    });

    // === АНИМАЦИЯ ПОЯВЛЕНИЯ ===
    const fadeElements = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    fadeElements.forEach(el => observer.observe(el));

    // === КНОПКА "НАВЕРХ" ===
    const scrollTopBtn = document.getElementById('scroll-top');
    window.addEventListener('scroll', () => {
        scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    });
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // === МОДАЛЬНОЕ ОКНО ===
    const modal = document.getElementById('video-modal');
    const modalClose = document.getElementById('modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalVideo = document.getElementById('modal-video');
    const modalTags = document.getElementById('modal-tags');

    const openModal = (title, desc, videoSrc, tags = []) => {
        modalTitle.textContent = title;
        modalDesc.textContent = desc;
        modalVideo.src = videoSrc;
        modalTags.innerHTML = tags.map(t => '<span class="modal-tag">' + t + '</span>').join('');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        modalVideo.play().catch(() => {});
    };

    const closeModal = () => {
        modal.classList.remove('active');
        modalVideo.pause();
        modalVideo.src = '';
        document.body.style.overflow = '';
    };

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });

    // === БАЗА ДАННЫХ ЛОКАЦИЙ ===
    const locations = [
        {
            coords: [58.5878, 49.6055],
            title: "Кочуровский парк",
            desc: "Одно из самых популярных мест на Юго-Западе. Главная точка притяжения — современный скейт-парк и памп-трек. Это идеальная локация для любителей экстрима (скейт, самокат, BMX) и тех, кто просто хочет потусоваться с друзьями. Много свободного места, просторные газоны и отличная инфраструктура для активного вечера.",
            videoSrc: "videos/kochuropark.mp4",
            imageUrl: "images/kochuropark.jpg",
            tags: ["🌿 Парк", "🛹 Скейт-парк", "🏃 Активный"],
            category: ["park", "extreme"]
        },
        {
            coords: [58.6023, 49.6819],
            title: "Пешеходная ул. Спасская (Кировский Арбат)",
            desc: "Исторический центр города и главная прогулочная улица. Брусчатка, старинная архитектура, множество уютных кофеен и уличные музыканты. Сюда приходят погулять, сделать красивые эстетичные кадры для соцсетей и просто почувствовать ритм города. По выходным здесь всегда кипит жизнь.",
            videoSrc: "videos/spasskaya.mp4",
            imageUrl: "images/spasskaya.jpg",
            tags: ["🏛️ Центр", "📸 Фото", "☕ Кофейни"],
            category: ["center"]
        },
        {
            coords: [58.6097, 49.6867],
            title: "Набережная Грина",
            desc: "Классика города, которую нельзя пропустить. Длинный и ухоженный променад вдоль реки — идеальное место для долгих прогулок с друзьями или свиданий. Именно отсюда открываются лучшие виды на закаты в Кирове. Из минусов: у реки часто бывает ветрено, поэтому вечером лучше брать с собой теплую кофту.",
            videoSrc: "videos/naberezhnaya.mp4",
            imageUrl: "images/naberezhnaya.jpg",
            tags: ["🌊 Набережная", "🌅 Закаты", "🚶 Прогулки"],
            category: ["center"]
        },
        {
            coords: [58.5972, 49.6708],
            title: "Сквер 60-летия СССР",
            desc: "Стильное, современное и полностью обновленное пространство. Вместо обычных лавочек — удобный деревянный амфитеатр, качественное вечернее освещение и ухоженные дорожки. Отличное место, чтобы взять кофе навынос, посидеть с компанией или просто отдохнуть в спокойной обстановке в самом центре.",
            videoSrc: "videos/skver.mp4",
            imageUrl: "images/skver.jpeg",
            tags: ["🏛️ Центр", "✨ Обновлённый", "🌙 Вечером"],
            category: ["center", "park"]
        },
        {
            coords: [58.6079, 49.6863],
            title: "Александровский сад",
            desc: "Один из старейших и самых красивых парков Кирова. Тенистые аллеи, классические ротонды и знаменитый Мост влюбленных. Место отлично подходит как для спокойных семейных прогулок днем, так и для вечерних тусовок молодежи — здесь часто собираются компаниями, общаются и поют песни под гитару.",
            videoSrc: "videos/aleksandrovskiy.mp4",
            imageUrl: "images/aleksandrovskiy.jpeg",
            tags: ["🌿 Парк", "🏛️ Исторический", "💑 Свидание"],
            category: ["park", "center"]
        },
        {
            coords: [58.5988, 49.6707],
            title: "Ботанический сад",
            desc: "Настоящий зеленый оазис посреди шумных улиц. Вход сюда платный, но это полностью компенсируется красотой локации. Узкие тропинки, множество редких растений и цветов создают идеальный фон для портретных фотографий. Отличное место, чтобы сбежать от городской суеты и сделать красивый контент.",
            videoSrc: "videos/botsad.mp4",
            imageUrl: "images/botsad.jpeg",
            tags: ["🌿 Парк", "📸 Фото", "🌸 Природа"],
            category: ["park"]
        },
        {
            coords: [58.5912, 49.6543],
            title: "Парк имени Кирова (у Цирка)",
            desc: "Самая универсальная локация в городе, где каждый найдет занятие по душе. Здесь есть живописные пруды с утками, аллеи для неспешных прогулок, колесо обозрения для классных панорамных видео и современные спортивные площадки (воркаут).",
            videoSrc: "videos/park_kirova.mp4",
            imageUrl: "images/park_kirova.jpeg",
            tags: ["🌿 Парк", "🎡 Аттракционы", "💪 Воркаут"],
            category: ["park", "extreme"]
        },
        {
            coords: [58.6035, 49.6670],
            title: "Театральная площадь",
            desc: "Сердце города и самая известная точка для встреч. Огромное открытое пространство, где летом работает главный фонтан — настоящее спасение в жару. Из-за ровного покрытия здесь часто катаются на самокатах и роликах. Отличная стартовая точка для любого маршрута по Кирову.",
            videoSrc: "videos/teatralnaya.mp4",
            imageUrl: "images/teatralnaya.jpg",
            tags: ["🏛️ Центр", "⛲ Фонтан", "🛴 Самокаты"],
            category: ["center", "extreme"]
        },
        {
            coords: [58.6095, 49.6111],
            title: "Парк Победы",
            desc: "Самый масштабный парк города для тех, кто любит простор. Широкие длинные аллеи идеально подходят для катания на велосипедах, роликах или долгих пеших прогулок. Благодаря огромной территории здесь комфортно собираться даже очень большими компаниями.",
            videoSrc: "videos/pobedy.mp4",
            imageUrl: "images/pobedy.jpg",
            tags: ["🌿 Парк", "🚲 Велосипед", "👥 Компания"],
            category: ["park", "extreme"]
        },
        {
            coords: [58.5215, 49.6886],
            title: "Дендропарк",
            desc: "Кусочек настоящего леса прямо в черте города (Нововятский район). Густые деревья, живописные тропинки, деревянные мостики и водоемы. Если хочется на пару часов сменить городские пейзажи на природу, подышать свежим воздухом и сделать красивые лесные фотографии — вам сюда.",
            videoSrc: "videos/dendropark.mp4",
            imageUrl: "images/dendropark.jpg",
            tags: ["🌿 Парк", "🌲 Лес", "📸 Фото"],
            category: ["park"]
        },
        {
            coords: [58.6146, 49.6015],
            title: "ТРЦ «Макси»",
            desc: "Главная крытая точка притяжения для молодежи. Когда на улице льет дождь или стоят сильные морозы, все идут сюда. Огромный фудкорт становится базой для долгих посиделок с друзьями, а множество магазинов позволяют совместить встречу с полезным шопингом.",
            videoSrc: "videos/maxi.mp4",
            imageUrl: "images/maxi.jpg",
            tags: ["🏢 Крытое", "🍔 Фудкорт", "🛍️ Шопинг"],
            category: ["indoor"]
        }
    ];

    // === ЯНДЕКС КАРТА ===
    let allPlacemarks = [];
    let mapInstance = null;
    let activeFilter = 'all';

    ymaps.ready(initMap);

    function initMap() {
        const kirovCenter = [58.6035, 49.6668];
        const kirovBounds = [[58.5000, 49.5000], [58.6500, 49.7500]];

        mapInstance = new ymaps.Map("map", {
            center: kirovCenter,
            zoom: 13,
            controls: []
        }, {
            restrictMapArea: kirovBounds,
            minZoom: 12,
            suppressMapOpenBlock: true
        });

        const CustomPlacemarkLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="custom-placemark"><img src="{{ properties.iconImage }}" alt="Метка"></div>'
        );

        locations.forEach((loc) => {
            const placemark = new ymaps.Placemark(loc.coords, {
                iconImage: loc.imageUrl,
                hintContent: loc.title
            }, {
                iconLayout: CustomPlacemarkLayout,
                hasBalloon: false,
                iconShape: { type: 'Circle', coordinates: [0, 0], radius: 30 }
            });

            placemark.events.add('click', () => {
                openModal(loc.title, loc.desc, loc.videoSrc, loc.tags);
            });

            mapInstance.geoObjects.add(placemark);
            allPlacemarks.push({ placemark, loc });
        });

        setTimeout(() => {
            const container = document.querySelector('.map-container');
            if (container && container.firstElementChild) {
                container.firstElementChild.style.filter = 'invert(90%) hue-rotate(180deg) contrast(90%)';
            }
        }, 1000);
    }

    // Фокус на локации (из поиска)
    function focusOnLocation(loc) {
        document.getElementById('map-section').scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            if (mapInstance) mapInstance.setCenter(loc.coords, 15, { duration: 500 });
            openModal(loc.title, loc.desc, loc.videoSrc, loc.tags);
        }, 700);
    }

    // === ФИЛЬТРЫ НА КАРТЕ ===
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            allPlacemarks.forEach(({ placemark, loc }) => {
                const visible = activeFilter === 'all' || loc.category.includes(activeFilter);
                if (visible) mapInstance.geoObjects.add(placemark);
                else mapInstance.geoObjects.remove(placemark);
            });
        });
    });

    // === ПОИСК ПО ТЕГАМ ===
    const allTags = [...new Set(locations.flatMap(loc => loc.tags))].sort();
    const tagCloud = document.getElementById('tag-cloud');
    const searchResults = document.getElementById('search-results');
    const selectedTags = new Set();

    allTags.forEach(tag => {
        const pill = document.createElement('button');
        pill.className = 'tag-pill';
        pill.textContent = tag;
        pill.addEventListener('click', () => {
            if (selectedTags.has(tag)) {
                selectedTags.delete(tag);
                pill.classList.remove('selected');
            } else {
                selectedTags.add(tag);
                pill.classList.add('selected');
            }
            renderSearchResults();
        });
        tagCloud.appendChild(pill);
    });

    function renderSearchResults() {
        if (selectedTags.size === 0) {
            searchResults.innerHTML = '<p class="search-placeholder">👆 Выбери тег выше, чтобы найти места</p>';
            return;
        }

        const matched = locations.filter(loc =>
            loc.tags.some(t => selectedTags.has(t))
        );

        if (matched.length === 0) {
            searchResults.innerHTML = '<p class="search-no-results">😔 Нет мест с такими тегами</p>';
            return;
        }

        const grid = document.createElement('div');
        grid.className = 'search-results-grid';

        matched.forEach(loc => {
            const card = document.createElement('div');
            card.className = 'result-card';

            const tagsHtml = loc.tags.map(t => {
                const highlighted = selectedTags.has(t) ? 'style="background:rgba(255,94,0,0.25);border-color:var(--accent-orange)"' : '';
                return '<span class="result-card__tag" ' + highlighted + '>' + t + '</span>';
            }).join('');

            card.innerHTML =
                '<div class="result-card__img-placeholder">📍</div>' +
                '<div class="result-card__body">' +
                    '<div class="result-card__title">' + loc.title + '</div>' +
                    '<div class="result-card__tags">' + tagsHtml + '</div>' +
                    '<div class="result-card__action">▶ Показать на карте</div>' +
                '</div>';

            // Попытаться загрузить картинку
            if (loc.imageUrl) {
                const img = new Image();
                img.onload = () => {
                    const placeholder = card.querySelector('.result-card__img-placeholder');
                    if (placeholder) {
                        const imgEl = document.createElement('img');
                        imgEl.className = 'result-card__img';
                        imgEl.src = loc.imageUrl;
                        imgEl.alt = loc.title;
                        placeholder.replaceWith(imgEl);
                    }
                };
                img.src = loc.imageUrl;
            }

            card.addEventListener('click', () => focusOnLocation(loc));
            grid.appendChild(card);
        });

        searchResults.innerHTML = '';
        searchResults.appendChild(grid);
    }

});
