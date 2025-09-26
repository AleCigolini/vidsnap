// mockServer.js
import express from 'express';

const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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

// Add this to local/mockServer.js

app.get('/api/v1/videos', (req, res) => {
  // Mocked video list response
  const videoList = [
    {
      id: 1,
      originalFileName: 'example.mp4',
      status: 'PROCESSED',
      fileSize: 1048576,
      downloadUrl: 'https://localhost:3000/videos/example.mp4',
      uploadedAt: '2024-06-10T12:00:00Z',
      processedAt: '2024-06-10T12:30:00Z'
    }
    // Add more items as needed
  ];
  res.json(videoList);
});

app.post('/api/v1/videos/upload', (req, res) => {
  // Mock upload response
  res.json({success: true, message: 'Video(s) uploaded successfully.'});
});

app.post('/usuario/identificacao', (req, res) => {
  const {login, senha} = req.body

  // Simple mock validation (always succeeds)
  if (login && senha) {
    res.setHeader('Authorization', 'Bearer fake-jwt-token')
    res.json({login})
  } else {
    res.status(401).json({message: 'Invalid credentials'})
  }
})


app.listen(port, () => {
  console.log(`Mock SSE server running at http://localhost:${port}`);
});