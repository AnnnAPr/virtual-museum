import { describe, it, expect } from 'vitest';
import { escapeHtml } from '../utils/helpers.js';

describe('escapeHtml', () => {
  it('should escape HTML special characters', () => {
    expect(escapeHtml('<div>')).toBe('&lt;div&gt;');
    expect(escapeHtml('"hello" & "world"')).toBe('&quot;hello&quot; &amp; &quot;world&quot;');
  });

  it('should handle strings with no special characters', () => {
    expect(escapeHtml('hello world')).toBe('hello world');
  });

  it('should handle numbers by converting them to strings', () => {
    expect(escapeHtml(123)).toBe('123');
  });

  it('should handle empty strings', () => {
    expect(escapeHtml('')).toBe('');
  });
});
