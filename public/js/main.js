const menu = document.querySelector('#menu-hamburguer');
const navItems = document.querySelector('#nav-items');
const navLinks = document.querySelectorAll('#nav-items a');
let controllersCarrossel; 
let itemsCarrossel;

menu.addEventListener('click', showHideMenuItems);
navLinks.forEach(link => link.addEventListener('click', showHideMenuItems));

function showHideMenuItems (){
    menu.classList.toggle('active');
    navItems.classList.toggle('active');
}


(async function getCardapio() {
    try {
        const rawCardapio = await fetch('https://api.brchallenges.com/api/empire-burger/menu')
        const cardapio = await rawCardapio.json();

        renderCardapio(cardapio);
    } catch (error) {
        console.error(error);
    }
})();

(async function getComentarios() {
    try {
        const rawComentarios = await fetch('https://api.brchallenges.com/api/empire-burger/testimonials');
        const comentarios = await rawComentarios.json();

        formatComentarios(comentarios);
    } catch (error) {
        console.error(error);
    }
})();


(function formatLocalDateTime(){
    let segunda = new Date(Date.UTC(2012, 11, 17, 5, 0, 0)).toLocaleDateString(undefined, { weekday: 'long'});
    let sexta = new Date(Date.UTC(2012, 11, 21, 5, 0, 0)).toLocaleDateString(undefined, { weekday: 'long'});
    let sabado = new Date(Date.UTC(2012, 11, 22, 5, 0, 0)).toLocaleDateString(undefined, { weekday: 'long'});
    let domingo = new Date(Date.UTC(2012, 11, 23, 5, 0, 0)).toLocaleDateString(undefined, { weekday: 'long'});

    let horasAbertura = new Date('Mon Sep 19 2022 17:00:00 GMT-0300').toLocaleString(undefined, {hour: 'numeric'});
    let horasFechamento = new Date('Mon Sep 19 2022 23:00:00 GMT-0300').toLocaleString(undefined, {hour: 'numeric'});
    let horasAberturaFinalDeSemana = new Date('Mon Sep 19 2022 18:00:00 GMT-0300').toLocaleString(undefined, {hour: 'numeric'});

    renderLocalDateTime([
        {diasSemana: [segunda,sexta],
         diasFinalDeSemana: [sabado,domingo]
        }, 
        {horarios: [horasAbertura,horasFechamento,horasAberturaFinalDeSemana]}
    ]);
})();

function formatComentarios(data){
    let itensCarrossel = Array.from({length: Math.ceil(data.length / 3)}, (e, i) => `<div class="spin carrossel-item${i === 0 ? " active" : ''} cr-${i}"></div>`);

    let template = '';
    data.forEach((el, i) => {
        template += `<div class="card-comentario flex column">
        <p class="opacity-ninety">“${el['testimonial']}”</p>
        <div class="flex">
            <img src="${el['image']}" alt="">
            <div class="flex column">
                <p class="opacity-ninety">${el['name']}</p>
                <p class="opacity-sixtynine">${el['age']} Anos</p>
            </div>
        </div>
        </div>`;

        });
        template = `<div class="comentarios-container flex">${template}</div>`
        renderComentarios(template, itensCarrossel)
}

function renderComentarios(comentarios, carrossel) {
    const containerComentarios = document.querySelector('#container-c');
    const carrosselContainer = document.querySelector('.carrossel');

    containerComentarios.innerHTML += comentarios;
    carrossel.forEach(el => carrosselContainer.innerHTML += el);

    itemsCarrossel = document.querySelectorAll('.carrossel-item');
    controllersCarrossel = document.querySelectorAll('.controller');
    
    itemsCarrossel.forEach(item => item.addEventListener('click', moveCarousel))
    controllersCarrossel.forEach(item => item.addEventListener('click', moveCarousel));
}

function renderLocalDateTime(data){
    let horas = `${data[1]['horarios'][0].length > 2 ? '' : 'h00'}`

    document.querySelector('.promocao-main-container article> :nth-child(3)>div:first-of-type p:first-of-type').textContent = `${data[0]['diasSemana'][0]} - ${data[0]['diasSemana'][1]}: ${data[1]['horarios'][0]}${horas} - ${data[1]['horarios'][1]}${horas}`;

    document.querySelector('.promocao-main-container article> :nth-child(3)>div:first-of-type p:nth-of-type(2)').textContent = `${data[0]['diasFinalDeSemana'][0]} - ${data[0]['diasFinalDeSemana'][1]}: ${data[1]['horarios'][1]}${horas} - ${data[1]['horarios'][2]}${horas}`;
}

function renderCardapio(data) {
    data.forEach(el => {
        let template = `<div>
        <div class="flex nome-valor-prato">
            <p>${el.plate}</p>
            <div class="spin"></div>
            <p>${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(el.price)}</p>
        </div>
       <p class="info-prato opacity-ninety">${el.ingredients}</p> 
    </div>`;
    document.querySelector('.cardapio-main-container article>div:nth-of-type(2) > div').innerHTML += template;
    })
}

function moveCarousel(e) {
    const mainContainerComentarios = document.querySelector('#main-container-comentarios');
    const containerC = document.querySelector('#container-c');
    const containerComentarios = document.querySelector('.comentarios-container');
    const comentarios = document.querySelector('.card-comentario');
    const carouselContainer = document.querySelector('.carrossel');
    const currentCarouselItemActive = document.querySelector('.carrossel-item.active');

    const getCarouselItemNumber = (e) => Number(e.classList.toString().match(/\d/)[0])
    
    let currentCarouselItemActiveClass;  
    if(carouselContainer){
        currentCarouselItemActiveClass = getCarouselItemNumber(currentCarouselItemActive);
    }

    const maxWidth = containerC.offsetWidth - mainContainerComentarios.offsetWidth;
    const oneComment = comentarios.offsetWidth + parseFloat(window.getComputedStyle(containerComentarios).marginLeft);
    const move =  oneComment * Math.floor(mainContainerComentarios.offsetWidth / oneComment);
    const element = e.target;

    if(element.classList.contains('controller')) {

        
        if(element.id === 'right') mainContainerComentarios.scrollLeft < maxWidth ? (mainContainerComentarios.scrollLeft += move, currentCarouselItemActiveClass++ ) : ( mainContainerComentarios.scrollLeft = 0, currentCarouselItemActiveClass = 0);
        if(element.id === 'left') mainContainerComentarios.scrollLeft > 0 ? (mainContainerComentarios.scrollLeft -= move, currentCarouselItemActiveClass-- ): ( mainContainerComentarios.scrollLeft =  maxWidth, currentCarouselItemActiveClass = carouselContainer.childElementCount - 1);
        
        const nextCarousel = document.querySelector(`.carrossel-item.cr-${currentCarouselItemActiveClass}`)
        
        if(nextCarousel) {
            currentCarouselItemActive.classList.remove('active');
            nextCarousel.classList.add('active');
        }
    
    }else if(element.classList.contains('carrossel-item') && !element.classList.contains('active')){

        mainContainerComentarios.scrollLeft = ( move * getCarouselItemNumber(element) );

        currentCarouselItemActive.classList.remove('active');
        element.classList.add('active');

    }
}