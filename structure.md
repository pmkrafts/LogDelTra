https://blog.logrocket.com/express-typescript-node/

ts-node-express/
├── src/
│   ├── config/
│   │   └── config.ts        // Load and type environment variables
│   ├── controllers/
│   │   └── itemController.ts  // CRUD logic for "items"
│   ├── middlewares/
│   │   └── errorHandler.ts    // Global typed error handling middleware
│   ├── models/
│   │   └── item.ts          // Define item type and in-memory storage
│   ├── routes/
│   │   └── itemRoutes.ts    // Express routes for items
│   ├── app.ts               // Express app configuration (middlewares, routes)
│   └── server.ts            // Start the server
├── .env                     // Environment variables
├── package.json             // Project scripts, dependencies, etc.
├── tsconfig.json            // TypeScript configuration
├── .eslintrc.js             // ESLint configuration
└── .prettierrc              // Prettier configuration