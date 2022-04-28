import { IUser } from "./IUser";

export type UserContextState = {
  user: IUser;
  updateUser: (user: IUser) => void;
};
