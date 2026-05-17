import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderGallery } from '../pages/gallery.js';
import { searchArtworks, fetchObject } from '../api/metApi.js';

vi.mock('../api/metApi.js', () => ({
  searchArtworks: vi.fn(),
  fetchObject: vi.fn(),
}));

describe('renderGallery', () => {
  beforeEach(() => {
    document.getElementById('main-content').innerHTML = '';
    vi.clearAllMocks();
  });

  it('should prompt for a search term if no query is provided', async () => {
    await renderGallery();
    const statusContainer = document.getElementById('status-container');
    expect(statusContainer.textContent).toContain('Enter a search term above to find art!');
  });

  it('should search and render artworks', async () => {
    searchArtworks.mockResolvedValue({ objectIDs: [1, 2] });
    fetchObject
      .mockResolvedValueOnce({
        primaryImageSmall: 'img1.jpg',
        title: 'Art 1',
        artistDisplayName: 'Artist 1',
        objectDate: '2021',
      })
      .mockResolvedValueOnce({
        primaryImageSmall: 'img2.jpg',
        title: 'Art 2',
        artistDisplayName: 'Artist 2',
        objectDate: '2022',
      });

    await renderGallery('sunflowers', 0);

    const artworkGrid = document.getElementById('artwork-grid');

    expect(searchArtworks).toHaveBeenCalledWith('sunflowers');
    expect(fetchObject).toHaveBeenCalledWith(1);
    expect(fetchObject).toHaveBeenCalledWith(2);

    expect(artworkGrid.querySelectorAll('.art-card').length).toBe(2);
    expect(artworkGrid.innerHTML).toContain('Art 1');
    expect(artworkGrid.innerHTML).toContain('img2.jpg');
  });

  it('should display a no results message when no objectIDs are returned', async () => {
    searchArtworks.mockResolvedValue({ objectIDs: null });

    await renderGallery('asdfghjklqwerty', 0);

    const artworkGrid = document.getElementById('artwork-grid');
    expect(artworkGrid.textContent).toContain('No results found for "asdfghjklqwerty"');
  });
});
