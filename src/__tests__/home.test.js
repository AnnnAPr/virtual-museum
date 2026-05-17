import { describe, it, expect, beforeEach } from 'vitest';
import { renderHome } from '../pages/home.js';

describe('renderHome', () => {
  beforeEach(() => {
    document.getElementById('main-content').innerHTML = '';
  });

  it('should render the home page content correctly', () => {
    renderHome();
    const mainContent = document.getElementById('main-content');
    const title = mainContent.querySelector('.section-title');
    expect(title).not.toBeNull();
    expect(title.textContent).toBe('Welcome to the Virtual Museum');
    const img = mainContent.querySelector('.home-img');
    expect(img).not.toBeNull();
    expect(img.getAttribute('src')).toBe('/sunflowers.jpg');
    expect(img.getAttribute('alt')).toBe('Sunflowers');

    const homeTitle = mainContent.querySelector('.home-title');
    expect(homeTitle).not.toBeNull();
    expect(homeTitle.textContent).toBe('Sunflowers');

    const homeArtist = mainContent.querySelector('.home-artist');
    expect(homeArtist).not.toBeNull();
    expect(homeArtist.textContent).toBe('Vincent van Gogh');
  });
});
