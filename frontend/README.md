# Document Search Frontend

A React-based frontend application for searching and filtering documents indexed from Dropbox.

## Technologies Used

- **React**
- **TypeScript**
- **Vite**
- **React Query**
- **Tailwind CSS**
- **Axios**
- **Lucide React for icons**

## Project Structure

- `src/`: Contains the source code for the React application.
  - `components/`: Reusable UI components.
  - `constants/`: Constants used in the application.
  - `services/`: API services for fetching data.
  - `types/`: TypeScript types and interfaces.
  - `index.css`: Main CSS file.
  - `main.tsx`: Entry point for the React application.
- `public/`: Static assets.
- `vite.config.ts`: Vite configuration file.
- `tsconfig.json`: TypeScript configuration file.
- `package.json`: Project metadata and dependencies.

## Setup

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Start the development server:

   ```bash
   yarn dev
   ```

3. Open the application in your browser:

   [http://localhost:3000](http://localhost:3000)

## Scripts

- `yarn dev`: Start the development server.
- `yarn build`: Build the application for production.
- `yarn lint`: Run ESLint to lint the code.
- `yarn preview`: Preview the production build.

## Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

```
VITE_API_URL=<YOUR-BACKEND-DOMAIN>
```

## Additional Development Information
 - Fast-tracked development by using a monorepo structure
 - Fast-tracked development by using LLMs like GPT-4o, Claude 3.5 Sonnet, Github Copilot, to name a few.

## Available Features
1. Search documents by name & their content.
2. Filter documents by type, size, and date.
3. View document details.
4. Download documents.

## License

This project is open source and available under the [MIT License](../LICENSE).