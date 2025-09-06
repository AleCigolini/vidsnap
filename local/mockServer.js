// mockServer.js
import express from 'express';

const app = express();
const port = 3000;

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send a test notification every 5 seconds
    const interval = setInterval(() => {
        const mockData = {
            message: `Test notification ${new Date().toLocaleTimeString()}`
        };
        res.write(`data: ${JSON.stringify(mockData)}\n\n`);
    }, 5000);

    req.on('close', () => {
        clearInterval(interval);
    });
});

app.listen(port, () => {
    console.log(`Mock SSE server running at http://localhost:${port}`);
});