import './style.css';

const mainContent = document.getElementById('main-content');
const navHome = document.getElementById('nav-home');
const navGallery = document.getElementById('nav-gallery');
const navDepartments = document.getElementById('nav-departments');

const API_BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1';
const endpoint1_search = `${API_BASE_URL}/search`;
const endpoint2_objects = `${API_BASE_URL}/objects`;
const endpoint3_departments = `${API_BASE_URL}/departments`;

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
    renderDeprtments();
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
    const searchRes = await fetch(`${endpoint1_search}?hasImages=true&q=${query}`);
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
        fetch(`${endpoint2_objects}/${id}`).then((res) => res.json())
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

async function renderDeprtments() {
  mainContent.innerHTML = `
    <h2 class="section-title">Museum Departments</h2>
    <p style="text-align: center; color: #b5a8c2; margin-bottom: 2rem;">Click a department to discover a random artwork!</p>
    
    <div id="status-container" style="text-align: center; margin-bottom: 2rem; color: #cbbcdbff;">
      Loading departments...
    </div>
    
    <div class="grid" id="departments-grid"></div>

    <div id="art-modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); z-index: 1000; justify-content: center; align-items: center;">
      <div style="background: #2a1f3d; padding: 20px; border-radius: 8px; max-width: 600px; width: 90%; text-align: center; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
        <button id="close-modal" style="position: absolute; top: 10px; right: 15px; background: none; border: none; color: white; font-size: 2rem; cursor: pointer;">&times;</button>
        <h3 id="modal-title" style="margin-top: 10px; color: #fff;">Loading...</h3>
        
        <div id="modal-image-container" style="margin: 20px 0; min-height: 200px; display: flex; justify-content: center; align-items: center; color: #cbbcdbff;">
        </div>
        
        <p id="modal-department" style="color: #b5a8c2; font-weight: bold;"></p>
      </div>
    </div>
  `;

  const departmentsGrid = document.getElementById('departments-grid');
  const statusContainer = document.getElementById('status-container');
  const modal = document.getElementById('art-modal');
  const closeModal = document.getElementById('close-modal');

  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  try {
    const res = await fetch(endpoint3_departments);
    const data = await res.json();

    console.log('data: ', data);

    statusContainer.innerHTML = '';

    data.departments.forEach((dept) => {
      console.log('dept: ', dept);

      const card = document.createElement('div');
      card.className = 'art-card department-card';

      card.innerHTML = `<h3 style="margin:0;">${dept.displayName}</h3>`;

      card.addEventListener('click', () => {
        openRandomArtModal(dept.departmentId, dept.displayName);
      });

      departmentsGrid.appendChild(card);
    });
  } catch (error) {
    console.error('API Error:', error);
    statusContainer.innerHTML = 'Failed to load departments from the Met API.';
  }
}

async function openRandomArtModal(departmentId, departmentName) {
  const modal = document.getElementById('art-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalImageContainer = document.getElementById('modal-image-container');
  const modalDepartment = document.getElementById('modal-department');

  modalTitle.innerText = `Exploring "${departmentName}"`;

  modalImageContainer.innerHTML = '<div class="loader"></div>';

  //   modalDepartment.innerText = `Department ID: ${departmentId}`;

  modal.style.display = 'flex';

  try {
    const searchRes = await fetch(
      `${endpoint1_search}?departmentId=${departmentId}&hasImages=true&q=art`
    );
    const searchData = await searchRes.json();
    let artData = null;

    if (searchData.objectIDs && searchData.objectIDs.length > 0) {
      const randomIndex = Math.floor(Math.random() * searchData.objectIDs.length);
      const randomId = searchData.objectIDs[randomIndex];
      const artRes = await fetch(`${endpoint2_objects}/${randomId}`);
      artData = await artRes.json();
    }

    if (artData && artData.primaryImageSmall) {
      modalTitle.innerText = artData.title;
      modalImageContainer.innerHTML = `<img src="${artData.primaryImageSmall}" alt="${artData.title}" style="max-width: 100%; max-height: 50vh; border-radius: 4px; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">`;

      const artistText = artData.artistDisplayName
        ? `By: ${artData.artistDisplayName}`
        : 'Unknown Artist';
      modalDepartment.innerText = artistText;
    } else {
      modalTitle.innerText = 'Artworks from this department are currently unavailable.';
      modalImageContainer.innerHTML = `<img src="/sunflowers.jpg" alt="Default Sunflowers" style="max-width: 100%; max-height: 50vh; border-radius: 4px; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">`;
      modalDepartment.innerText = "Please enjoy Van Gogh's classic Sunflowers instead!";
    }
  } catch (error) {
    console.error(error);
    modalImageContainer.innerHTML = '<p>Error loading artwork from the API.</p>';
  }
}
