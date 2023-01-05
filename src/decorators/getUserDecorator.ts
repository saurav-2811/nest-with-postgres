import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as JWT_Helper from '../utils/helper/jwt.helper'

export const GetUser = createParamDecorator(
  async (data: {email: string,id:string}, context: ExecutionContext) => {
    let decoded:{email: string,id:string} = await JWT_Helper.checkJWTToken(context);
    data = decoded;
    return data;
  }
);