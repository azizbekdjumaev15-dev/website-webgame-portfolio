document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. ПРЕЛОАДЕР (Экран загрузки)
       ========================================= */
    const preloader = document.getElementById('preloader');
    
    // Имитируем загрузку (1.5 секунды)
    setTimeout(() => {
        preloader.style.opacity = '0';
        preloader.style.pointerEvents = 'none';
        // Полностью убираем из потока чуть позже
        setTimeout(() => { preloader.style.display = 'none'; }, 500);
    }, 1500);


    /* =========================================
       2. ЖИВОЙ ФОН (CANVAS PARTICLES)
       ========================================= */
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let particlesArray;
    let themeColor = '#00f2ff'; // Цвет по умолчанию (неон)

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x; this.y = y;
            this.directionX = directionX; this.directionY = directionY;
            this.size = size; this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = themeColor;
            ctx.fill();
        }
        update() {
            // Отталкивание от краев
            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

            // Взаимодействие с мышкой
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);

            if (distance < mouse.radius + this.size) {
                if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 2;
                if (mouse.x > this.x && this.x > this.size * 10) this.x -= 2;
                if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 2;
                if (mouse.y > this.y && this.y > this.size * 10) this.y -= 2;
            }

            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        // Количество частиц зависит от размера экрана
        let numberOfParticles = (canvas.height * canvas.width) / 10000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * 1) - 0.5;
            let directionY = (Math.random() * 1) - 0.5;
            particlesArray.push(new Particle(x, y, directionX, directionY, size, themeColor));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) +
                               ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                
                if (distance < (canvas.width/7) * (canvas.height/7)) {
                    opacityValue = 1 - (distance/20000);
                    // Цвет линий зависит от темы
                    let colorRGB = document.body.classList.contains('light-theme') ? '13, 110, 253' : '0, 242, 255';
                    ctx.strokeStyle = `rgba(${colorRGB}, ${opacityValue})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    window.addEventListener('resize', () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        init();
    });

    init();
    animate();


    /* =========================================
       3. СЧЕТЧИКИ СТАТИСТИКИ (Бегущие цифры)
       ========================================= */
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Чем выше, тем медленнее

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                const counter = entry.target;
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 20);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
                observer.unobserve(counter); // Запускаем только один раз
            }
        });
    }, { threshold: 0.7 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });


    /* =========================================
       4. ПЕЧАТНАЯ МАШИНКА (Текст)
       ========================================= */
    const typeText = document.querySelector('.typewriter');
    const words = ["Сайты под ключ", "Мобильные Игры", "Telegram Ботов", "Дизайн UI/UX"];
    let count = 0;
    let index = 0;
    let currentText = '';
    let letter = '';

    (function type() {
        if (count === words.length) {
            count = 0;
        }
        currentText = words[count];
        letter = currentText.slice(0, ++index);

        typeText.textContent = letter;
        if (letter.length === currentText.length) {
            count++;
            index = 0;
            setTimeout(type, 2000); // Пауза перед сменой слова
        } else {
            setTimeout(type, 100); // Скорость печати
        }
    })();


    /* =========================================
       5. СМЕНА ТЕМЫ (ТЕМНАЯ / СВЕТЛАЯ)
       ========================================= */
    const themeBtn = document.getElementById('theme-btn');
    const icon = themeBtn.querySelector('i');

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        
        if (document.body.classList.contains('light-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            themeColor = '#0d6efd'; // Синий для светлой темы
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            themeColor = '#00f2ff'; // Неон для темной
        }
    });


    /* =========================================
       6. ЭФФЕКТ НАКЛОНА КАРТОЧЕК (3D TILT)
       ========================================= */
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Вычисляем угол поворота
            const rotateX = ((y - rect.height/2) / rect.height) * -20;
            const rotateY = ((x - rect.width/2) / rect.width) * 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0)`;
        });
    });


    /* =========================================
       7. FAQ (РАСКРЫВАЮЩИЙСЯ СПИСОК)
       ========================================= */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Закрываем другие (опционально)
            faqItems.forEach(i => {
                if(i !== item) i.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    });


    /* =========================================
       8. МОДАЛЬНОЕ ОКНО (ПОЛИТИКА)
       ========================================= */
    const modal = document.getElementById("privacy-modal");
    const btn = document.getElementById("privacy-trigger");
    const span = document.getElementsByClassName("close-modal")[0];

    btn.onclick = function() { modal.style.display = "flex"; }
    span.onclick = function() { modal.style.display = "none"; }
    window.onclick = function(event) {
        if (event.target == modal) { modal.style.display = "none"; }
    }

});