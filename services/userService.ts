import api from './api';
import { CreateUserPayload, LoginPayload, LoginResponse, User } from '@/types/user';

export async function login(body:LoginPayload) {
  const response = await api.post<LoginResponse>(`/user/login`,body);

  return response.data;
}

export async function register(body:CreateUserPayload) {
  const response = await api.post<User>(`/user`,body);

  return response.data;
}
