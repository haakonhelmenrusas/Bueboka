import { User } from "./User";

export type UserContextState = {
  user: User;
  updateUser: (user: User) => void;
};
