// Ждем когда весь HTML документ полностью загрузится и будет готов к работе
document.addEventListener('DOMContentLoaded', function () {
    // Находим ВСЕ карусели на странице
    const carousels = document.querySelectorAll('.carousel-container');
    
    // Инициализируем каждую карусель отдельно
    carousels.forEach((container) => {
        initCarousel(container);
    });

    function initCarousel(container) {
        // Ищем элементы ВНУТРИ конкретной карусели
        const carouselTrack = container.querySelector('.carousel-track');
        const prevButton = container.querySelector('.carousel-btn.prev');
        const nextButton = container.querySelector('.carousel-btn.next');
        const carouselItems = container.querySelectorAll('.carousel-item');

        // Создаем переменную для отслеживания текущей позиции, начинаем с 0 (первый элемент)
        let currentIndex = 0;
        // Переменная для хранения максимальной позиции (чтобы не уходить за последний элемент)
        let maxPosition = 0;

        // Функция для расчета сколько элементов видно и максимальной позиции
        function calculateBounds() {
            // Получаем ширину контейнера карусели
            const containerWidth = container.offsetWidth;
            // Получаем ширину одного элемента
            const itemWidth = carouselItems[0].offsetWidth;
            // Получаем расстояние между элементами из CSS
            const gap = parseInt(getComputedStyle(carouselTrack).gap) || 0;
            
            // Вычисляем сколько элементов помещается в видимой области
            const visibleItems = Math.floor(containerWidth / (itemWidth + gap));
            // Вычисляем максимальную позицию (когда показываются последние элементы)
            maxPosition = Math.max(0, carouselItems.length - visibleItems);
        }

        // Функция которая показывает определенный слайд
        function showSlide(index) {
            // Проверяем границы - не позволяем уйти за пределы
            if (index > maxPosition) {
                // Если пытаемся уйти дальше последнего элемента, останавливаемся на последнем
                currentIndex = maxPosition;
            } else if (index < 0) {
                // Если пытаемся уйти перед первым элементом, останавливаемся на первом
                currentIndex = 0;
            } else {
                // Если индекс в нормальных пределах, просто сохраняем его
                currentIndex = index;
            }

            // Получаем ширину одного элемента карусели
            const itemWidth = carouselItems[0].offsetWidth;
            // Задаем расстояние между элементами
            const gap = parseInt(getComputedStyle(carouselTrack).gap) || 0;
            // Вычисляем на сколько пикселей нужно сдвинуть всю дорожку
            const translateX = -currentIndex * (itemWidth + gap);

            // Применяем вычисленное смещение к дорожке карусели
            carouselTrack.style.transform = 'translateX(' + translateX + 'px)';
            
            // Обновляем состояние кнопок
            updateButtons();
        }

        // Функция для обновления состояния кнопок (включены/отключены)
        function updateButtons() {
            // Кнопка "назад" отключается когда мы на первом элементе
            prevButton.disabled = currentIndex === 0;
            // Кнопка "вперед" отключается когда мы на последнем элементе
            nextButton.disabled = currentIndex >= maxPosition;
        }

        // Добавляем обработчик клика на кнопку "назад"
        prevButton.addEventListener('click', () => {
            // При клике показываем предыдущий слайд, но не меньше 0
            showSlide(currentIndex - 1);
        });

        // Добавляем обработчик клика на кнопку "вперед"
        nextButton.addEventListener('click', () => {
            // При клике показываем следующий слайд, но не больше максимальной позиции
            showSlide(currentIndex + 1);
        }); // Обработчик изменения размера окна (для адаптивности)
        window.addEventListener('resize', () => {
            // При изменении размера окна пересчитываем границы
            calculateBounds();
            // Корректируем текущую позицию если она стала невалидной
            if (currentIndex > maxPosition) {
                currentIndex = maxPosition;
                showSlide(currentIndex);
            }
        });

        // Инициализация карусели
        calculateBounds(); // Рассчитываем начальные границы
        updateButtons();   // Устанавливаем начальное состояние кнопок
    }
});