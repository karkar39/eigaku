// minimal-search-images.js
document.addEventListener('DOMContentLoaded', function () {
    // Находим форму поиска
    const searchForm = document.getElementById('search');
    // Находим поле ввода
    const searchInput = searchForm.querySelector('input[type="search"]');

    // Когда нажимаем кнопку поиска
    searchForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Отменяем обычную отправку формы
        searchImages();     // Запускаем поиск
    });

    // Главная функция поиска
    function searchImages() {
        // Берем текст из поля поиска
        const searchText = searchInput.value.trim().toLowerCase();

        // Убираем старые подсветки со ВСЕХ элементов слайдера
        document.querySelectorAll('.carousel-item.highlighted').forEach(item => {
            item.classList.remove('highlighted'); // Убираем класс
            item.style.border = '';              // Убираем рамку
        });

        // Если поле поиска пустое - выходим
        if (!searchText) return;

        // Находим все картинки в слайдерах
        const images = document.querySelectorAll('img.carousel-image[alt]');
        let targetImage = null; // Здесь будет первая найденная картинка
        
        // Перебираем все картинки
        for (let img of images) {
            // Если наш текст есть в описании картинки
            if (img.alt.toLowerCase().includes(searchText)) {
                // Находим родительский элемент .carousel-item
                const carouselItem = img.closest('.carousel-item');
                
                // Добавляем ему класс "highlighted" и розовую рамку
                carouselItem.classList.add('highlighted');
                carouselItem.style.border = '3px solid #DE3D82';
                
                // Запоминаем первую найденную картинку
                if (!targetImage) targetImage = img;
                break; // Останавливаемся после первого найденного
            }
        }

        // Если что-то нашли
        if (targetImage) {
            // 1. Находим слайдер с этой картинкой
            const carousel = targetImage.closest('.carousel-container');
            
            if (carousel) {
                // 2. Прокручиваем страницу к этому слайдеру
                carousel.scrollIntoView({
                    behavior: 'smooth', // Плавная прокрутка
                    block: 'center'     // Размещаем слайдер по центру
                });
                
                // 3. Через 1 секунду прокручиваем сам слайдер
                setTimeout(() => {
                    scrollCarouselToImage(targetImage);
                }, 1000);
            }
            
            // Подсвечиваем поле ввода розовым
            searchInput.style.borderColor = '#DE3D82';
        } else {
            // Если ничего не нашли - подсвечиваем поле красным
            searchInput.style.borderColor = '#f44336';
        }
    }

    // Функция прокрутки слайдера к картинке
    function scrollCarouselToImage(imgElement) {
        // Находим слайдер
        const carousel = imgElement.closest('.carousel-container');
        if (!carousel) return; // Если нет слайдера - выходим
        
        // Находим все элементы слайдера
        const items = Array.from(carousel.querySelectorAll('.carousel-item'));
        // Находим элемент, в котором находится картинка
        const targetItem = imgElement.closest('.carousel-item');
        // Определяем номер этого элемента (0, 1, 2...)
        const targetIndex = items.indexOf(targetItem);
        
        // Если не нашли элемент - выходим
        if (targetIndex === -1) return;

        // Находим кнопку "вперед"
        const nextBtn = carousel.querySelector('.carousel-btn.next');
// Если есть кнопка и элемент не первый
        if (nextBtn && targetIndex > 0) {
            let clicks = 0; // Счетчик кликов
            
            // Функция для нажатия кнопки
            function clickNext() {
                // Нажимаем пока не дойдем до нужного элемента
                if (clicks < targetIndex) {
                    nextBtn.click();  // Нажимаем кнопку
                    clicks++;        // Увеличиваем счетчик
                    
                    // Если еще не дошли - ждем и нажимаем снова
                    if (clicks < targetIndex) {
                        setTimeout(clickNext, 300); // Ждем 300 миллисекунд
                    }
                }
            }
            clickNext(); // Запускаем прокрутку
        }
    }

    // Когда нажимаем Enter в поле поиска
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // Отменяем стандартное поведение
            searchImages();     // Запускаем поиск
        }
    });
});
