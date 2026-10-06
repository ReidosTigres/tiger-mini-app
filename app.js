/* =========================================
   ЭЛЕМЕНТЫ
========================================= */

const welcomeScreen =
    document.getElementById(
        "welcomeScreen"
    );

const gameScreen =
    document.getElementById(
        "gameScreen"
    );

const openFieldButton =
    document.getElementById(
        "openFieldButton"
    );

const backButton =
    document.getElementById(
        "backButton"
    );

const field =
    document.getElementById(
        "field"
    );

const slider =
    document.getElementById(
        "starSlider"
    );

const starCount =
    document.getElementById(
        "starCount"
    );

const generateButton =
    document.getElementById(
        "generateButton"
    );

const soundToggle =
    document.getElementById(
        "soundToggle"
    );

const loadingOverlay =
    document.getElementById(
        "loadingOverlay"
    );

const downloadStatus =
    document.getElementById(
        "downloadStatus"
    );

const downloadPercent =
    document.getElementById(
        "downloadPercent"
    );


/* =========================================
   СОСТОЯНИЕ
========================================= */

let lastField = null;

let isGenerating = false;

let soundEnabled = true;

let audioContext = null;


/* =========================================
   AUDIO CONTEXT
========================================= */

function getAudioContext() {

    if (!audioContext) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) {
            return null;
        }

        audioContext =
            new AudioContext();
    }

    if (
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume()
            .catch(() => {});
    }

    return audioContext;
}


/* =========================================
   ЗВУК КНОПКИ
========================================= */

function playClickSound() {

    if (!soundEnabled) {

        return;
    }


    const context =
    getAudioContext();

if (!context) {
    return;
}

const oscillator =
    context.createOscillator();


    const gain =
        context.createGain();


    oscillator.type =
        "sine";


    oscillator.frequency.setValueAtTime(
        520,
        context.currentTime
    );


    oscillator.frequency.exponentialRampToValueAtTime(
        720,
        context.currentTime + 0.06
    );


    gain.gain.setValueAtTime(
        0.0001,
        context.currentTime
    );


    gain.gain.exponentialRampToValueAtTime(
        0.08,
        context.currentTime + 0.01
    );


    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        context.currentTime + 0.08
    );


    oscillator.connect(
        gain
    );

    gain.connect(
        context.destination
    );


    oscillator.start();


    oscillator.stop(
        context.currentTime + 0.08
    );
}


/* =========================================
   ЗВУК ПОЯВЛЕНИЯ ЗВЕЗДЫ
========================================= */

function playStarSound() {

    if (!soundEnabled) {

        return;
    }


    const context =
    getAudioContext();

if (!context) {
    return;
}

const oscillator =
    context.createOscillator();


    const gain =
        context.createGain();


    oscillator.type =
        "triangle";


    oscillator.frequency.setValueAtTime(
        700,
        context.currentTime
    );


    oscillator.frequency.exponentialRampToValueAtTime(
        1100,
        context.currentTime + 0.07
    );


    gain.gain.setValueAtTime(
        0.0001,
        context.currentTime
    );


    gain.gain.exponentialRampToValueAtTime(
        0.045,
        context.currentTime + 0.01
    );


    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        context.currentTime + 0.09
    );


    oscillator.connect(
        gain
    );

    gain.connect(
        context.destination
    );


    oscillator.start();


    oscillator.stop(
        context.currentTime + 0.09
    );
}


/* =========================================
   СОЗДАНИЕ ПУСТОГО ПОЛЯ
========================================= */

function createField() {

    field.innerHTML = "";


    for (
        let i = 0;
        i < 25;
        i++
    ) {

        const cell =
            document.createElement(
                "div"
            );


        cell.className =
            "cell";


        cell.dataset.index =
            i;


        field.appendChild(
            cell
        );
    }
}


/* =========================================
   ГЕНЕРАЦИЯ ПОЗИЦИЙ
========================================= */

function generatePositions(
    amount
) {

    const positions =
        Array.from(
            {
                length: 25
            },
            (_, index) =>
                index
        );


    /*
       Перемешивание Fisher-Yates.
    */

    for (
        let i =
            positions.length - 1;

        i > 0;

        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            positions[i],
            positions[j]
        ] =
        [
            positions[j],
            positions[i]
        ];
    }


    return positions.slice(
        0,
        amount
    );
}


