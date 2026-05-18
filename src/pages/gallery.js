import { searchArtworks, fetchObject } from '../api/metApi.js';
import { escapeHtml } from '../utils/helpers.js';

let currentSearchIDs = [];
let validArtworksCache = [];
let lastCheckedIndex = 0;
const ITEMS_PER_PAGE = 12;

export async function renderGallery(query = '', page = 0) {
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

    <div id="pagination-controls" style="text-align: center; margin-top: 20px; display: none;">
      <button id="prev-btn" style="padding: 8px 16px; margin: 0 10px;">Previous</button>
      <span id="page-info" style="font-weight: bold;">Page ${page + 1}</span>
      <button id="next-btn" style="padding: 8px 16px; margin: 0 10px;">Next</button>
    </div>
  `;

  document.getElementById('search-button').addEventListener('click', () => {
    const newQuery = document.getElementById('search-input').value;
    if (newQuery) renderGallery(newQuery, 0);
  });

  document.getElementById('search-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const newQuery = document.getElementById('search-input').value;
      if (newQuery) renderGallery(newQuery, 0);
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

  document.getElementById('prev-btn').addEventListener('click', () => {
    if (page > 0) renderGallery(query, page - 1);
  });

  document.getElementById('next-btn').addEventListener('click', () => {
    renderGallery(query, page + 1);
  });

  const artworkGrid = document.getElementById('artwork-grid');
  const statusContainer = document.getElementById('status-container');

  if (!query) {
    statusContainer.innerHTML = `Enter a search term above to find art!`;
    return;
  }

  statusContainer.innerHTML = `Searching for "${safeQuery}"...`;

  try {
    if (page === 0) {
      const searchData = await searchArtworks(query);
      currentSearchIDs = searchData.objectIDs || [];
      validArtworksCache = [];
      lastCheckedIndex = 0;
    }

    if (currentSearchIDs.length === 0) {
      statusContainer.innerHTML = '';
      artworkGrid.innerHTML = `<p class="status-msg">No results found for "${safeQuery}".</p>`;
      return;
    }

    artworkGrid.innerHTML = '';

    const totalNeeded = (page + 1) * ITEMS_PER_PAGE;

    let checkedThisRound = 0;

    //Safety limit to prevent infinite loop if many objects lack images
    const MAX_CHECKS = 40;

    while (
      validArtworksCache.length < totalNeeded &&
      lastCheckedIndex < currentSearchIDs.length &&
      checkedThisRound < MAX_CHECKS
    ) {
      // Fetch objects in batches of 4 for better performance(respect API rate)
      const batchIds = currentSearchIDs.slice(lastCheckedIndex, lastCheckedIndex + 4);
      lastCheckedIndex += 4;
      checkedThisRound += 4;

      const requests = batchIds.map((id) => fetchObject(id));

      // Use allSettled to continue even if some requests fail
      const settled = await Promise.allSettled(requests);
      const artResults = settled.filter((r) => r.status === 'fulfilled').map((r) => r.value);

      //Filter out items without images and add to cache
      for (const art of artResults) {
        if (art.primaryImageSmall) {
          validArtworksCache.push(art);
        }
      }
    }

    const startIndex = page * ITEMS_PER_PAGE;
    const pageArtworks = validArtworksCache.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const paginationControls = document.getElementById('pagination-controls');

    let hasMoreItems = false;
    if (validArtworksCache.length > totalNeeded) {
      hasMoreItems = true;
    } else if (
      validArtworksCache.length === totalNeeded &&
      lastCheckedIndex < currentSearchIDs.length
    ) {
      hasMoreItems = true;
    }

    paginationControls.style.display = currentSearchIDs.length > ITEMS_PER_PAGE ? 'block' : 'none';
    document.getElementById('prev-btn').disabled = page === 0;
    document.getElementById('next-btn').disabled = !hasMoreItems;

    for (const art of pageArtworks) {
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
    }

    if (pageArtworks.length === 0) {
      statusContainer.innerHTML = `No more images found for "${safeQuery}".`;
    } else {
      statusContainer.innerHTML = '';
    }
  } catch (error) {
    console.error('API Error:', error);
    artworkGrid.innerHTML = `<p class="error">Failed to load The Art collection. Please try again.</p>`;
  }
}
