export interface IUserData {
  firstName: string;
  email: string;
  lastName: string;
  createdAt: string;
}

export interface IUserAuth {
  uid: string;
  email: string;
  refreshToken: string;
}

export interface IUser extends IUserData, IUserAuth {}

export interface IAuthState {
  user: IUser | null;
  loading: boolean;
  error: string | null;
}
