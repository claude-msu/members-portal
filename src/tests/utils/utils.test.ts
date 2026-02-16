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
      // Should have the default background and text color for 'default' variant
      expect(classes).toContain('bg-primary');
      expect(classes).toContain('text-primary-foreground');
      expect(classes).toContain('border-2');
      expect(classes).toContain('border-primary');
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
      const greenClasses = buttonVariants({ variant: 'green' });
      const redClasses = buttonVariants({ variant: 'red' });

      // Check for correct styles from the variant map in utils.ts
      expect(defaultClasses).toContain('bg-primary');
      expect(defaultClasses).toContain('border-primary');
      expect(defaultClasses).toContain('text-primary-foreground');

      expect(secondaryClasses).toContain('border-primary');
      expect(secondaryClasses).toContain('hover:bg-primary');
      expect(secondaryClasses).toContain('text-primary');
      expect(secondaryClasses).toContain('hover:text-cream');

      expect(greenClasses).toContain('bg-green-600');
      expect(greenClasses).toContain('border-green-600');
      expect(greenClasses).toContain('text-white');
      expect(greenClasses).toContain('hover:bg-cream');
      expect(greenClasses).toContain('hover:text-green-600');

      expect(redClasses).toContain('border-destructive');
      expect(redClasses).toContain('text-destructive');
      expect(redClasses).toContain('hover:bg-destructive');
      expect(redClasses).toContain('hover:text-cream');
    });

    it('applies size classes correctly', () => {
      const buttonVariants = createButtonVariants();
      const smClasses = buttonVariants({ size: 'sm' });
      const lgClasses = buttonVariants({ size: 'lg' });
      const iconClasses = buttonVariants({ size: 'icon' });

      expect(smClasses).toContain('h-9');
      expect(smClasses).toContain('rounded-md');
      expect(smClasses).toContain('px-3');

      expect(lgClasses).toContain('h-11');
      expect(lgClasses).toContain('rounded-md');
      expect(lgClasses).toContain('px-8');

      expect(iconClasses).toContain('h-10');
      expect(iconClasses).toContain('w-10');
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
      expect(classes).toContain('border-2');
      // Default is bg-secondary, text-secondary-foreground
      expect(classes).toContain('bg-secondary');
      expect(classes).toContain('text-secondary-foreground');
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
      const boardClasses = badgeVariants({ variant: 'board' });
      const greenClasses = badgeVariants({ variant: 'green' });
      const redClasses = badgeVariants({ variant: 'red' });

      // default: bg-secondary text-secondary-foreground border-2
      expect(defaultClasses).toContain('bg-secondary');
      expect(defaultClasses).toContain('text-secondary-foreground');
      expect(defaultClasses).toContain('border-2');

      // secondary: border-2 bg-secondary text-primary
      expect(secondaryClasses).toContain('bg-secondary');
      expect(secondaryClasses).toContain('border-2');
      expect(secondaryClasses).toContain('text-primary');

      // board: border-2 border-primary bg-primary text-primary-foreground
      expect(boardClasses).toContain('bg-primary');
      expect(boardClasses).toContain('border-primary');
      expect(boardClasses).toContain('text-primary-foreground');

      // green: bg-green-600/5 text-green-600 (no border-green-600, see @src/lib/utils.ts)
      expect(greenClasses).toContain('bg-green-600/5');
      expect(greenClasses).toContain('text-green-600');
      expect(greenClasses).toContain('border-2');

      // red: bg-red-600/5 text-red-600 (no border-destructive, see @src/lib/utils.ts)
      expect(redClasses).toContain('bg-red-600/5');
      expect(redClasses).toContain('text-red-600');
      expect(redClasses).toContain('border-2');

      // blue: bg-blue-600/5 text-blue-800
      const blueClasses = badgeVariants({ variant: 'blue' });
      expect(blueClasses).toContain('bg-blue-600/5');
      expect(blueClasses).toContain('text-blue-600');
      expect(blueClasses).toContain('border-2');

      // gray: bg-gray-600/5 text-gray-600
      const grayClasses = badgeVariants({ variant: 'gray' });
      expect(grayClasses).toContain('bg-gray-600/5');
      expect(grayClasses).toContain('text-gray-600');
      expect(grayClasses).toContain('border-2');
    });
  });
});