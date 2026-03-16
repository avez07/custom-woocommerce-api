const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');

const ensureDir = () => {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
};

const logLine = (filePrefix, payload) => {
  ensureDir();
  const date = new Date();
  const fileName = `${filePrefix}-${date.toISOString().slice(0, 10)}.log`;
  const filePath = path.join(logDir, fileName);
  fs.appendFileSync(filePath, `${JSON.stringify(payload)}\n`);
};

const logRequest = (req, extra = {}) => {
  const payload = {
    ts: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    headers: {
      'content-type': req.headers['content-type'],
      authorization: req.headers['authorization'] || 'undefined',
    },
    body: req.body,
    ...extra,
  };
  logLine('request', payload);
};

module.exports = { logRequest };
