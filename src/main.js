import './style.css'

const mainContent = document.getElementById('main-content');
const navGallery = document.getElementById('nav-gallery');
const navArtists = document.getElementById('nav-artists');

document.addEventListener('DOMContentLoaded', () => {
  handleRouting();
  window.addEventListener('hashchange', handleRouting);
});

function handleRouting() {
  const hash = window.location.hash || '#gallery';
  const view = hash.replace('#', '');
  
  updateNavUI(view);
  
  if (view === 'gallery') {
    renderGallery();
  } else if (view === 'artists') {
    renderArtists();
  }
}

function updateNavUI(view) {
  navGallery.classList.remove('active');
  navArtists.classList.remove('active');
  
  if (view === 'gallery') navGallery.classList.add('active');
  if (view === 'artists') navArtists.classList.add('active');
}

async function renderGallery() {
  mainContent.innerHTML = `
    <h2 class="section-title">Gallery</h2>
    <div class="grid" id="artwork-grid">
      <p>Fetching artworks from the Art API</p>
    </div>
  `;
}

async function renderArtists() {
  mainContent.innerHTML = `
    <h2 class="section-title">Artists</h2>
    <div class="grid" id="artist-grid">
      <p>Fetching artists data from Art API</p>
    </div>
  `;
}