import { ExecutionContext } from "@nestjs/common";

export async function getRequestFromExecution(context: ExecutionContext){
    let  requestExe;
    if (context.getType() === "http") {
      requestExe = context.switchToHttp().getRequest();
    } 
    return requestExe;
}