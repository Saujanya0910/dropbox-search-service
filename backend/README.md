# Document Search Backend

A Node.js backend service that indexes and searches documents from Dropbox using Elasticsearch.

## Tech Stack

- **TypeScript**
- **Node.js**
- **Express**
- **Elasticsearch (Cloud)**
- **Dropbox API**
- **Node Cache**
- **Zod**
- **Socket.io**
- **dotenv**

## Project Structure

- `src/`: Contains the source code for the backend application.
  - `config/`: Configuration file for the application.
  - `controllers/`: Request handlers for the API routes.
  - `middleware/`: Custom middleware functions.
  - `routes/`: Express routes for the API.
  - `schemas/`: Zod schemas for request payload validation.
  - `services/`: Business logic for the application.
  - `index.ts`: Entry point for the backend application.
- `.env`: Environment variables file.
- `package.json`: Project metadata and dependencies.

## Setup

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Create a `.env` file in the `backend` directory with the following variables:

   ```env
   PORT=3000
   CORS=*

   ELASTICSEARCH_ID=<YOUR_ELASTICSEARCH_CLOUD_ID>
   ELASTICSEARCH_URL=<YOUR_ELASTICSEARCH_URL>
   ELASTICSEARCH_CLOUD_ID=<YOUR_ELASTICSEARCH_CLOUD_ID>
   ELASTICSEARCH_API_KEY_NAME=<YOUR_ELASTICSEARCH_API_KEY_NAME>
   ELASTICSEARCH_API_KEY=<YOUR_ELASTICSEARCH_API_KEY>
   ELASTICSEARCH_INDEX=<YOUR_ELASTICSEARCH_INDEX>
   ELASTICSEARCH_PIPELINE_NAME=<YOUR_ELASTICSEARCH_PIPELINE_NAME>
   ELASTICSEARCH_PIPELINE_INDEX=<YOUR_ELASTICSEARCH_PIPELINE_INDEX>

   DROPBOX_ACCESS_TOKEN=<YOUR_DROPBOX_ACCESS_TOKEN>
   DROPBOX_APP_KEY=<YOUR_DROPBOX_APP_KEY>
   DROPBOX_APP_SECRET=<YOUR_DROPBOX_APP_SECRET>
   DROPBOX_FOLDER_PATH=<YOUR_DROPBOX_FOLDER_PATH>

   INDEXING_INTERVAL_SECONDS=300000

   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100

   CACHE_TTL=3600
   ```

3. Start the development server:

   ```bash
   yarn dev
   ```

4. The backend application will be available at:

   [http://localhost:3000](http://localhost:3000)

## Scripts

- `yarn start`: Start the production server.
- `yarn dev`: Start the development server with nodemon.
- `yarn lint`: Run ESLint to lint the code.

## Additional Development Information
 - Fast-tracked development by using a monorepo structure
 - Fast-tracked development by using LLMs like Bolt.new, GPT-4o, Claude 3.5 Sonnet, Github Copilot, to name a few.

## Available Features
1. **Elasticsearch Integration**: Indexing and searching within indices in Elasticsearch.
2. **Dropbox Integration**: Fetching files & metadata from Dropbox and indexing them in Elasticsearch.
3. **Rate Limiting**: Rate limiting for API requests.
4. **Caching**: Caching for API responses.

## License

This project is open source and available under the [MIT License](../LICENSE).