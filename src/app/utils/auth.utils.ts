import jwt, { JwtPayload, Secret } from "jsonwebtoken";

export const generateToken = (
  payload: { email: string; id: string; name: string },
  secret: Secret,
  expiresIn: any
) => {
  return jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};
