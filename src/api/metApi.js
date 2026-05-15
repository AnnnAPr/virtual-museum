const API_BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1';

const endpoint_search = `${API_BASE_URL}/search`;
const endpoint_objects = `${API_BASE_URL}/objects`;
const endpoint_departments = `${API_BASE_URL}/departments`;

export async function searchArtworks(query) {
  const res = await fetch(`${endpoint_search}?hasImages=true&q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(`Search request failed with status ${res.status}`);
  return res.json();
}

export async function fetchObject(id) {
  const res = await fetch(`${endpoint_objects}/${id}`);
  if (!res.ok) throw new Error(`Object ${id} responded with ${res.status}`);
  return res.json();
}

export async function searchByDepartment(departmentId) {
  const res = await fetch(`${endpoint_search}?departmentId=${departmentId}&hasImages=true&q=art`);
  if (!res.ok) throw new Error(`Department search failed with status ${res.status}`);
  return res.json();
}

export async function fetchDepartments() {
  const res = await fetch(endpoint_departments);
  if (!res.ok) throw new Error(`Departments request failed with status ${res.status}`);
  return res.json();
}
