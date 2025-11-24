# SMKN4 Profile API Documentation

Base URL: `/` (mounted routers below). All responses use a consistent JSON envelope produced by `sendData` / `sendError`.

## Authentication

Auth uses HTTP only cookies for `access_token` (short lived, 15m) and `refresh_token` (longer lived). Secure + SameSite set in production. Protected routes require valid cookies (`checkAccessWithCookie`).

### Endpoints

| Method | Path        | Auth           | Body                     | Description                                                  |
| ------ | ----------- | -------------- | ------------------------ | ------------------------------------------------------------ |
| POST   | `/login`    | No             | `{ username, password }` | Login, sets refresh & access cookies, returns `access_token` |
| POST   | `/register` | No             | `{ username, password }` | Create new admin (hashing via middleware)                    |
| POST   | `/refresh`  | Refresh cookie | (none)                   | Issue new access & refresh cookies                           |
| POST   | `/logout`   | Access cookie  | (none)                   | Clear auth cookies                                           |

## Categories

Mounted at: `/category`

| Method | Path         | Auth          | Body                | Description                     |
| ------ | ------------ | ------------- | ------------------- | ------------------------------- |
| POST   | `/category/` | Access cookie | `{ category_name }` | Create a category (unique name) |

## Articles

Mounted at: `/articles`

Shared middlewares: creation/update/delete require `checkAccessWithCookie`; image upload uses `upload.single("image")`.

| Method | Path            | Auth          | Body / Query                                                                | Description                                           |
| ------ | --------------- | ------------- | --------------------------------------------------------------------------- | ----------------------------------------------------- |
| GET    | `/articles/`    | Public        | `?title=abc` optional, `?page`, `?limit`                                    | List articles (paginated) or search by partial title  |
| POST   | `/articles/`    | Access cookie | `multipart/form-data`: `title`, `content`, `category_id`, `status`, `image` | Create article (slug auto from title, image optional) |
| PUT    | `/articles/:id` | Access cookie | `multipart/form-data`: `title?`, `content?`, `category_id?`, `image?`       | Update article & optionally replace image             |
| DELETE | `/articles/:id` | Access cookie | (none)                                                                      | Delete article and its image                          |

## Teachers

Mounted at: `/teacher`

| Method | Path           | Auth          | Body / Query                                               | Description                               |
| ------ | -------------- | ------------- | ---------------------------------------------------------- | ----------------------------------------- |
| GET    | `/teacher/`    | Public        | `?nama=partial`, `?page`, `?limit`                         | List teachers or search by name           |
| POST   | `/teacher/`    | Access cookie | `multipart/form-data`: `name`, `jabatan`, `nip?`, `image?` | Create teacher                            |
| PUT    | `/teacher/:id` | Access cookie | `multipart/form-data`: `name?`, `jabatan?`, `image?`       | Update teacher, replace image if provided |
| DELETE | `/teacher/:id` | Access cookie | (none)                                                     | Delete teacher and image                  |

## Facilities

Mounted at: `/facilities`

| Method | Path              | Auth          | Body / Query                                                                     | Description                       |
| ------ | ----------------- | ------------- | -------------------------------------------------------------------------------- | --------------------------------- |
| GET    | `/facilities/`    | Public        | `?name=partial`, `?page`, `?limit`                                               | List facilities or search by name |
| POST   | `/facilities/`    | Access cookie | `multipart/form-data`: `name`, `description?`, `location?`, `status`, `image?`   | Create facility                   |
| PUT    | `/facilities/:id` | Access cookie | `multipart/form-data`: `name?`, `description?`, `location?`, `status?`, `image?` | Update facility                   |
| DELETE | `/facilities/:id` | Access cookie | (none)                                                                           | Delete facility and image         |

## Extracurriculars

Mounted at: `/extracurriculars`

| Method | Path                    | Auth          | Body / Query                                             | Description                     |
| ------ | ----------------------- | ------------- | -------------------------------------------------------- | ------------------------------- |
| GET    | `/extracurriculars/`    | Access cookie | `?name=partial`, `?page`, `?limit`                       | List extracurriculars or search |
| POST   | `/extracurriculars/`    | Access cookie | `multipart/form-data`: `name`, `description?`, `image?`  | Create extracurricular          |
| PUT    | `/extracurriculars/:id` | Access cookie | `multipart/form-data`: `name?`, `description?`, `image?` | Update extracurricular          |
| DELETE | `/extracurriculars/:id` | Access cookie | (none)                                                   | Delete extracurricular & image  |

