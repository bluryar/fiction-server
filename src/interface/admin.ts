export interface IAdmin {
  id: number;
  username: string;
  password: string;
  priority: number;
  loginIp: string;
  created_at: Date;
  updated_at: Date;
}
