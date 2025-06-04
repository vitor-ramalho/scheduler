export interface UserRequest {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organizationId?: string;
}
