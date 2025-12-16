

import jwt from "jsonwebtoken";

export const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: "1d",
  });
};
