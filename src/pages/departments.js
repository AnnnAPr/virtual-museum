import { fetchObject, searchByDepartment, fetchDepartments } from '../api/metApi.js';
import { escapeHtml } from '../utils/helpers.js';

export async function renderDepartments() {
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `
    <h2 class="section-title">Museum Departments</h2>
    <p class="page-subtitle">Click a department to discover a random artwork!</p>
    
    <div id="status-container">
      Loading departments...
    </div>
    
    <div class="grid" id="departments-grid"></div>

    <div id="art-modal">
      <div class="modal-content">
        <button id="close-modal">&times;</button>
        <h3 id="modal-title">Loading...</h3>
        
        <div id="modal-image-container">
        </div>
        
        <p id="modal-department"></p>
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
    const data = await fetchDepartments();
    statusContainer.innerHTML = '';

    data.departments.forEach((dept) => {
      const card = document.createElement('div');
      card.className = 'art-card department-card';
      card.innerHTML = `<h3>${escapeHtml(dept.displayName)}</h3>`;
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
  modal.style.display = 'flex';

  try {
    const searchData = await searchByDepartment(departmentId);
    let artData = null;

    if (searchData.objectIDs && searchData.objectIDs.length > 0) {
      // Select a random artwork from the department search results
      const randomIndex = Math.floor(Math.random() * searchData.objectIDs.length);
      const randomId = searchData.objectIDs[randomIndex];
      artData = await fetchObject(randomId);
    }

    if (artData && artData.primaryImageSmall) {
      modalTitle.innerText = artData.title;
      modalImageContainer.innerHTML = `<img src="${escapeHtml(artData.primaryImageSmall)}" alt="${escapeHtml(artData.title)}" class="modal-img">`;
      const artistText = artData.artistDisplayName
        ? `By: ${artData.artistDisplayName}`
        : 'Unknown Artist';
      modalDepartment.innerText = artistText;
    } else {
      // Display a default image if no artwork is found
      modalTitle.innerText = 'Artworks from this department are currently unavailable.';
      modalImageContainer.innerHTML = `<img src="/sunflowers.jpg" alt="Default Sunflowers" class="modal-img">`;
      modalDepartment.innerText = "Please enjoy Van Gogh's classic Sunflowers instead!";
    }
  } catch (error) {
    console.error(error);
    modalImageContainer.innerHTML = '<p>Error loading artwork from the API.</p>';
  }
}
