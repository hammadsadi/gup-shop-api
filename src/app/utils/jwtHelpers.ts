import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const generateToken = (
  payload: string | object | Buffer,
  secret: Secret,
  expiresIn: number | string = "1d"
): string => {
  const token = jwt.sign(payload, secret, {
    algorithm: "HS256",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expiresIn: expiresIn as any,
  });

  return token;
};
const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelpers = {
  generateToken,
  verifyToken,
};
