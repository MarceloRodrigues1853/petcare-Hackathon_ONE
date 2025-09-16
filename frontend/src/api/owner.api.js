// frontend/src/api/owner.api.js
import { get, del, put } from './http.js';

export function listOwners(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return get(`/admin/owners${qs ? `?${qs}` : ''}`);
}

export function deleteOwner(id) {
  return del(`/admin/owners/${id}`);
}

export function getOwnerById(id) {
  return get(`/owners/${id}`);
}

export function updateOwner(id, payload) {
  return put(`/owners/${id}`, payload);
}
