import app from './app.ts';
import config from './config/config.ts';

// Start the server
app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
});