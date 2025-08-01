export type UserRole = "admin-seller" | "seller" | "supplier" | "customer";

export interface IUser {
  _id?: string;
  username?: string;
  role: UserRole;
  email: string;
  password: string;
}
