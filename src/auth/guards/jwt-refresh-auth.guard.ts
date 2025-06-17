import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtRefreshAuthGuard extends AuthGuard('jwt-refresh'){
    constructor() {
        super();
      }
}

 export default JwtRefreshAuthGuard // default - auth doesnt work because of module extended
