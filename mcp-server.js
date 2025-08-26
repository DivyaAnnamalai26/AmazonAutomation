// MCP Server for Playwright Automation
// This is a basic Express server acting as a Model Context Protocol (MCP) endpoint for triggering Playwright tests via HTTP.

const express = require('express');
const { exec } = require('child_process');

const app = express();
app.use(express.json());

app.post('/run-test', (req, res) => {
  const testName = req.body.test || '';
  const command = testName ? `npx playwright test ${testName}` : 'npx playwright test';
  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message, stderr });
    }
    res.json({ stdout });
  });
});

app.get('/', (req, res) => {
  res.send('MCP Server for Playwright Automation is running.');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`MCP Server listening on port ${PORT}`);
});