/* =========================================
   ПРОВЕРКА ПОВТОРА ПОЛЯ
========================================= */

function sameField(
    a,
    b
) {

    if (!a || !b) {

        return false;
    }


    if (
        a.length !==
        b.length
    ) {

        return false;
    }


    /*
       Сравниваем отсортированные массивы,
       чтобы набор ячеек был уникальным
    */

    const sortedA = [...a].sort((x, y) => x - y);
    const sortedB = [...b].sort((x, y) => x - y);


    for (
        let i = 0;
        i < sortedA.length;
        i++
    ) {

        if (
            sortedA[i] !==
            sortedB[i]
        ) {

            return false;
        }
    }


    return true;
}


/* =========================================
   ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ РАНДОМА
========================================= */

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


/* =========================================
   ЗАДЕРЖКА
========================================= */

function wait(
    milliseconds
) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milliseconds
            )
    );
}


/* =========================================
   ПОКАЗ ЗАГРУЗКИ
========================================= */

function showLoading() {

    loadingOverlay.classList.remove(
        "hidden"
    );
}


/* =========================================
   СКРЫТИЕ ЗАГРУЗКИ
========================================= */

function hideLoading() {

    loadingOverlay.classList.add(
        "hidden"
    );
}


/* =========================================
   ПОКАЗ ЗВЕЗД
========================================= */

async function showStars(
    positions
) {

    /*
       Все звёзды появляются
       примерно за 0.8 секунды.
    */

    const totalTime = 800;


    const delay =
        positions.length > 1
            ? totalTime /
              positions.length
            : 0;


    for (
        const position of positions
    ) {

        const cell =
            field.children[
                position
            ];


        /*
           Синяя клетка
           превращается в
           тёмную клетку со звездой.
        */

        cell.classList.add(
            "star-cell"
        );


        const star =
            document.createElement(
                "img"
            );


        star.className =
            "star";


        star.src =
            "assets/star.png";


        star.alt =
            "";


        cell.appendChild(
            star
        );


        playStarSound();


        await wait(
            delay
        );
    }
}


/* =========================================
   СЛУЧАЙНЫЙ ПРОЦЕНТ
========================================= */

function getDownloadPercent() {

    return (
        Math.random() * (98.5 - 97) + 97
    ).toFixed(1);
}


/* =========================================
   ПОКАЗ ПРОЦЕНТА
========================================= */

function showDownloadPercent() {

    const percent =
        getDownloadPercent();


    downloadPercent.textContent =
        `${percent}%`;


    downloadStatus.classList.remove(
        "hidden-status"
    );
}


/* =========================================
   СКРЫТЬ ПРОЦЕНТ
========================================= */

function hideDownloadPercent() {

    downloadStatus.classList.add(
        "hidden-status"
    );
}


/* =========================================
   ГЕНЕРАЦИЯ ПОЛЯ
========================================= */

async function generateField() {

    /*
       Не разрешаем нажать кнопку
       несколько раз одновременно.
    */

    if (isGenerating) {

        return;
    }


    isGenerating = true;


    generateButton.disabled =
        true;


    /*
       Соответствие выбранного числа на ползунке 
       к диапазонам количества звёзд на поле.
    */

    const starMapping = {
        1: [8, 10],
        2: [7, 9],
        3: [7, 8],
        4: [6, 7],
        5: [6, 7],
        6: [5, 6],
        7: [5, 6],
        8: [5, 5],
        9: [4, 6],
        10: [4, 6],
        11: [4, 6],
        12: [4, 6],
        13: [4, 6],
        14: [4, 6],
        15: [4, 6],
        16: [4, 6],
        17: [3, 4],
        18: [3, 4],
        19: [3, 3],
        20: [2, 3],
        21: [2, 2],
        22: [2, 2],
        23: [2, 2],
        24: [1, 1]
    };


    const sliderValue = parseInt(slider.value, 10);

    const range = starMapping[sliderValue] || [5, 5];

    const amount = getRandomInt(range[0], range[1]);


    /*
       Сначала убираем
       старый процент.
    */

    hideDownloadPercent();


    /*
       Генерируем новое поле.

       Если такое же полное поле
       уже было предыдущим,
       генерируем заново.
    */

    let positions;


    do {

        positions =
            generatePositions(
                amount
            );

    } while (
        sameField(
            positions,
            lastField
        )
    );


    /*
       Запоминаем новое поле.
    */

    lastField =
        [
            ...positions
        ];


    /*
       Очищаем старое поле.
    */

    createField();


    /*
       =================================
       АНИМАЦИЯ ЗАГРУЗКИ
       =================================
    */

    showLoading();


    /*
       Продолжительность:
       1 секунда.
    */

    await wait(
        1000
    );


    hideLoading();


    /*
       =================================
       ПОЯВЛЕНИЕ ЗВЕЗД
       =================================
    */

    await showStars(
        positions
    );


    /*
       После появления всех звёзд
       показываем процент.
    */

    showDownloadPercent();


    generateButton.disabled =
        false;


    isGenerating =
        false;
}


