import './style.css';

const mainContent = document.getElementById('main-content');
const navHome = document.getElementById('nav-home');
const navGallery = document.getElementById('nav-gallery');
const navArtists = document.getElementById('nav-artists');

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
  } else if (view === 'artists') {
    renderArtists();
  }
}

function updateNavUI(view) {
  navHome.classList.remove('active');
  navGallery.classList.remove('active');
  navArtists.classList.remove('active');

  if (view === 'home') navHome.classList.add('active');
  if (view === 'gallery') navGallery.classList.add('active');
  if (view === 'artists') navArtists.classList.add('active');
}

function renderHome() {
  mainContent.innerHTML = `
    <h2 class="section-title">Welcome to the Virtual Museum</h2>
    <div id="home-featured" style="text-align: center; margin-top: 2rem;">
      <img src="/sunflowers.jpg" alt="Sunflowers" style="max-width: 100%; max-height: 500px; border-radius: 8px; box-shadow: 0 8px 20px rgba(0,0,0,0.5);">
      <h3 style="margin-top: 1.5rem; color: #fff;">Sunflowers</h3>
      <p style="color: #b5a8c2; font-size: 1.1rem;">Vincent van Gogh</p>
    </div>
  `;
}

async function renderGallery(query = '') {
  mainContent.innerHTML = `
    <h2 class="section-title">The Art Gallery</h2>
    
    <div class="search-container">
      <input type="text" id="search-input" placeholder="Search for art (e.g. cats, gold, sunflowers)..." value="${query}">
      <button id="search-button">Search</button>
    </div>
    <div id="status-container" style="text-align: center; margin-bottom: 2rem; color: #cbbcdbff;">
    </div>

    <div class="grid" id="artwork-grid">
    </div>
  `;

  document.getElementById('search-button').addEventListener('click', () => {
    const newQuery = document.getElementById('search-input').value;
    if (newQuery) renderGallery(newQuery);
  });

  document.getElementById('search-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();

      const newQuery = document.getElementById('search-input').value;
      if (newQuery) renderGallery(newQuery);
    }
  });

  const artworkGrid = document.getElementById('artwork-grid');
  const statusContainer = document.getElementById('status-container');

  if (!query) {
    statusContainer.innerHTML = `Enter a search term above to find art!`;
    return;
  }

  statusContainer.innerHTML = `Searching for "${query}"...`;

  try {
    const searchRes = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${query}`
    );
    const searchData = await searchRes.json();
    console.log('searchData: ', searchData);

    if (!searchData.objectIDs || searchData.objectIDs.length === 0) {
      artworkGrid.innerHTML = `<p class="status-msg">No results found for "${query}".</p>`;
      return;
    }

    artworkGrid.innerHTML = '';

    const TARGET_COUNT = 12;
    let validCount = 0;

    // retrieve by small 4 batches
    for (let i = 0; i < searchData.objectIDs.length && validCount < TARGET_COUNT; i += 4) {
      const batchIds = searchData.objectIDs.slice(i, i + 4);
      const requests = batchIds.map((id) =>
        fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`).then(
          (res) => res.json()
        )
      );

      const artResults = await Promise.all(requests);
      console.log('artResults: ', artResults);

      for (const art of artResults) {
        if (validCount >= TARGET_COUNT) break;

        if (art.primaryImageSmall) {
          const card = document.createElement('div');
          card.className = 'art-card';
          card.innerHTML = `
            <div class="art-image">
              <img src="${art.primaryImageSmall}" alt="${art.title}" loading="lazy">
            </div>
            <div class="art-info">
              <h3>${art.title}</h3>
              <p>${art.artistDisplayName}</p>
              <p class="art-date">${art.objectDate}</p>
            </div>
          `;
          artworkGrid.appendChild(card);
          validCount++;
        }
      }
    }

    if (validCount === 0) {
      statusContainer.innerHTML = `No images found for "${query}".`;
    } else {
      statusContainer.innerHTML = '';
    }
  } catch (error) {
    console.error('API Error:', error);
    artworkGrid.innerHTML = `<p class="error">Failed to load The Art collection. Please try again.</p>`;
  }
}

async function renderArtists() {
  mainContent.innerHTML = `
    <h2 class="section-title">Artists</h2>
    <div class="grid" id="artist-grid">
      <p>Fetching artists data from Art API</p>
    </div>
  `;
}
