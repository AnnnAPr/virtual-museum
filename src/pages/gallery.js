import { searchArtworks, fetchObject } from '../api/metApi.js';
import { escapeHtml } from '../utils/helpers.js';

export async function renderGallery(query = '') {
  const safeQuery = escapeHtml(query);
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = `
    <h2 class="section-title">The Art Gallery</h2>
    
    <div class="search-container">
      <div class="search-input-wrapper">
        <input type="text" id="search-input" placeholder="Search for art (e.g. cats, gold, sunflowers)..." value="${safeQuery}">
        <button id="clear-input" class="clear-btn" title="Clear search">&times;</button>
      </div>
      <button id="search-button">Search</button>
    </div>
    <div id="status-container">
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

  const searchInput = document.getElementById('search-input');
  const clearBtn = document.getElementById('clear-input');

  clearBtn.style.display = searchInput.value ? 'block' : 'none';

  searchInput.addEventListener('input', () => {
    clearBtn.style.display = searchInput.value ? 'block' : 'none';
  });

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.style.display = 'none';
    searchInput.focus();
    renderGallery('');
  });

  const artworkGrid = document.getElementById('artwork-grid');
  const statusContainer = document.getElementById('status-container');

  if (!query) {
    statusContainer.innerHTML = `Enter a search term above to find art!`;
    return;
  }

  statusContainer.innerHTML = `Searching for "${safeQuery}"...`;

  try {
    const searchData = await searchArtworks(query);

    if (!searchData.objectIDs || searchData.objectIDs.length === 0) {
      statusContainer.innerHTML = '';
      artworkGrid.innerHTML = `<p class="status-msg">No results found for "${safeQuery}".</p>`;
      return;
    }

    artworkGrid.innerHTML = '';

    const TARGET_COUNT = 12;
    let validCount = 0;

    for (let i = 0; i < searchData.objectIDs.length && validCount < TARGET_COUNT; i += 4) {
      const batchIds = searchData.objectIDs.slice(i, i + 4);
      const requests = batchIds.map((id) => fetchObject(id));

      const settled = await Promise.allSettled(requests);
      const artResults = settled.filter((r) => r.status === 'fulfilled').map((r) => r.value);

      for (const art of artResults) {
        if (validCount >= TARGET_COUNT) break;

        if (art.primaryImageSmall) {
          const card = document.createElement('div');
          card.className = 'art-card';
          card.innerHTML = `
            <div class="art-image">
              <img src="${escapeHtml(art.primaryImageSmall)}" alt="${escapeHtml(art.title)}" loading="lazy">
            </div>
            <div class="art-info">
              <h3>${escapeHtml(art.title)}</h3>
              <p>${escapeHtml(art.artistDisplayName)}</p>
              <p class="art-date">${escapeHtml(art.objectDate)}</p>
            </div>
          `;
          artworkGrid.appendChild(card);
          validCount++;
        }
      }
    }

    if (validCount === 0) {
      statusContainer.innerHTML = `No images found for "${safeQuery}".`;
    } else {
      statusContainer.innerHTML = '';
    }
  } catch (error) {
    console.error('API Error:', error);
    artworkGrid.innerHTML = `<p class="error">Failed to load The Art collection. Please try again.</p>`;
  }
}
