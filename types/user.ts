export interface User {
  id: number;
  name: string;
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
    access_token: string;
    token_type: string;
}