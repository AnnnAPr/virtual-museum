import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderDepartments } from '../pages/departments.js';
import { fetchObject, searchByDepartment, fetchDepartments } from '../api/metApi.js';

vi.mock('../api/metApi.js', () => ({
  fetchObject: vi.fn(),
  searchByDepartment: vi.fn(),
  fetchDepartments: vi.fn(),
}));

describe('renderDepartments', () => {
  beforeEach(() => {
    document.getElementById('main-content').innerHTML = '';
    vi.clearAllMocks();
  });

  it('should render departments and handle clicking one', async () => {
    fetchDepartments.mockResolvedValue({
      departments: [
        { departmentId: 1, displayName: 'American Decorative Arts' },
        { departmentId: 2, displayName: 'Ancient Near Eastern Art' },
      ],
    });

    searchByDepartment.mockResolvedValue({ objectIDs: [100] });
    fetchObject.mockResolvedValue({
      primaryImageSmall: 'dept-art.jpg',
      title: 'Dept Art',
      artistDisplayName: 'Dept Artist',
    });

    await renderDepartments();

    const grid = document.getElementById('departments-grid');
    expect(grid.querySelectorAll('.department-card').length).toBe(2);
    expect(grid.textContent).toContain('American Decorative Arts');
    expect(grid.textContent).toContain('Ancient Near Eastern Art');

    const card = grid.querySelector('.department-card');
    card.click();

    await vi.waitFor(() => {
      expect(searchByDepartment).toHaveBeenCalledWith(1);
    });

    await vi.waitFor(() => {
      expect(fetchObject).toHaveBeenCalledWith(100);
    });

    await vi.waitFor(() => {
      const modalTitle = document.getElementById('modal-title');
      if (modalTitle.innerText === 'Dept Art' || modalTitle.textContent === 'Dept Art') {
        expect(true).toBe(true);
      } else {
        expect(modalTitle.innerText).toBe('Dept Art');
      }
    });
  });
});
