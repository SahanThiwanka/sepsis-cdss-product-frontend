export type User = {
  id: number;
  username: string;
  full_name: string | null;
  role: "admin" | "clinician" | "researcher";
  is_active: boolean;
  created_at: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
  user: User;
};

export type UserCreatePayload = {
  username: string;
  password: string;
  full_name?: string;
  role: "admin" | "clinician" | "researcher";
};