/* =========================================
   ОТКРЫТЬ ПОЛЕ
========================================= */

openFieldButton.addEventListener(
    "click",
    () => {

        playClickSound();


        /*
           Закрываем приветствие.
        */

        welcomeScreen.classList.add(
            "hidden"
        );


        /*
           Открываем поле.
        */

        gameScreen.classList.remove(
            "hidden"
        );


        /*
           В начале поле пустое.
        */

        createField();


        /*
           Процент в начале отсутствует.
        */

        hideDownloadPercent();


        /*
           Скролл наверх.
        */

        window.scrollTo(
            0,
            0
        );
    }
);


/* =========================================
   КНОПКА НАЗАД
========================================= */

backButton.addEventListener(
    "click",
    () => {

        /*
           Если сейчас идёт
           создание поля —
           не прерываем процесс.
        */

        if (isGenerating) {

            return;
        }


        playClickSound();


        /*
           Закрываем поле.
        */

        gameScreen.classList.add(
            "hidden"
        );


        /*
           Возвращаем главное меню.
        */

        welcomeScreen.classList.remove(
            "hidden"
        );


        /*
           Сбрасываем старое поле,
           чтобы при следующем открытии
           оно было чистым.
        */

        createField();


        /*
           Скрываем старый процент.
        */

        hideDownloadPercent();


        /*
           Возвращаем страницу наверх.
        */

        window.scrollTo(
            0,
            0
        );
    }
);


/* =========================================
   СЛАЙДЕР
========================================= */

slider.addEventListener(
    "input",
    () => {

        starCount.textContent =
            slider.value;
    }
);


/* =========================================
   КНОПКА GERAR CAMPO
========================================= */

generateButton.addEventListener(
    "click",
    () => {

        generateField();
    }
);


/* =========================================
   ПЕРЕКЛЮЧАТЕЛЬ ЗВУКА
========================================= */

soundToggle.addEventListener(
    "click",
    () => {

        soundEnabled =
            !soundEnabled;


        soundToggle.textContent =
            soundEnabled
                ? "🔊"
                : "🔇";


        localStorage.setItem(
            "soundEnabled",
            String(
                soundEnabled
            )
        );


        if (soundEnabled) {

            playClickSound();
        }
    }
);


/* =========================================
   ЗАГРУЗКА СОХРАНЁННОГО ЗВУКА
========================================= */

const savedSound =
    localStorage.getItem(
        "soundEnabled"
    );


if (
    savedSound !== null
) {

    soundEnabled =
        savedSound === "true";


    soundToggle.textContent =
        soundEnabled
            ? "🔊"
            : "🔇";
}


/* =========================================
   НАЧАЛЬНОЕ СОСТОЯНИЕ
========================================= */

starCount.textContent =
    slider.value;


/*
   Поле создаётся заранее,
   но пользователь его пока
   не видит, поскольку находится
   на welcomeScreen.
*/

createField();

/* =========================================
   ПРЕДЗАГРУЗКА ЗВЕЗДЫ
========================================= */

const preloadedStar = new Image();

preloadedStar.src = "assets/star.png";

preloadedStar.onload = () => {
    console.log("Star texture loaded");
};

preloadedStar.onerror = () => {
    console.error("Failed to load star.png");
};
