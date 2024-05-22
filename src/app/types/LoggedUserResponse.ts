import { User } from './User';

export type LoggedUserResponse = {
  data: User;
  token: string;
};
