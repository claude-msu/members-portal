import { describe, it, expect } from 'vitest';
import { cn, createButtonVariants, createBadgeVariants, escapeCsv } from '@/lib/utils';

describe('utils', () => {
  describe('cn (className merger)', () => {
    it('merges class names correctly', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('handles conditional classes', () => {
      const includeBar = false;
      expect(cn('foo', includeBar && 'bar', 'baz')).toBe('foo baz');
    });

    it('merges Tailwind classes correctly (no duplicates)', () => {
      expect(cn('p-4', 'p-2')).toBe('p-2');
    });

    it('handles empty inputs', () => {
      expect(cn()).toBe('');
    });

    it('handles undefined and null', () => {
      expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
    });
  });

  describe('createButtonVariants', () => {
    it('creates a button variant function', () => {
      const buttonVariants = createButtonVariants();
      expect(typeof buttonVariants).toBe('function');
    });

    it('returns a non-empty string when called without props', () => {
      const buttonVariants = createButtonVariants();
      const classes = buttonVariants();
      expect(typeof classes).toBe('string');
      expect(classes.length).toBeGreaterThan(0);
    });

    it('includes custom base classes when provided to factory', () => {
      const customBase = 'custom-base-class';
      const buttonVariants = createButtonVariants(customBase);
      const classes = buttonVariants();
      expect(classes).toContain(customBase);
    });

    it('returns different strings for different variants', () => {
      const buttonVariants = createButtonVariants();
      const defaultClasses = buttonVariants({ variant: 'default' });
      const secondaryClasses = buttonVariants({ variant: 'secondary' });
      const greenClasses = buttonVariants({ variant: 'green' });
      const redClasses = buttonVariants({ variant: 'red' });

      expect(defaultClasses).not.toBe(secondaryClasses);
      expect(secondaryClasses).not.toBe(greenClasses);
      expect(greenClasses).not.toBe(redClasses);
      expect(new Set([defaultClasses, secondaryClasses, greenClasses, redClasses]).size).toBe(4);
    });

    it('returns different strings for different sizes', () => {
      const buttonVariants = createButtonVariants();
      const defaultSize = buttonVariants({ size: 'default' });
      const smClasses = buttonVariants({ size: 'sm' });
      const lgClasses = buttonVariants({ size: 'lg' });
      const iconClasses = buttonVariants({ size: 'icon' });

      expect(smClasses).not.toBe(lgClasses);
      expect(lgClasses).not.toBe(iconClasses);
      expect(new Set([defaultSize, smClasses, lgClasses, iconClasses]).size).toBe(4);
    });
  });

  describe('createBadgeVariants', () => {
    it('creates a badge variant function', () => {
      const badgeVariants = createBadgeVariants();
      expect(typeof badgeVariants).toBe('function');
    });

    it('returns a non-empty string when called without props', () => {
      const badgeVariants = createBadgeVariants();
      const classes = badgeVariants();
      expect(typeof classes).toBe('string');
      expect(classes.length).toBeGreaterThan(0);
    });

    it('includes custom base classes when provided to factory', () => {
      const customBase = 'custom-badge-class';
      const badgeVariants = createBadgeVariants(customBase);
      const classes = badgeVariants();
      expect(classes).toContain(customBase);
    });

    it('returns different strings for different variants', () => {
      const badgeVariants = createBadgeVariants();
      const defaultClasses = badgeVariants({ variant: 'default' });
      const secondaryClasses = badgeVariants({ variant: 'secondary' });
      const boardClasses = badgeVariants({ variant: 'board' });
      const greenClasses = badgeVariants({ variant: 'green' });
      const redClasses = badgeVariants({ variant: 'red' });
      const blueClasses = badgeVariants({ variant: 'blue' });
      const grayClasses = badgeVariants({ variant: 'gray' });

      const allClasses = [defaultClasses, secondaryClasses, boardClasses, greenClasses, redClasses, blueClasses, grayClasses];
      expect(new Set(allClasses).size).toBe(allClasses.length);
    });
  });

  describe('escapeCsv', () => {
    it('returns string unchanged when it has no special characters', () => {
      expect(escapeCsv('simple')).toBe('simple');
      expect(escapeCsv('email@example.com')).toBe('email@example.com');
    });

    it('wraps in double quotes and escapes internal quotes when string contains comma', () => {
      expect(escapeCsv('a,b')).toBe('"a,b"');
    });

    it('wraps in double quotes and escapes internal quotes when string contains newline', () => {
      expect(escapeCsv('a\nb')).toBe('"a\nb"');
    });

    it('wraps in double quotes and escapes internal quotes when string contains double quote', () => {
      expect(escapeCsv('say "hello"')).toBe('"say ""hello"""');
    });

    it('escapes multiple double quotes', () => {
      expect(escapeCsv('""')).toBe('""""""');
    });

    it('handles carriage return', () => {
      expect(escapeCsv('a\rb')).toBe('"a\rb"');
    });

    it('handles combined special characters', () => {
      const result = escapeCsv('a,b\n"x"');
      expect(result.startsWith('"')).toBe(true);
      expect(result.endsWith('"')).toBe(true);
      expect(result).toContain('""');
    });
  });
});