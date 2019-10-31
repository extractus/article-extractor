// utils -> store

import LRU from 'lru-cache';

export const extractedCache = new LRU({
  max: 1000,
  maxAge: 20 * 6e4,
});

export const contentLoadedCache = new LRU({
  max: 500,
  maxAge: 3 * 24 * 60 * 6e4,
});
