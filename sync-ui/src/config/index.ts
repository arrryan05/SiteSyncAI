const getBaseUrl = () => {
    return process.env.BACKEND_URL || 'http://localhost:8080';
  };
  
  export const API_ROUTES = {
    ANALYZE: `${getBaseUrl()}/api/analysis/analyze`,
  };
  