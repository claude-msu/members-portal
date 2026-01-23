import { describe, it, expect } from 'vitest';
import { cn, createButtonVariants, createBadgeVariants } from '@/lib/utils';

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

    it('returns default variant classes when called without props', () => {
      const buttonVariants = createButtonVariants();
      const classes = buttonVariants();
      expect(classes).toContain('inline-flex');
      expect(classes).toContain('items-center');
      expect(classes).toContain('bg-primary');
    });

    it('applies custom base classes', () => {
      const buttonVariants = createButtonVariants('custom-base');
      const classes = buttonVariants();
      expect(classes).toContain('custom-base');
    });

    it('applies variant classes correctly', () => {
      const buttonVariants = createButtonVariants();
      const defaultClasses = buttonVariants({ variant: 'default' });
      const secondaryClasses = buttonVariants({ variant: 'secondary' });

      expect(defaultClasses).toContain('bg-primary');
      expect(secondaryClasses).toContain('border-primary');
    });

    it('applies size classes correctly', () => {
      const buttonVariants = createButtonVariants();
      const smClasses = buttonVariants({ size: 'sm' });
      const lgClasses = buttonVariants({ size: 'lg' });

      expect(smClasses).toContain('h-9');
      expect(lgClasses).toContain('h-11');
    });
  });

  describe('createBadgeVariants', () => {
    it('creates a badge variant function', () => {
      const badgeVariants = createBadgeVariants();
      expect(typeof badgeVariants).toBe('function');
    });

    it('returns default variant classes when called without props', () => {
      const badgeVariants = createBadgeVariants();
      const classes = badgeVariants();
      expect(classes).toContain('inline-flex');
      expect(classes).toContain('rounded-full');
      expect(classes).toContain('border-primary');
    });

    it('applies custom base classes', () => {
      const badgeVariants = createBadgeVariants('custom-badge');
      const classes = badgeVariants();
      expect(classes).toContain('custom-badge');
    });

    it('applies variant classes correctly', () => {
      const badgeVariants = createBadgeVariants();
      const defaultClasses = badgeVariants({ variant: 'default' });
      const secondaryClasses = badgeVariants({ variant: 'secondary' });

      expect(defaultClasses).toContain('bg-primary');
      expect(secondaryClasses).toContain('bg-secondary');
    });
  });
});