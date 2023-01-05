
import { ExecutionContext } from "@nestjs/common";

import * as jwt from "jsonwebtoken";
import { User } from "src/modules/users/entities/user.entity";
import { getRequestFromExecution } from "./getRequestFromExecution";

export async function generateAccessToken(user: User): Promise<string> {
  return await jwt.sign(
    {id: user.id,email: user?.email},
    process.env.JWT_ACCESS_TOKEN_SECRET,
    { expiresIn: "30d"}
  );
}

export async function generateRefreshToken(user) {
  return await jwt.sign({id: user.id,email: user?.email},
    process.env.JWT_REFRESH_TOKEN_SECRET,
    { expiresIn: "365d" }
  );
}

export async function decodeJwtToken(token): Promise<Object | any> {
  return await jwt.decode(token, { complete: true });
}
export async function verifyJwtToken(token) {
  return await jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
}
export async function verifyRefreshToken(token) {
  return await jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET);
}

export async function generateResetPasswordToken(user): Promise<any> {
  return await jwt.sign({id: user._id},
    process.env.JWT_RESET_TOKEN_SECRET,
    { expiresIn: "900s" }
  );
}

export async function verifyResetPasswordToken(token): Promise<any> {
  return await jwt.verify(token, process.env.JWT_RESET_TOKEN_SECRET);
}
export async function checkJWTToken(context: ExecutionContext) {
  try {
    let token, decoded, auth, requests;
    requests = await getRequestFromExecution(context);
    auth = requests.headers.authorization;
    if (!auth) return false;
    token = auth.split(" ")[1];
    decoded = await this.verifyJwtToken(token);
    return decoded;
  } catch (error) {
    
    return false;
  }
}
