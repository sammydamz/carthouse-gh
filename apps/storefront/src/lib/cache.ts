import { LRUCache } from 'lru-cache'

const productsCache = new LRUCache<string, object>({
  max: 200,
  ttl: 1000 * 60 * 5,
})

const categoriesCache = new LRUCache<string, object>({
  max: 50,
  ttl: 1000 * 60 * 60,
})

const productDetailCache = new LRUCache<string, object>({
  max: 500,
  ttl: 1000 * 60 * 5,
})

export function bustProducts() {
  productsCache.clear()
  productDetailCache.clear()
}

export function bustCategories() {
  categoriesCache.clear()
}

export function bustAll() {
  productsCache.clear()
  categoriesCache.clear()
  productDetailCache.clear()
}

export function getProductsCache() {
  return productsCache
}

export function getCategoriesCache() {
  return categoriesCache
}

export function getProductDetailCache() {
  return productDetailCache
}