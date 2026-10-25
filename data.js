/* Данные маркетплейса: города, точки «рядом с домом/учёбой», автошколы, группы и тарифы.
   Автошколы, цены и отзывы — демонстрационные (вымышленные). */
window.DATA = (() => {
  const DAYS = [['mon', 'Пн'], ['tue', 'Вт'], ['wed', 'Ср'], ['thu', 'Чт'], ['fri', 'Пт'], ['sat', 'Сб'], ['sun', 'Вс']];
  const WEEK = ['mon', 'tue', 'wed', 'thu', 'fri'];
  const ALL = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const ANY = ['morning', 'day', 'evening'];

  const CITIES = [
    { name: 'Москва', districts: ['ЦАО', 'САО', 'СВАО', 'ВАО', 'ЮВАО', 'ЮАО', 'ЮЗАО', 'ЗАО', 'СЗАО'] },
    { name: 'Химки', districts: ['Центр', 'Левобережный', 'Сходня'] },
    { name: 'Мытищи', districts: ['Центр', 'Перловка', 'Строитель'] },
  ];

  const PLACE_TYPES = { metro: 'Метро', uni: 'Вузы', station: 'Станции' };

  const PLACES = [
    { id: 'm-tverskaya', type: 'metro', city: 'Москва', name: 'м. Тверская', lat: 55.7650, lng: 37.6050 },
    { id: 'm-kurskaya', type: 'metro', city: 'Москва', name: 'м. Курская', lat: 55.7586, lng: 37.6590 },
    { id: 'm-kitay', type: 'metro', city: 'Москва', name: 'м. Китай-город', lat: 55.7565, lng: 37.6315 },
    { id: 'm-baumanskaya', type: 'metro', city: 'Москва', name: 'м. Бауманская', lat: 55.7724, lng: 37.6790 },
    { id: 'm-vdnh', type: 'metro', city: 'Москва', name: 'м. ВДНХ', lat: 55.8211, lng: 37.6411 },
    { id: 'm-medvedkovo', type: 'metro', city: 'Москва', name: 'м. Медведково', lat: 55.8881, lng: 37.6616 },
    { id: 'm-sokol', type: 'metro', city: 'Москва', name: 'м. Сокол', lat: 55.8053, lng: 37.5150 },
    { id: 'm-rechnoy', type: 'metro', city: 'Москва', name: 'м. Речной вокзал', lat: 55.8546, lng: 37.4760 },
    { id: 'm-shchukinskaya', type: 'metro', city: 'Москва', name: 'м. Щукинская', lat: 55.8094, lng: 37.4644 },
    { id: 'm-izmaylovskaya', type: 'metro', city: 'Москва', name: 'м. Измайловская', lat: 55.7876, lng: 37.7811 },
    { id: 'm-vyhino', type: 'metro', city: 'Москва', name: 'м. Выхино', lat: 55.7159, lng: 37.8183 },
    { id: 'm-kuzminki', type: 'metro', city: 'Москва', name: 'м. Кузьминки', lat: 55.7055, lng: 37.7656 },
    { id: 'm-tulskaya', type: 'metro', city: 'Москва', name: 'м. Тульская', lat: 55.7087, lng: 37.6224 },
    { id: 'm-prazhskaya', type: 'metro', city: 'Москва', name: 'м. Пражская', lat: 55.6116, lng: 37.6034 },
    { id: 'm-universitet', type: 'metro', city: 'Москва', name: 'м. Университет', lat: 55.6926, lng: 37.5344 },
    { id: 'm-profsoyuznaya', type: 'metro', city: 'Москва', name: 'м. Профсоюзная', lat: 55.6777, lng: 37.5627 },
    { id: 'm-yugozapadnaya', type: 'metro', city: 'Москва', name: 'м. Юго-Западная', lat: 55.6634, lng: 37.4830 },
    { id: 'm-kievskaya', type: 'metro', city: 'Москва', name: 'м. Киевская', lat: 55.7432, lng: 37.5654 },
    { id: 'm-kuntsevskaya', type: 'metro', city: 'Москва', name: 'м. Кунцевская', lat: 55.7307, lng: 37.4459 },
    { id: 'u-msu', type: 'uni', city: 'Москва', name: 'МГУ им. Ломоносова', lat: 55.7030, lng: 37.5302 },
    { id: 'u-bmstu', type: 'uni', city: 'Москва', name: 'МГТУ им. Баумана', lat: 55.7660, lng: 37.6857 },
    { id: 'u-hse', type: 'uni', city: 'Москва', name: 'НИУ ВШЭ (Покровка)', lat: 55.7546, lng: 37.6480 },
    { id: 'u-rudn', type: 'uni', city: 'Москва', name: 'РУДН', lat: 55.6510, lng: 37.4995 },
    { id: 'u-mgimo', type: 'uni', city: 'Москва', name: 'МГИМО', lat: 55.6703, lng: 37.4847 },
    { id: 'u-mephi', type: 'uni', city: 'Москва', name: 'НИЯУ МИФИ', lat: 55.6503, lng: 37.6640 },
    { id: 'u-rea', type: 'uni', city: 'Москва', name: 'РЭУ им. Плеханова', lat: 55.7275, lng: 37.6260 },
    { id: 'u-mai', type: 'uni', city: 'Москва', name: 'МАИ', lat: 55.8113, lng: 37.4999 },
    { id: 's-khimki', type: 'station', city: 'Химки', name: 'ст. Химки', lat: 55.8970, lng: 37.4297 },
    { id: 's-levober', type: 'station', city: 'Химки', name: 'ст. Левобережная', lat: 55.8713, lng: 37.4729 },
    { id: 's-mytishchi', type: 'station', city: 'Мытищи', name: 'ст. Мытищи', lat: 55.9116, lng: 37.7308 },
    { id: 's-perlovskaya', type: 'station', city: 'Мытищи', name: 'ст. Перловская', lat: 55.8930, lng: 37.7260 },
  ];

  const SCHOOLS = [
    {
      id: 'start', name: 'Старт', city: 'Москва', district: 'САО', address: 'Ленинградский пр-т, 74', near: 'м. Сокол',
      lat: 55.8046, lng: 37.5176, rating: 4.8, reviews: 312, founded: 2009, pass: 78, fleet: 24, instructors: 18, hue: 214,
      cars: 'Hyundai Solaris, Kia Rio, Haval Jolion (АКПП)',
      about: 'Одна из старейших школ севера Москвы: собственный закрытый автодром у метро и учебные классы на 30 мест. Делают упор на городские маршруты, по которым проходит экзамен в Госавтоинспекции.',
      features: ['Собственный автодром', 'Онлайн-запись на вождение', 'Маршруты экзамена ГИБДД'],
      groups: [
        { id: 'start-g1', name: 'Вечерняя группа', days: ['mon', 'wed'], time: 'evening', hours: '19:00–21:30', start: '2026-11-09', seats: 7 },
        { id: 'start-g2', name: 'Группа выходного дня', days: ['sat'], time: 'day', hours: '10:00–14:00', start: '2026-11-14', seats: 4 },
      ],
      reviewsList: [
        { n: 'Алина К.', r: 5, d: '2026-09-14', t: 'Сдала с первого раза и теорию, и город. Инструктор спокойно объясняет, вождение по экзаменационным маршрутам очень помогло.' },
        { n: 'Михаил Д.', r: 4, d: '2026-08-02', t: 'Хорошая теория и классы, но записаться на вечернее вождение бывает сложно — слоты разбирают за неделю.' },
      ],
      tariffs: [
        { id: 'start-std', name: 'Стандарт', trans: 'manual', theory: 'offline', hours: 56, price: 64900, inst: 6, months: 3, days: WEEK, times: ANY, badge: 'Хит продаж' },
        { id: 'start-auto', name: 'Стандарт АКПП', trans: 'auto', theory: 'offline', hours: 54, price: 69900, inst: 6, months: 3, days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'], times: ['day', 'evening'] },
        { id: 'start-pack', name: 'Доп. вождение 12 ч', trans: 'manual', theory: 'none', hours: 12, price: 26400, inst: 0, months: 0, days: ALL, times: ANY },
      ],
    },
    {
      id: 'zv', name: 'Зелёная волна', city: 'Москва', district: 'СВАО', address: 'пр-т Мира, 119', near: 'м. ВДНХ',
      lat: 55.8236, lng: 37.6395, rating: 4.7, reviews: 205, founded: 2014, pass: 74, fleet: 16, instructors: 12, hue: 152,
      cars: 'Kia Rio, Skoda Rapid, Chery Tiggo 4 (АКПП)',
      about: 'Школа со смешанным форматом: лекции можно смотреть онлайн, а разборы сложных тем и пробные экзамены проходят в классе у ВДНХ.',
      features: ['Смешанный формат теории', 'Пробный экзамен как в ГИБДД', 'Подача авто к метро'],
      groups: [
        { id: 'zv-g1', name: 'Утренняя группа', days: ['tue', 'thu'], time: 'morning', hours: '10:00–12:30', start: '2026-11-10', seats: 9 },
        { id: 'zv-g2', name: 'Вечерняя группа', days: ['tue', 'thu'], time: 'evening', hours: '19:00–21:30', start: '2026-11-17', seats: 12 },
      ],
      reviewsList: [
        { n: 'Дарья П.', r: 5, d: '2026-10-01', t: 'Удобно, что лекции в записи — смотрела между парами. На пробном экзамене поняла, где ошибаюсь.' },
        { n: 'Олег Н.', r: 4, d: '2026-07-19', t: 'Автомобили новые, площадка небольшая. По городу подготовили отлично.' },
      ],
      tariffs: [
        { id: 'zv-mix', name: 'Гибрид', trans: 'manual', theory: 'mixed', hours: 56, price: 59900, inst: 4, months: 3, days: WEEK, times: ['morning', 'day'], badge: 'Оптимально' },
        { id: 'zv-auto', name: 'Гибрид АКПП+', trans: 'auto', theory: 'mixed', hours: 60, price: 72900, inst: 6, months: 3, days: ALL, times: ['day', 'evening'], extra: ['4 дополнительных часа вождения'] },
        { id: 'zv-online', name: 'Онлайн + вождение', trans: 'manual', theory: 'online', hours: 56, price: 54900, inst: 0, months: 3, days: ['mon', 'sat', 'sun'], times: ['morning', 'day'] },
      ],
    },
    {
      id: 'perekrestok', name: 'Перекрёсток', city: 'Москва', district: 'ЦАО', address: 'ул. Земляной Вал, 33', near: 'м. Курская',
      lat: 55.7577, lng: 37.6582, rating: 4.6, reviews: 488, founded: 2004, pass: 81, fleet: 30, instructors: 26, hue: 8,
      cars: 'Volkswagen Polo, Kia Rio, Haval Jolion (АКПП)',
      about: 'Крупная школа в центре с тремя потоками теории в неделю. Подходит тем, кто учится или работает в центре: занятия у Курского вокзала.',
      features: ['3 потока теории в неделю', 'Персональный менеджер', 'Сопровождение на экзамен'],
      groups: [
        { id: 'per-g1', name: 'Вечерняя группа', days: ['mon', 'wed', 'fri'], time: 'evening', hours: '19:00–21:00', start: '2026-11-02', seats: 3 },
        { id: 'per-g2', name: 'Дневная группа', days: ['tue', 'thu'], time: 'day', hours: '13:00–15:30', start: '2026-11-11', seats: 10 },
        { id: 'per-g3', name: 'Группа выходного дня', days: ['sun'], time: 'day', hours: '11:00–15:00', start: '2026-11-15', seats: 8 },
      ],
      reviewsList: [
        { n: 'Екатерина С.', r: 5, d: '2026-09-28', t: 'Учёба рядом с работой — это решило всё. Менеджер сам напоминал о занятиях и записал на экзамен.' },
        { n: 'Тимур А.', r: 4, d: '2026-06-11', t: 'Дороговато, но организация на уровне. Вечерние группы быстро заполняются.' },
      ],
      tariffs: [
        { id: 'per-base', name: 'Базовый', trans: 'manual', theory: 'offline', hours: 56, price: 74900, inst: 10, months: 3, days: ALL, times: ANY },
        { id: 'per-auto', name: 'Базовый АКПП', trans: 'auto', theory: 'offline', hours: 54, price: 79900, inst: 10, months: 3, days: ALL, times: ['day', 'evening'] },
        { id: 'per-int', name: 'Интенсив', trans: 'auto', theory: 'offline', hours: 70, price: 109000, inst: 12, months: 2, days: ALL, times: ANY, badge: 'Премиум', extra: ['Персональный инструктор', 'Ускоренный курс — 2 месяца'] },
        { id: 'per-pack', name: 'Доп. вождение 6 ч', trans: 'manual', theory: 'none', hours: 6, price: 15600, inst: 0, months: 0, days: ALL, times: ANY },
      ],
    },
    {
      id: 'autopilot', name: 'Автопилот', city: 'Москва', district: 'ЮЗАО', address: 'Нахимовский пр-т, 52', near: 'м. Профсоюзная',
      lat: 55.6788, lng: 37.5605, rating: 4.9, reviews: 156, founded: 2017, pass: 85, fleet: 14, instructors: 11, hue: 262,
      cars: 'Kia Rio, Geely Coolray (АКПП)',
      about: 'Онлайн-школа с сильной методикой: интерактивные уроки, трекер прогресса и вождение у метро «Профсоюзная». Самый высокий процент сдачи с первого раза среди партнёров.',
      features: ['Интерактивная онлайн-теория', 'Трекер прогресса', 'Вождение рядом с МГУ и РУДН'],
      groups: [
        { id: 'ap-g1', name: 'Вечерняя группа', days: ['tue', 'thu'], time: 'evening', hours: '19:00–21:30', start: '2026-11-12', seats: 6 },
      ],
      reviewsList: [
        { n: 'Полина Р.', r: 5, d: '2026-10-07', t: 'Онлайн-уроки реально интересные, а не просто видео. Сдала теорию в ГИБДД без ошибок.' },
        { n: 'Артём В.', r: 5, d: '2026-09-03', t: 'Учусь в РУДН — вождение начиналось в десяти минутах от общежития.' },
      ],
      tariffs: [
        { id: 'ap-online', name: 'Онлайн Старт', trans: 'manual', theory: 'online', hours: 56, price: 57900, inst: 6, months: 3, days: WEEK, times: ANY, badge: 'Лучший рейтинг' },
        { id: 'ap-auto', name: 'Онлайн Автомат', trans: 'auto', theory: 'online', hours: 54, price: 63900, inst: 6, months: 3, days: ALL, times: ['day', 'evening'] },
        { id: 'ap-off', name: 'Класс + вождение', trans: 'manual', theory: 'offline', hours: 56, price: 61900, inst: 6, months: 3, days: WEEK, times: ['evening'] },
      ],
    },
    {
      id: 'master', name: 'Мастер руля', city: 'Москва', district: 'ВАО', address: 'Измайловский бульвар, 43', near: 'м. Первомайская',
      lat: 55.7948, lng: 37.7986, rating: 4.5, reviews: 260, founded: 2011, pass: 70, fleet: 20, instructors: 15, hue: 30,
      cars: 'Lada Vesta, Kia Rio, Lada Vesta CVT (АКПП)',
      about: 'Доступные цены на востоке Москвы и утренние группы для тех, кто работает по сменам.',
      features: ['Доступные цены', 'Утренние группы', 'Помощь с медкомиссией'],
      groups: [
        { id: 'mr-g1', name: 'Утренняя группа', days: ['mon', 'wed', 'fri'], time: 'morning', hours: '9:30–11:30', start: '2026-11-09', seats: 11 },
        { id: 'mr-g2', name: 'Вечерняя группа', days: ['mon', 'wed'], time: 'evening', hours: '18:30–21:00', start: '2026-11-16', seats: 5 },
      ],
      reviewsList: [
        { n: 'Наталья Г.', r: 4, d: '2026-08-21', t: 'Цена честная, всё как в договоре. Машины не новые, но исправные.' },
        { n: 'Игорь Л.', r: 5, d: '2026-07-30', t: 'Утренняя группа — то, что нужно при сменном графике.' },
      ],
      tariffs: [
        { id: 'mr-eco', name: 'Эконом', trans: 'manual', theory: 'offline', hours: 56, price: 48900, inst: 3, months: 3, days: WEEK, times: ['morning', 'day'] },
        { id: 'mr-auto', name: 'Эконом АКПП', trans: 'auto', theory: 'offline', hours: 54, price: 53900, inst: 3, months: 3, days: WEEK, times: ANY },
        { id: 'mr-pack', name: 'Доп. вождение 24 ч', trans: 'manual', theory: 'none', hours: 24, price: 50400, inst: 3, months: 0, days: ALL, times: ANY },
      ],
    },
    {
      id: 'blizhniy', name: 'Ближний свет', city: 'Москва', district: 'ЮВАО', address: 'Волгоградский пр-т, 92', near: 'м. Кузьминки',
      lat: 55.7068, lng: 37.7629, rating: 4.4, reviews: 178, founded: 2012, pass: 69, fleet: 12, instructors: 10, hue: 46,
      cars: 'Kia Rio, Hyundai Creta (АКПП)',
      about: 'Небольшая школа у «Кузьминок» с группами выходного дня и смешанной теорией.',
      features: ['Группы выходного дня', 'Группы до 15 человек', 'Автодром в 5 минутах от метро'],
      groups: [
        { id: 'bs-g1', name: 'Вечерняя группа', days: ['tue', 'thu'], time: 'evening', hours: '19:00–21:30', start: '2026-11-03', seats: 2 },
        { id: 'bs-g2', name: 'Группа выходного дня', days: ['sat', 'sun'], time: 'day', hours: '10:00–13:00', start: '2026-11-21', seats: 14 },
      ],
      reviewsList: [
        { n: 'Ксения М.', r: 4, d: '2026-09-09', t: 'Маленькие группы — преподаватель знает всех по имени. Вождения пришлось подождать пару недель.' },
        { n: 'Руслан Б.', r: 4, d: '2026-05-17', t: 'Нормально за свои деньги. Билеты лучше дополнительно решать дома.' },
      ],
      tariffs: [
        { id: 'bs-base', name: 'Классика', trans: 'manual', theory: 'offline', hours: 56, price: 46900, inst: 4, months: 3, days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'], times: ['day', 'evening'] },
        { id: 'bs-auto', name: 'Смешанный АКПП', trans: 'auto', theory: 'mixed', hours: 54, price: 51900, inst: 4, months: 3, days: ALL, times: ['morning', 'day'] },
        { id: 'bs-pack', name: 'Доп. вождение 12 ч АКПП', trans: 'auto', theory: 'none', hours: 12, price: 27600, inst: 0, months: 0, days: ALL, times: ANY },
      ],
    },
    {
      id: 'polosa', name: 'Полоса', city: 'Москва', district: 'ЮЗАО', address: 'пр-т Вернадского, 86', near: 'м. Юго-Западная',
      lat: 55.6655, lng: 37.4862, rating: 4.7, reviews: 340, founded: 2010, pass: 80, fleet: 22, instructors: 17, hue: 192,
      cars: 'Kia Rio, Skoda Rapid, Kia Seltos (АКПП)',
      about: 'Школа для студентов: рядом РУДН, МГИМО и МГУ, гибкое расписание под сессию и возможность заморозить обучение.',
      features: ['Заморозка обучения на сессию', 'Дневные группы для студентов', 'Свой автодром'],
      groups: [
        { id: 'pol-g1', name: 'Дневная группа', days: ['mon', 'wed'], time: 'day', hours: '14:00–16:30', start: '2026-11-09', seats: 8 },
        { id: 'pol-g2', name: 'Вечерняя группа', days: ['mon', 'wed'], time: 'evening', hours: '19:00–21:30', start: '2026-11-09', seats: 1 },
        { id: 'pol-g3', name: 'Группа выходного дня', days: ['sat'], time: 'day', hours: '11:00–15:00', start: '2026-11-14', seats: 9 },
      ],
      reviewsList: [
        { n: 'Вероника Т.', r: 5, d: '2026-10-12', t: 'Заморозила обучение на сессию — без доплат. Вернулась и спокойно доучилась.' },
        { n: 'Глеб Ф.', r: 5, d: '2026-08-15', t: 'Хорошие инструкторы. Город сдал со второго раза, но по своей вине.' },
      ],
      tariffs: [
        { id: 'pol-std', name: 'Студенческий', trans: 'manual', theory: 'offline', hours: 56, price: 62900, inst: 6, months: 3, days: WEEK, times: ['day', 'evening'], badge: 'Для студентов' },
        { id: 'pol-auto', name: 'Студенческий АКПП', trans: 'auto', theory: 'mixed', hours: 54, price: 67900, inst: 6, months: 3, days: ALL, times: ['day', 'evening'] },
        { id: 'pol-max', name: 'Максимум', trans: 'manual', theory: 'offline', hours: 70, price: 84900, inst: 12, months: 4, days: ALL, times: ANY, extra: ['14 дополнительных часов вождения', 'Вождение в тёмное время суток'] },
        { id: 'pol-36', name: 'Доп. вождение 36 ч', trans: 'manual', theory: 'none', hours: 36, price: 75600, inst: 6, months: 0, days: ALL, times: ANY },
      ],
    },
    {
      id: 'sever', name: 'Северный путь', city: 'Москва', district: 'СЗАО', address: 'ул. Маршала Василевского, 13', near: 'м. Щукинская',
      lat: 55.8078, lng: 37.4662, rating: 4.6, reviews: 121, founded: 2015, pass: 76, fleet: 11, instructors: 9, hue: 205,
      cars: 'Kia Rio, Chery Tiggo 7 Pro (АКПП)',
      about: 'Уютная школа в Щукине с онлайн-теорией для АКПП и классическими вечерними группами.',
      features: ['Онлайн-теория для АКПП', 'Вечерние группы', 'Вождение от метро'],
      groups: [
        { id: 'sev-g1', name: 'Вечерняя группа', days: ['tue', 'thu'], time: 'evening', hours: '18:30–21:00', start: '2026-11-10', seats: 10 },
      ],
      reviewsList: [
        { n: 'Анна Ш.', r: 5, d: '2026-09-22', t: 'Онлайн-теория удобная, вождение на автомате — для города то, что нужно.' },
        { n: 'Денис К.', r: 4, d: '2026-06-30', t: 'Всё хорошо, но хотелось бы больше слотов на вождение в выходные.' },
      ],
      tariffs: [
        { id: 'sev-std', name: 'Классика', trans: 'manual', theory: 'offline', hours: 56, price: 55900, inst: 6, months: 3, days: WEEK, times: ANY },
        { id: 'sev-auto', name: 'Онлайн АКПП', trans: 'auto', theory: 'online', hours: 54, price: 58900, inst: 6, months: 3, days: ALL, times: ['day', 'evening'] },
        { id: 'sev-pack', name: 'Доп. вождение 6 ч АКПП', trans: 'auto', theory: 'none', hours: 6, price: 13800, inst: 0, months: 0, days: ALL, times: ['day', 'evening'] },
      ],
    },
    {
      id: 'kluch', name: 'Ключ на старт', city: 'Москва', district: 'ЮАО', address: 'ул. Большая Тульская, 10', near: 'м. Тульская',
      lat: 55.7083, lng: 37.6219, rating: 4.3, reviews: 98, founded: 2019, pass: 67, fleet: 9, instructors: 8, hue: 330,
      cars: 'Kia Rio, Renault Logan, Haval M6 (АКПП)',
      about: 'Бюджетный вариант: теория полностью онлайн, вождение — по пятницам и выходным.',
      features: ['Самые доступные цены', 'Теория полностью онлайн', 'Вождение по выходным'],
      groups: [],
      reviewsList: [
        { n: 'Софья Е.', r: 4, d: '2026-08-08', t: 'Дёшево и нормально. Теорию учила сама по видео и билетам.' },
        { n: 'Максим Ж.', r: 3, d: '2026-05-26', t: 'Вождение только в конце недели — обучение растянулось почти на 4 месяца.' },
      ],
      tariffs: [
        { id: 'kl-online', name: 'Онлайн', trans: 'manual', theory: 'online', hours: 56, price: 44900, inst: 0, months: 3, days: ['fri', 'sat', 'sun'], times: ['day', 'evening'], badge: 'Самый доступный' },
        { id: 'kl-auto', name: 'Онлайн АКПП', trans: 'auto', theory: 'online', hours: 54, price: 49900, inst: 0, months: 3, days: ['fri', 'sat', 'sun'], times: ['morning', 'day'] },
        { id: 'kl-pack', name: 'Доп. вождение 6 ч АКПП', trans: 'auto', theory: 'none', hours: 6, price: 14400, inst: 0, months: 0, days: ['sat', 'sun'], times: ['morning', 'day'] },
      ],
    },
    {
      id: 'profi', name: 'Профи Драйв', city: 'Москва', district: 'ЗАО', address: 'ул. Ивана Франко, 8', near: 'м. Кунцевская',
      lat: 55.7298, lng: 37.4426, rating: 4.8, reviews: 267, founded: 2008, pass: 83, fleet: 26, instructors: 20, hue: 228,
      cars: 'Volkswagen Polo, Skoda Octavia, Kia K5 (АКПП)',
      about: 'Школа премиум-уровня на западе Москвы: новые автомобили, свой автодром и курс контраварийной подготовки в старших тарифах.',
      features: ['Новые автомобили', 'Контраварийная подготовка', 'Собственный автодром'],
      groups: [
        { id: 'pr-g1', name: 'Утренняя группа', days: ['tue', 'thu'], time: 'morning', hours: '10:00–12:00', start: '2026-11-10', seats: 7 },
        { id: 'pr-g2', name: 'Вечерняя группа', days: ['mon', 'wed', 'fri'], time: 'evening', hours: '19:00–21:00', start: '2026-11-02', seats: 4 },
      ],
      reviewsList: [
        { n: 'Лилия О.', r: 5, d: '2026-10-15', t: 'Новые машины, вежливые инструкторы. Контраварийная подготовка — бесценно для новичка.' },
        { n: 'Павел У.', r: 5, d: '2026-07-04', t: 'Сдал всё с первого раза. Недёшево, но оно того стоит.' },
      ],
      tariffs: [
        { id: 'pr-std', name: 'Профи', trans: 'manual', theory: 'offline', hours: 56, price: 68900, inst: 6, months: 3, days: ALL, times: ANY },
        { id: 'pr-auto', name: 'Профи АКПП', trans: 'auto', theory: 'offline', hours: 54, price: 72900, inst: 6, months: 3, days: ALL, times: ANY },
        { id: 'pr-elite', name: 'Премиум АКПП', trans: 'auto', theory: 'mixed', hours: 60, price: 94900, inst: 12, months: 3, days: ALL, times: ANY, badge: 'Премиум', extra: ['Контраварийная подготовка (2 ч)', 'Персональный инструктор'] },
      ],
    },
    {
      id: 'avtoliga', name: 'АвтоЛига', city: 'Химки', district: 'Центр', address: 'ул. Московская, 21', near: 'ст. Химки',
      lat: 55.8893, lng: 37.4386, rating: 4.6, reviews: 143, founded: 2013, pass: 77, fleet: 15, instructors: 12, hue: 168,
      cars: 'Kia Rio, Hyundai Solaris, Kia Seltos (АКПП)',
      about: 'Крупная школа Химок: экзамены в местном подразделении Госавтоинспекции, маршруты отработаны до мелочей.',
      features: ['Экзамен в Химках', 'Вождение по экзаменационным маршрутам', 'Вечерние группы'],
      groups: [
        { id: 'al-g1', name: 'Вечерняя группа', days: ['mon', 'wed'], time: 'evening', hours: '19:00–21:30', start: '2026-11-09', seats: 9 },
      ],
      reviewsList: [
        { n: 'Виктория Х.', r: 5, d: '2026-09-18', t: 'Инструктор знает каждый поворот экзаменационного маршрута. Сдала с первого раза.' },
        { n: 'Сергей Ч.', r: 4, d: '2026-06-02', t: 'Хорошая школа, но занятия по теории пару раз переносили.' },
      ],
      tariffs: [
        { id: 'al-std', name: 'Стандарт', trans: 'manual', theory: 'offline', hours: 56, price: 49900, inst: 6, months: 3, days: WEEK, times: ANY },
        { id: 'al-auto', name: 'Смешанный АКПП', trans: 'auto', theory: 'mixed', hours: 54, price: 54900, inst: 6, months: 3, days: ALL, times: ['day', 'evening'] },
      ],
    },
    {
      id: 'magistral', name: 'Магистраль', city: 'Мытищи', district: 'Центр', address: 'Новомытищинский пр-т, 30', near: 'ст. Мытищи',
      lat: 55.9142, lng: 37.7398, rating: 4.5, reviews: 87, founded: 2016, pass: 73, fleet: 10, instructors: 8, hue: 280,
      cars: 'Kia Rio, Lada Vesta, Chery Tiggo 4 (АКПП)',
      about: 'Школа в центре Мытищ с онлайн-теорией для АКПП и группами выходного дня.',
      features: ['Группы выходного дня', 'Онлайн-теория для АКПП', 'Доступные цены'],
      groups: [
        { id: 'mg-g1', name: 'Вечерняя группа', days: ['tue', 'thu'], time: 'evening', hours: '19:00–21:00', start: '2026-11-12', seats: 12 },
        { id: 'mg-g2', name: 'Группа выходного дня', days: ['sun'], time: 'day', hours: '10:00–14:00', start: '2026-11-15', seats: 6 },
      ],
      reviewsList: [
        { n: 'Ольга Ю.', r: 4, d: '2026-08-27', t: 'Удобно, что рядом с домом. Цена ниже, чем в Москве.' },
        { n: 'Никита З.', r: 5, d: '2026-07-12', t: 'Взял онлайн-теорию и автомат — за 3 месяца получил права.' },
      ],
      tariffs: [
        { id: 'mg-std', name: 'Стандарт', trans: 'manual', theory: 'offline', hours: 56, price: 45900, inst: 4, months: 3, days: WEEK, times: ANY },
        { id: 'mg-online', name: 'Онлайн АКПП', trans: 'auto', theory: 'online', hours: 54, price: 47900, inst: 4, months: 3, days: ALL, times: ['day', 'evening'] },
        { id: 'mg-pack', name: 'Доп. вождение 12 ч', trans: 'manual', theory: 'none', hours: 12, price: 24000, inst: 0, months: 0, days: ALL, times: ANY },
      ],
    },
  ];

  /* Что входит в тариф по умолчанию */
  const INCLUDES = {
    full: ['Теория по программе категории B', 'Внутренний экзамен в автошколе', 'Автомобиль школы на экзамене в ГИБДД', 'Онлайн-тренажёр билетов ПДД', 'Договор и закрывающие документы'],
    pack: ['Индивидуальные занятия с инструктором', 'Автодром или город — на выбор', 'Подходит после основного курса'],
  };

  return { DAYS, CITIES, PLACE_TYPES, PLACES, SCHOOLS, INCLUDES };
})();
