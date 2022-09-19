const menu = document.querySelector('#menu-hamburguer');
const navItems = document.querySelector('#nav-items');
const navLinks = document.querySelectorAll('#nav-items a')

menu.addEventListener('click', showHideMenuItems)
navLinks.forEach(link => link.addEventListener('click', showHideMenuItems))

function showHideMenuItems (){
    menu.classList.toggle('active');
    navItems.classList.toggle('active');
}
