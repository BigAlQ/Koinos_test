# Backend

## 1. Refactor blocking I/O

Use asynchronous file operations to prevent blocking the event loop in a Node.js Express application.
Trade-off: Slightly more verbose code due to async/await, but prevents blocking the Node.js event loop, improving scalability.

## 2. Performance improvements

Cached results for GET /api/stats instead of recalculating on every request. Also introduced a file watcher to invalidate cache if underlying data changes.

Trade-off: Slight increase in memory usage for cache storage, but reduces repeated computation and improves response time for frequent requests.

## 3. Testing

Implemented unit tests for route handlers using Jest and Supertest.

# Frontend

## 1. Memory leak prevention

Used a cleanup flag in useEffect to prevent state updates on unmounted components.

Trade-off: Slightly more complex effect logic, but prevents potential runtime warnings and memory leaks.

## 2. Pagination & Search

Implemented server-side search using q parameter and paginated API calls.

Frontend fetches only the current page of items.

Trade-off: Slight increase in backend logic complexity, but improves frontend performance for large datasets.

## 3. Virtualized list

Integrated react-window to render only visible items in the list.

Trade-off: Virtualization adds a small layer of abstraction, but significantly improves rendering performance for long lists.

## 4. UI/UX improvements

Added skeleton loading states while fetching items.

Ensured accessibility with aria-busy and semantic HTML.

Trade-off: Minor additional styling work, but enhances user experience and accessibility.
