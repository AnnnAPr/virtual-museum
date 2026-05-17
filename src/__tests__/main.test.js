import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../pages/home.js', () => ({
  renderHome: vi.fn(),
}));

vi.mock('../pages/gallery.js', () => ({
  renderGallery: vi.fn(),
}));

vi.mock('../pages/departments.js', () => ({
  renderDepartments: vi.fn(),
}));

import { renderHome } from '../pages/home.js';
import { renderGallery } from '../pages/gallery.js';
import { renderDepartments } from '../pages/departments.js';

import '../main.js';

describe('main.js routing and UI updates', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    document.getElementById('nav-home').className = '';
    document.getElementById('nav-gallery').className = '';
    document.getElementById('nav-departments').className = '';
  });

  it('should initialize with the home view on DOMContentLoaded', () => {
    document.dispatchEvent(new Event('DOMContentLoaded'));

    expect(window.location.hash).toBe('#home');
    expect(renderHome).toHaveBeenCalled();
    expect(document.getElementById('nav-home').classList.contains('active')).toBe(true);
  });

  it('should handle routing to gallery on hashchange', () => {
    window.location.hash = '#gallery';
    window.dispatchEvent(new Event('hashchange'));

    expect(renderGallery).toHaveBeenCalled();
    expect(document.getElementById('nav-gallery').classList.contains('active')).toBe(true);
    expect(document.getElementById('nav-home').classList.contains('active')).toBe(false);
  });

  it('should handle routing to departments on hashchange', () => {
    window.location.hash = '#departments';
    window.dispatchEvent(new Event('hashchange'));

    expect(renderDepartments).toHaveBeenCalled();
    expect(document.getElementById('nav-departments').classList.contains('active')).toBe(true);
    expect(document.getElementById('nav-home').classList.contains('active')).toBe(false);
    expect(document.getElementById('nav-gallery').classList.contains('active')).toBe(false);
  });
});
