import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  searchArtworks,
  fetchObject,
  searchByDepartment,
  fetchDepartments,
} from '../api/metApi.js';

describe('metApi', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('searchArtworks', () => {
    it('should fetch and return search results for a query', async () => {
      const mockResult = { objectIDs: [1, 2, 3] };
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResult,
      });
      vi.stubGlobal('fetch', fetchMock);

      const result = await searchArtworks('sunflowers');

      expect(fetchMock).toHaveBeenCalledWith(
        'https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=sunflowers'
      );
      expect(result).toEqual(mockResult);
    });

    it('should throw an error if the search fetch fails', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });
      vi.stubGlobal('fetch', fetchMock);

      await expect(searchArtworks('sunflowers')).rejects.toThrow(
        'Search request failed with status 500'
      );
    });
  });

  describe('fetchObject', () => {
    it('should fetch and return object details for a given ID', async () => {
      const mockResult = { title: 'Sunflower' };
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResult,
      });
      vi.stubGlobal('fetch', fetchMock);

      const result = await fetchObject(42);

      expect(fetchMock).toHaveBeenCalledWith(
        'https://collectionapi.metmuseum.org/public/collection/v1/objects/42'
      );
      expect(result).toEqual(mockResult);
    });

    it('should throw an error if fetchObject fails', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      });
      vi.stubGlobal('fetch', fetchMock);

      await expect(fetchObject(42)).rejects.toThrow('Object 42 responded with 404');
    });
  });

  describe('searchByDepartment', () => {
    it('should fetch and return search results by department id', async () => {
      const mockResult = { objectIDs: [4, 5] };
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResult,
      });
      vi.stubGlobal('fetch', fetchMock);

      const result = await searchByDepartment(11);

      expect(fetchMock).toHaveBeenCalledWith(
        'https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=11&hasImages=true&q=art'
      );
      expect(result).toEqual(mockResult);
    });

    it('should throw an error if department search fails', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
      });
      vi.stubGlobal('fetch', fetchMock);

      await expect(searchByDepartment(11)).rejects.toThrow(
        'Department search failed with status 400'
      );
    });
  });

  describe('fetchDepartments', () => {
    it('should fetch and return list of departments', async () => {
      const mockResult = {
        departments: [{ departmentId: 1, displayName: 'American Decorative Arts' }],
      };
      const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResult,
      });
      vi.stubGlobal('fetch', fetchMock);

      const result = await fetchDepartments();

      expect(fetchMock).toHaveBeenCalledWith(
        'https://collectionapi.metmuseum.org/public/collection/v1/departments'
      );
      expect(result).toEqual(mockResult);
    });

    it('should throw an error if fetchDepartments fails', async () => {
      const fetchMock = vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
      });
      vi.stubGlobal('fetch', fetchMock);

      await expect(fetchDepartments()).rejects.toThrow(
        'Departments request failed with status 503'
      );
    });
  });
});
