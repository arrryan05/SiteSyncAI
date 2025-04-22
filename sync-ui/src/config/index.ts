// src/config/apiRoutes.ts

const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
};

const BASE = getBaseUrl();

export const API_ROUTES = {
  // Auth
  SIGNUP: `${BASE}/api/auth/signup`,
  LOGIN: `${BASE}/api/auth/login`,
  GOOGLE_AUTH:`${BASE}/api/auth/google`,

  // Projects
  PROJECT_CREATE: `${BASE}/api/project/create`,
  PROJECT_LIST: `${BASE}/api/project/list`,
  PROJECT_DETAILS: (projectId: string) => `${BASE}/api/project/${projectId}`,
  PROJECT_DELETE: (id: string) => `${getBaseUrl()}/api/project/${id}`,
  PROJECT_STREAM:   (id: string) => `${getBaseUrl()}/api/projects/${id}/stream`,



  // Analysis
  ANALYZE: `${BASE}/api/analysis/analyze`,
  RERUN: (projectId: string) => `${BASE}/api/analysis/rerun?projectId=${projectId}`,



};
