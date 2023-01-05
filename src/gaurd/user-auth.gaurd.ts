import * as JWT_Helper from '../utils/helper/jwt.helper';

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";



@Injectable()
export class UserAuthGuard implements CanActivate {
      async canActivate(context: ExecutionContext): Promise<boolean> {
            let decoded = await JWT_Helper.checkJWTToken(context);
            if (decoded) {
                  return true;
            } else {
                  throw new UnauthorizedException("Not authorised to access this route")
            }
      }

}