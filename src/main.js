import './style.css';
import { renderHome } from './pages/home.js';
import { renderGallery } from './pages/gallery.js';
import { renderDepartments } from './pages/departments.js';

const navHome = document.getElementById('nav-home');
const navGallery = document.getElementById('nav-gallery');
const navDepartments = document.getElementById('nav-departments');

document.addEventListener('DOMContentLoaded', () => {
  window.location.hash = '#home';
  handleRouting();
  window.addEventListener('hashchange', handleRouting);
});

function handleRouting() {
  const hash = window.location.hash || '#home';
  const view = hash.replace('#', '');

  updateNavUI(view);

  if (view === 'home') {
    renderHome();
  } else if (view === 'gallery') {
    renderGallery();
  } else if (view === 'departments') {
    renderDepartments();
  }
}

function updateNavUI(view) {
  navHome.classList.remove('active');
  navGallery.classList.remove('active');
  navDepartments.classList.remove('active');

  if (view === 'home') navHome.classList.add('active');
  if (view === 'gallery') navGallery.classList.add('active');
  if (view === 'departments') navDepartments.classList.add('active');
}
