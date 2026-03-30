const AGRICOL_API_URL = process.env.AGRICOL_API_URL || "http://localhost:3000";
const AGRICOL_API_TOKEN = process.env.AGRICOL_API_TOKEN || "";

const buildHeaders = () => {
  const headers = {
    "Content-Type": "application/json"
  };
  if (AGRICOL_API_TOKEN) {
    headers.Authorization = `Bearer ${AGRICOL_API_TOKEN}`;
  }
  return headers;
};

const getJson = async (path) => {
  const response = await fetch(`${AGRICOL_API_URL}${path}`, {
    method: "GET",
    headers: buildHeaders()
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed request ${path}: ${response.status} ${body}`);
  }
  return response.json();
};

const fetchProduccionByDate = async (date) => {
  const [performance, frituraLotes] = await Promise.all([
    getJson(`/data/produccion/performance/${date}`),
    getJson(`/data/lotes-fritura/obtener`)
  ]);

  return {
    performance,
    frituraLotes
  };
};

export { fetchProduccionByDate };
