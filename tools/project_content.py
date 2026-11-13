# -*- coding: utf-8 -*-
"""Editorial content for the project landing pages (RU + EN).

Facts here were checked against the live projects: what each tool exports,
its limits, and who it is for. Nothing is invented about usage or reviews.
"""

CONTENT = {
    "levelseed": {
        "ru": {
            "tagline": "Повторяемые игровые карты по зерну генерации.",
            "who": "Инди-разработчики и ведущие настольных игр, которым нужна быстрая основа для уровня.",
            "what": "Три алгоритма генерации (BSP, клеточный автомат, блуждание), несколько биомов и размеров. Одно и то же зерно всегда даёт ту же карту, а пошаговая визуализация показывает, как она строилась. Уровень можно пройти прямо в браузере.",
            "result": "Играбельная карта, её seed, ссылка и экспорт JSON. Карту до 64 × 40 клеток можно передать в PATHLAB для проверки маршрутов.",
            "limits": "Это генератор заготовок, а не готовая игра: комнаты и враги расставляются автоматически и требуют ручной доработки.",
        },
        "en": {
            "tagline": "Repeatable game maps from a seed.",
            "who": "Indie developers and tabletop game masters who need a quick base for a level.",
            "what": "Three generation algorithms (BSP, cellular automata, random walk), several biomes and sizes. The same seed always yields the same map, and a step-by-step view shows how it was built. The level can be played in the browser.",
            "result": "A playable map, its seed, a share link and a JSON export. Maps up to 64 × 40 tiles can be passed to PATHLAB to check routes.",
            "limits": "It generates starting points, not finished games: rooms and enemies are placed automatically and need manual polish.",
        },
    },
    "pathfinding-visualizer": {
        "ru": {
            "tagline": "Проверка уровня на достижимость выхода и обязательных комнат.",
            "who": "Дизайнеры уровней, которые хотят проверить карту до передачи в игру.",
            "what": "Загрузите карту из LevelSeed или нарисуйте свою, отметьте обязательные цели и запустите проверку алгоритмами BFS, Дейкстры или A*. Показывается маршрут, его длина и цена по рельефу, а недостижимые цели перечисляются с координатами.",
            "result": "Отчёт для команды со списком проблемных клеток и маршрут в JSON.",
            "limits": "Сетка до 64 × 40 клеток. Движение по 4 или 8 направлениям, без физики и скорости персонажа.",
        },
        "en": {
            "tagline": "Check that a level's exit and required rooms are reachable.",
            "who": "Level designers who want to validate a map before handing it to the game.",
            "what": "Import a LevelSeed map or draw your own, mark required goals and run BFS, Dijkstra or A*. It shows the route, its length and terrain cost, and lists unreachable goals with their coordinates.",
            "result": "A team report listing problem tiles, and the route as JSON.",
            "limits": "Grids up to 64 × 40 tiles. Movement in 4 or 8 directions, with no physics or character speed.",
        },
    },
    "branchbook": {
        "ru": {
            "tagline": "Интерактивная история о маяке с 8 концовками.",
            "who": "Читатели, которым интересна история, где выбор меняет отношения, место действия и доступные сцены.",
            "what": "45 сцен, восемь концовок и несколько показателей (состояние маяка, риск для города, срок до шторма). Решения открывают или закрывают пути, а заметки читателя собираются по ходу чтения.",
            "result": "Персональный маршрут по истории и открытые концовки.",
            "limits": "Это короткая история, а не движок для историй: сюжет зашит в данных проекта.",
        },
        "en": {
            "tagline": "An interactive lighthouse story with 8 endings.",
            "who": "Readers who enjoy a story where choices change relationships, setting and the scenes still available.",
            "what": "45 scenes, eight endings and several tracked values (lighthouse condition, risk to the town, days before the storm). Decisions open or close paths, and reader notes build up as you read.",
            "result": "A personal route through the story and the endings you have unlocked.",
            "limits": "A short story, not a story engine: the plot is fixed in the project data.",
        },
    },
    "photo-terrain": {
        "ru": {
            "tagline": "Фотография или образец превращаются в рельефную заготовку.",
            "who": "Художники и прототипировщики, которым нужна карта высот или модель для печати.",
            "what": "Яркость снимка становится высотой. Доступны три способа показа (рельеф, высота, уклон), линии горизонталей и цветовые шкалы. Фото обрабатывается в браузере и никуда не отправляется.",
            "result": "Карта высот в PNG, сетка в OBJ и закрытая модель для печати в OBJ или STL с заданной шириной и основанием.",
            "limits": "Яркость кадра не равна реальной высоте: это художественная заготовка, а не топографическая съёмка.",
        },
        "en": {
            "tagline": "Turn a photo or sample into a relief blank.",
            "who": "Artists and prototypers who need a height map or a printable model.",
            "what": "Image brightness becomes height. Three views (relief, elevation, slope), contour lines and colour scales. The photo is processed in the browser and never uploaded.",
            "result": "A height map PNG, a heightfield OBJ, and a closed printable model as OBJ or STL with a chosen width and base.",
            "limits": "Brightness is not real elevation: this is an artistic blank, not a topographic survey.",
        },
    },
    "tonal": {
        "ru": {
            "tagline": "Палитра из фотографии с проверкой контраста.",
            "who": "Дизайнеры, которые берут цвета из снимка и проверяют, пригодны ли они для интерфейса.",
            "what": "Находит главные оттенки кадра, оценивает контраст по WCAG и показывает, как цвета работают в ролях интерфейса: текст, второй текст, акцент и текст на акценте на светлом и тёмном фоне.",
            "result": "CSS-переменные (включая роли интерфейса) и JSON с палитрой.",
            "limits": "Автоматический подбор ролей даёт отправную точку: итоговую тему стоит проверить на реальных экранах.",
        },
        "en": {
            "tagline": "A photo palette with contrast checks.",
            "who": "Designers who take colours from a photograph and need to know whether they work for an interface.",
            "what": "Finds the dominant colours, rates contrast against WCAG and shows how they behave in interface roles: text, secondary text, accent and text on accent, in light and dark.",
            "result": "CSS variables (including interface roles) and a JSON palette.",
            "limits": "Automatic role assignment is a starting point; check the final theme on real screens.",
        },
    },
    "exposure-lab": {
        "ru": {
            "tagline": "Калькулятор экспозиции с тестовой сценой.",
            "who": "Фотографы, которые подбирают экспозицию под сцену и проверяют автоматику камеры.",
            "what": "Диафрагма, выдержка и ISO меняют яркость и глубину резкости сцены. Есть режим «Авто», пресеты освещения, настройки фокуса и баланса белого. Показывается EV сцены и отклонение в стопах.",
            "result": "Подобранные параметры кадра и полевая заметка, которую можно сохранить.",
            "limits": "Это учебная модель экспозиции, а не замена экспонометру.",
        },
        "en": {
            "tagline": "An exposure calculator with a test scene.",
            "who": "Photographers who work out exposure for a scene and check how camera automation behaves.",
            "what": "Aperture, shutter and ISO change the brightness and depth of field of the scene. It has an Auto mode, lighting presets, focus and white balance settings, and shows scene EV and deviation in stops.",
            "result": "Chosen shot settings and a field note you can save.",
            "limits": "A teaching model of exposure, not a replacement for a light meter.",
        },
    },
    "pixel-animation-studio": {
        "ru": {
            "tagline": "Редактор пиксельной анимации с экспортом GIF.",
            "who": "Создатели небольших 2D-игр и веб-проектов, которым нужна анимация спрайта.",
            "what": "Холст, палитра, кадры с «луковицей», просмотр в цикле на разных скоростях. До 24 кадров, отмена и повтор, горячие клавиши.",
            "result": "GIF с прозрачным фоном, PNG-лист кадров и JSON с описанием кадров.",
            "limits": "Лёгкий редактор для коротких циклов, без слоёв и сложных инструментов.",
        },
        "en": {
            "tagline": "A pixel animation editor with GIF export.",
            "who": "Makers of small 2D games and web projects who need sprite animation.",
            "what": "Canvas, palette, frames with onion skin, looped preview at several speeds. Up to 24 frames, undo and redo, keyboard shortcuts.",
            "result": "A transparent GIF, a PNG frame sheet and a JSON frame description.",
            "limits": "A light editor for short loops, without layers or advanced tools.",
        },
    },
    "plant-growth": {
        "ru": {
            "tagline": "Варианты роста растения для сцены или участка.",
            "who": "Художники окружения, садовые дизайнеры и преподаватели, которым нужно сравнить формы растения.",
            "what": "Дуб, берёза, папоротник и монстера. Возраст, свет, вода и ветер заметно меняют ствол, ветвление и крону. Образцы можно подписать и собрать в лист сравнения.",
            "result": "Подписанный лист концепции в PNG для обсуждения или передачи в работу.",
            "limits": "Модель показывает форму, а не прогнозирует биологический рост.",
        },
        "en": {
            "tagline": "Plant growth variants for a scene or a plot.",
            "who": "Environment artists, garden designers and teachers who need to compare plant forms.",
            "what": "Oak, birch, fern and monstera. Age, light, water and wind visibly change trunk, branching and crown. Samples can be labelled and gathered into a comparison sheet.",
            "result": "A labelled concept sheet as PNG for discussion or hand-off.",
            "limits": "The model visualises form; it does not predict biological growth.",
        },
    },
    "waymark": {
        "ru": {
            "tagline": "Маршруты с учётом ступеней, уклонов и переходов.",
            "who": "Жители и городские команды, которые проверяют доступность конкретного маршрута.",
            "what": "На учебной карте сравнивает маршруты для кресла-коляски, ходунков, коляски и пешехода. Сразу видно, где подтверждённые препятствия, а где данных нет. Участки можно отмечать и править.",
            "result": "Отчёт, список участков в CSV и переносимая схема улиц в JSON.",
            "limits": "Карта демонстрационная и не является официальной навигацией: условия на месте нужно проверять.",
        },
        "en": {
            "tagline": "Routes that account for steps, slopes and crossings.",
            "who": "Residents and city teams who check the accessibility of a specific route.",
            "what": "On a sample map it compares routes for wheelchairs, walkers, strollers and pedestrians. It shows where obstacles are confirmed and where data is missing, and segments can be marked and edited.",
            "result": "A report, a CSV list of segments and a portable street map as JSON.",
            "limits": "The map is a demonstration, not official navigation: conditions must be verified on site.",
        },
    },
    "waterline": {
        "ru": {
            "tagline": "Учебная модель дождя, прилива и защиты побережья.",
            "who": "Команды и классы, которые изучают, как осадки, прилив и локальные меры меняют риски в условном районе.",
            "what": "Меняйте дождь и прилив, ставьте насосы, дождевые сады и валы и смотрите, как вода распределяется по кварталам, дорогам и людям. Исходный прогон можно сохранить и сравнить с вариантом с защитой.",
            "result": "Сравнение сценариев и заметка с исходными условиями.",
            "limits": "Это упрощённая учебная модель, а не прогноз наводнения.",
        },
        "en": {
            "tagline": "A teaching model of rain, tide and coastal protection.",
            "who": "Teams and classes studying how rainfall, tide and local measures change risk in a fictional district.",
            "what": "Adjust rain and tide, place pumps, rain gardens and barriers, and watch how water spreads across blocks, roads and people. A baseline run can be saved and compared with a protected run.",
            "result": "A scenario comparison and a note with the starting conditions.",
            "limits": "A simplified teaching model, not a flood forecast.",
        },
    },
    "mendbook": {
        "ru": {
            "tagline": "Паспорт вещей: покупки, гарантии, ремонт.",
            "who": "Владельцы техники и вещей, которые решают, чинить или менять.",
            "what": "Карточки вещей с датой покупки, ценой, гарантией и историей обслуживания, напоминания о проверке и сравнение стоимости месяца при ремонте и замене. Данные хранятся только на вашем устройстве, приложение работает офлайн.",
            "result": "Локальный паспорт вещей, напоминания и резервная копия в JSON.",
            "limits": "Расчёт ремонта и замены ориентировочный: он не учитывает простой, удобство и утилизацию.",
        },
        "en": {
            "tagline": "A passport for your belongings: purchases, warranties, repairs.",
            "who": "Owners of devices and things who decide whether to repair or replace.",
            "what": "Item cards with purchase date, price, warranty and service history, check reminders, and a monthly-cost comparison between repair and replacement. Data stays on your device and the app works offline.",
            "result": "A local item passport, reminders and a JSON backup.",
            "limits": "The repair-versus-replace figure is indicative: it ignores downtime, convenience and disposal.",
        },
    },
    "slatehouse": {
        "ru": {
            "tagline": "Съёмочный день: сцены, свет, переезды, сбор группы.",
            "who": "Небольшие съёмочные группы, которые собирают план смены.",
            "what": "Сцены группируются по площадкам и свету, считается порядок, переезды и время сбора актёров. Ночные и дневные сцены, длительность по вашей оценке, проверка конфликтов (закат, длина смены, число переездов).",
            "result": "Лист сбора для группы и рабочая копия проекта.",
            "limits": "Время закатных ограничений задано по умолчанию. Погоду вы вводите вручную, она не подтягивается из прогноза.",
        },
        "en": {
            "tagline": "A shooting day: scenes, light, moves and call times.",
            "who": "Small film crews putting together a shooting schedule.",
            "what": "Scenes are grouped by location and light, and the order, moves and cast call times are worked out. Day and night scenes, durations set from your own estimates, and checks for conflicts (sunset, shift length, number of moves).",
            "result": "A call sheet for the crew and a working copy of the project.",
            "limits": "Sunset limits use a default time. Weather is typed in by hand and is not pulled from a forecast.",
        },
    },
}
