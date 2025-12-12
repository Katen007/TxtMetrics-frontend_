
const isTauri = import.meta.env.VITE_TARGET === 'tauri';
const BACKEND_IP = 'http://192.168.1.36:8080';
const MINIO_IP = 'http://192.168.1.36:9000';

export const API_BASE = isTauri ? `${BACKEND_IP}/api` : '/api';
export const IMAGE_BASE = isTauri ? `${MINIO_IP}/texts` : '';
