# Profil SMKN 4 - Backend

This is the backend for the SMKN 4 school profile website. It is built with Node.js, Express, and Prisma.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

  * Node.js (v18.18 or later)
  * npm
  * PostgreSQL

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/yawpie/profilsmkn4-backend.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Set up your environment variables by creating a `.env` file in the root directory. You can use the `.env.example` as a template.
    ```
    DATABASE_URL="postgresql://<user>:<password>@<host>:<port>/<database>"
    JWT_SECRET="your-secret-key"
    ```
4.  Apply database migrations
    ```sh
    npx prisma migrate dev
    ```

### Running the Application

  * **Development**
    ```sh
    npm run dev
    ```
  * **Production**
    ```sh
    npm run build
    npm start
    ```

## API Endpoints

The following are the available API endpoints:

### Authentication

  * `POST /api/login`: Authenticate a user and receive a JWT token.
  * `POST /api/register`: Register a new admin user.

### Articles

  * `GET /api/articles`: Get a paginated list of articles.
  * `GET /api/articles?title=<article_title>`: Get a specific article by title.
  * `POST /api/articles`: Add a new article. Requires authentication.
  * `PUT /api/articles/:id`: Update an existing article. Requires authentication.
  * `DELETE /api/articles/:id`: Delete an article. Requires authentication.

### Categories

  * `POST /api/category`: Add a new category. Requires authentication.

### Teachers

  * `GET /api/teacher`: Get a paginated list of teachers.
  * `GET /api/teacher?nama=<teacher_name>`: Get a specific teacher by name.
  * `POST /api/teacher`: Add a new teacher. Requires authentication.
  * `PUT /api/teacher/:id`: Update an existing teacher. Requires authentication.
  * `DELETE /api/teacher/:id`: Delete a teacher. Requires authentication.

## Technologies Used

  * **Node.js**: JavaScript runtime environment
  * **Express**: Web framework for Node.js
  * **Prisma**: Next-generation ORM for Node.js and TypeScript
  * **PostgreSQL**: Object-relational database system
  * **Firebase Storage**: For image uploads
  * **jsonwebtoken**: For generating and verifying JSON Web Tokens
  * **bcrypt**: For password hashing
  * **multer**: Middleware for handling `multipart/form-data`
  * **TypeScript**: Typed superset of JavaScript
