# Copilot Instructions for SocialPost (MEAN Stack)

## Project Overview
- **SocialPost** is a full-stack social media app using Angular (frontend) and Node.js/Express/MongoDB (backend).
- The backend is in `backend/` (Express, Mongoose models, REST API routes).
- The frontend is in `src/` (Angular standalone components, services, and modules).
- User authentication is JWT-based; posts are associated with users via a `creator` field.

## Key Architectural Patterns
- **Angular Standalone Components**: Most UI logic is in standalone components (see `src/app/`).
- **Services for Data/State**: Data flows through Angular services (e.g., `posts.service.ts`, `auth.service.ts`).
- **Backend API**: RESTful endpoints in `backend/routes/` (e.g., `posts.js`, `user.js`).
- **Auth Middleware**: `backend/middleware/check-auth.js` protects routes and injects `req.userData`.
- **MongoDB Models**: Defined in `backend/models/` (e.g., `posts.js`, `user.js`).

## Developer Workflows
- **Frontend**: Use `ng serve` to run the Angular app (`http://localhost:4200/`).
- **Backend**: Start the server with `node backend/app.js` (or use `nodemon` for auto-reload).
- **Testing**: Run `ng test` for Angular unit tests. No backend test scripts are present by default.
- **Build**: Use `ng build` for production builds.

## Project-Specific Conventions
- **Post Model**: Always include `creator` (user id) in posts. See `src/app/model/post.model.ts` and `backend/models/posts.js`.
- **API Responses**: Most endpoints return objects with a `message` and a data payload (e.g., `{ message, post }`).
- **Pagination**: Posts API supports `?pagesize` and `?page` query params.
- **Local Storage**: Posts are cached in localStorage on the frontend for quick reloads.
- **Subscriptions**: Angular services use RxJS Subjects to notify components of data changes. Always unsubscribe in `ngOnDestroy`.
- **Image Uploads**: Handled via `multer` in the backend; images are stored in `backend/images/`.

## Integration Points
- **Frontend/Backend Communication**: All API calls use `http://localhost:3000/api/` as the base URL.
- **JWT Auth**: The frontend stores the token and sends it in the `Authorization` header. The backend validates and decodes it for protected routes.
- **User Actions**: Only authenticated users can create, update, or delete posts. The `creator` field is set server-side.

## Examples
- **Adding a Post**: See `PostsService.addPost()` and `backend/routes/posts.js` POST handler.
- **Protecting a Route**: See `check-auth.js` middleware and how it's used in `posts.js` routes.
- **Paginated Fetch**: See `PostsService.getPosts()` and the corresponding backend GET handler.

## File/Directory References
- `src/app/services/posts.service.ts` — Angular service for posts
- `src/app/model/post.model.ts` — Post interface
- `backend/routes/posts.js` — Express routes for posts
- `backend/models/posts.js` — Mongoose post schema
- `backend/middleware/check-auth.js` — JWT auth middleware

---

For new features, follow the established patterns for services, models, and API integration. When in doubt, check the referenced files for examples.
