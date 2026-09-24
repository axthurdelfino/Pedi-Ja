import { request } from "../lib/http";
import type { User } from "../types";

export const userService = {
  findAll: () => request<User[]>("/usuarios"),
};
