import serverless from 'serverless-http';
import app from '../../api/index.js';

// Netlify redirects /api/* → /.netlify/functions/api/*
// serverless-http receives the full path. We need Express to see /api/...
// The request arrives as /.netlify/functions/api/auth/google
// We need to rewrite it to /api/auth/google for Express route matching
const handler = async (event, context) => {
  // Rewrite the path: strip /.netlify/functions/api and prepend /api
  if (event.path && event.path.startsWith('/.netlify/functions/api')) {
    event.path = '/api' + event.path.replace('/.netlify/functions/api', '');
  }
  // Also fix rawUrl if present
  if (event.rawUrl) {
    event.rawUrl = event.rawUrl.replace('/.netlify/functions/api', '/api');
  }
  
  const serverlessHandler = serverless(app);
  return serverlessHandler(event, context);
};

export { handler };
