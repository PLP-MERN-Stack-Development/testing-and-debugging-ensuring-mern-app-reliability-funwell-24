import { formatName, validateEmail, getInitials } from '../helpers';

describe('Helper Functions', () => {
  describe('formatName', () => {
    test('formats name correctly', () => {
      expect(formatName('john doe')).toBe('John Doe');
      expect(formatName('JANE SMITH')).toBe('Jane Smith');
    });

    test('handles empty name', () => {
      expect(formatName('')).toBe('');
      expect(formatName(null)).toBe('');
    });
  });

  describe('validateEmail', () => {
    test('validates correct emails', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    });

    test('rejects invalid emails', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
    });
  });

  describe('getInitials', () => {
    test('gets initials from name', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('Alice Bob Charlie')).toBe('AB');
    });

    test('handles single name', () => {
      expect(getInitials('John')).toBe('J');
    });
  });
});