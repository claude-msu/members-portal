import { describe, it, expect } from 'vitest';
import {
  isValidGithubUsername,
  isValidLinkedinUsername,
  isValidEduEmail,
} from '@/lib/validation';

describe('isValidGithubUsername', () => {
  it('allows empty string (optional field)', () => {
    expect(isValidGithubUsername('')).toBe(true);
  });

  it('allows valid usernames with letters and numbers', () => {
    expect(isValidGithubUsername('user')).toBe(true);
    expect(isValidGithubUsername('user123')).toBe(true);
    expect(isValidGithubUsername('a')).toBe(true);
  });

  it('allows single hyphens between characters', () => {
    expect(isValidGithubUsername('user-name')).toBe(true);
    expect(isValidGithubUsername('a-b')).toBe(true);
  });

  it('allows max length 39', () => {
    expect(isValidGithubUsername('a'.repeat(39))).toBe(true);
  });

  it('rejects length over 39', () => {
    expect(isValidGithubUsername('a'.repeat(40))).toBe(false);
  });

  it('rejects leading hyphen', () => {
    expect(isValidGithubUsername('-user')).toBe(false);
  });

  it('rejects trailing hyphen', () => {
    expect(isValidGithubUsername('user-')).toBe(false);
  });

  it('rejects consecutive hyphens', () => {
    expect(isValidGithubUsername('user--name')).toBe(false);
  });

  it('rejects slash', () => {
    expect(isValidGithubUsername('user/name')).toBe(false);
  });

  it('rejects invalid characters', () => {
    expect(isValidGithubUsername('user name')).toBe(false);
    expect(isValidGithubUsername('user.name')).toBe(false);
    expect(isValidGithubUsername('user_name')).toBe(false);
  });
});

describe('isValidLinkedinUsername', () => {
  it('allows empty string (optional field)', () => {
    expect(isValidLinkedinUsername('')).toBe(true);
  });

  it('allows valid 5-30 char usernames', () => {
    expect(isValidLinkedinUsername('user1')).toBe(true);
    expect(isValidLinkedinUsername('user-name')).toBe(true);
    expect(isValidLinkedinUsername('user_name')).toBe(true);
    expect(isValidLinkedinUsername('a1234')).toBe(true);
    expect(isValidLinkedinUsername('a'.repeat(30))).toBe(true);
  });

  it('rejects less than 5 characters', () => {
    expect(isValidLinkedinUsername('user')).toBe(false);
    expect(isValidLinkedinUsername('ab')).toBe(false);
  });

  it('rejects more than 30 characters', () => {
    expect(isValidLinkedinUsername('a'.repeat(31))).toBe(false);
  });

  it('rejects starting with hyphen or underscore', () => {
    expect(isValidLinkedinUsername('-user1')).toBe(false);
    expect(isValidLinkedinUsername('_user1')).toBe(false);
  });

  it('rejects ending with hyphen or underscore', () => {
    expect(isValidLinkedinUsername('user1-')).toBe(false);
    expect(isValidLinkedinUsername('user1_')).toBe(false);
  });

  it('rejects invalid characters', () => {
    expect(isValidLinkedinUsername('user name')).toBe(false);
    expect(isValidLinkedinUsername('user.name')).toBe(false);
  });
});

describe('isValidEduEmail', () => {
  it('returns true for email ending with .edu', () => {
    expect(isValidEduEmail('user@school.edu')).toBe(true);
    expect(isValidEduEmail('a@b.edu')).toBe(true);
  });

  it('returns false for email not ending with .edu', () => {
    expect(isValidEduEmail('user@gmail.com')).toBe(false);
    expect(isValidEduEmail('user@school.edu.gov')).toBe(false);
    expect(isValidEduEmail('')).toBe(false);
  });
});