## Common Query Parameters

| Name                      | Type        | Description                                         |
| ------------------------- | ----------- | --------------------------------------------------- |
| `page`                    | integer >=1 | Page number for pagination                          |
| `limit`                   | integer >0  | Items per page                                      |
| `title` / `nama` / `name` | string      | Partial case-insensitive search (resource-specific) |

## Pagination Response Shape

When listing resources with pagination, `sendData` wraps object containing:

```
{
	data: [ ...items ],
	pagination: {
		total: number,
		totalPages: number,
		currentPage: number,
		perPage: number
	}
}
```

## Errors

Errors use `sendError` and may emit structured messages with HTTP codes mapped from custom error classes:
| Error Class | Typical Status | Notes |
|-------------|----------------|-------|
| `BadRequestError` | 400 | Missing/invalid input |
| `UnauthorizedError` | 401 | Auth failures (register/login preconditions) |
| `NotFoundError` | 404 | Missing entity |
| `UnexpectedError` | 500 | Unhandled internal issues |

## Authentication Details

On successful login/refresh: cookies set
| Cookie | Purpose | HttpOnly | Secure(prod) | SameSite |
|--------|---------|----------|--------------|----------|
| `access_token` | Short lived access (15m) | Yes | Yes | lax |
| `refresh_token` | Issue new tokens | Yes | Yes | lax |

Clients must send cookies on protected endpoints. Refresh flow: call `/refresh` before expiry to obtain new tokens.

## File Uploads

Image uploads use `multipart/form-data` via field name `image`. Stored through image service helper (`uploadImage`) returning a URL persisted as `image_url`.

## Slugs

Articles slug is auto-generated from lowercased title replacing spaces with `-`.

## Status Fields

Articles include `status` (enum). Facilities include `status` (availability). Announcements also have `status`. Provide valid enum values below.

### Enums

`status` (used by `articles`, `announcements`):

- `DRAFT`
- `PUBLISHED`

`status_facilities` (used by `facilities`):

- `TERSEDIA` (available)
- `PERBAIKAN` (under maintenance)
- `DIGUNAKAN` (in use)

Include one of these values in form-data field `status` when creating/updating.

### Example Article Create (multipart/form-data)

Fields:

- `title`: string
- `content`: string
- `category_id`: UUID (optional if nullable)
- `status`: `DRAFT` | `PUBLISHED`
- `image`: file (optional)

### Example Facility Create (multipart/form-data)

Fields:

- `name`: string (required)
- `description`: string (optional)
- `location`: string (optional)
- `status`: `TERSEDIA` | `PERBAIKAN` | `DIGUNAKAN`
- `image`: file (optional)

### Example Extracurricular Create

Fields:

- `name`: string (required)
- `description`: string (optional)
- `image`: file (optional)

### Example Teacher Create

Fields:

- `name`: string (required)
- `jabatan`: string (required)
- `nip`: string (optional)
- `image`: file (optional)

### Example Login Request (JSON)

```
POST /login
Content-Type: application/json
{
	"username": "admin1",
	"password": "SecretPassword123"
}
```

### Example Login Success Response

Cookies set (`access_token`, `refresh_token`); body:

```
{
	"message": "success",
	"access_token": "<JWT>"
}
```

### Example Paginated Articles Response

```
{
	"data": [
		{
			"articles_id": "uuid",
			"title": "My First Post",
			"content": "...",
			"image_url": "https://.../img.png",
			"published_date": "2025-11-24T07:15:30.000Z",
			"admin": { "username": "admin1" },
			"category": { "name": "News" }
		}
	],
	"pagination": {
		"total": 42,
		"totalPages": 5,
		"currentPage": 1,
		"perPage": 10
	}
}
```

### Example Error Response

```
{
	"error": {
		"message": "Category name is required",
		"type": "BadRequestError"
	}
}
```

## Notes & Conventions

- All create/update endpoints return the created/updated record.
- Delete endpoints generally return a success envelope (sometimes the deleted record) via `sendData`.
- Searching is case-insensitive and substring-based using Prisma `contains` with `mode: "insensitive"`.
- Pagination uses helper `paginate(skip,take)` pattern across resources.

## OpenAPI Specification

A machine-readable OpenAPI 3.0 spec is available in `docs-openapi.yaml`. Import it into Swagger UI / Postman for interactive exploration.

To regenerate manually: keep paths in sync with this document and update schemas if the Prisma models change.

## Health / Root

GET `/` returns generic success via `sendData(res)`.

---

Last generated: 2025-11-24
