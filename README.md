# Document Search Service

A full-stack TypeScript application that provides powerful document search capabilities by indexing files from Dropbox using Elasticsearch.

## Tech Stack

### Frontend

- **React**
- **TypeScript**
- **Vite**
- **React Query**
- **Tailwind CSS**
- **Axios**
- **Lucide React for icons**

### Backend

- **TypeScript**
- **Node.js**
- **Express**
- **Elasticsearch (Cloud)**
- **Dropbox API**
- **Node Cache**
- **Zod**
- **Socket.io**
- **dotenv**

## Architecture Overview
[View full diagram](https://www.tldraw.com/ro/artnZgF6xhgra_V4H97ih?d=v136.-145.1620.818.zgTumpajI-KW58oLgCsux)

## Project Structure

### Frontend

- `root/`
  - `frontend/`: Contains the React frontend application.
  - `backend/`: Contains the Node.js backend application.

  Check the `README.md` file in each directory for more information about the respective projects.

## Setup

1. Install dependencies:

    Either install dependencies for both frontend and backend applications separately or run the following command to install dependencies for both applications at once:

    a. Install dependencies for both frontend and backend applications at once:

    Frontend:
    ```bash
    yarn frontend:setup
    ```
    Backend:
    ```bash
    yarn backend:setup
    ```

    OR

    b. Install dependencies for frontend and backend applications separately:

    Frontend:
    ```bash
    cd frontend
    ```

    ```bash
    yarn install
    ```

    Backend:
    ```bash
    cd backend
    ```

    ```bash
    yarn install
    ```

2. Start the frontend and backend applications development servers respectively:

    If at the root directory:

    ```bash
    yarn frontend:dev
    ```

    ```bash
    yarn backend:dev
    ```

    Else:

    Frontend:
    ```bash
    cd frontend
    yarn dev
    ```

    Backend:
    ```bash
    cd backend
    yarn dev
    ```

3. Open the frontend application in your browser:
  
    [http://localhost:5176](http://localhost:5176)

4. Open the backend application in your browser:
  
    [http://localhost:3000](http://localhost:3000)

## Additional Development Information
 - Fast-tracked development by using a monorepo structure
 - Fast-tracked development by using LLMs like Bolt.new, GPT-4o, Claude 3.5 Sonnet, Github Copilot, to name a few.
