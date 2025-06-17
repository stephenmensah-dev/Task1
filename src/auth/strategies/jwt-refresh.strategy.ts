import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from 'express'
import { TokenPayload } from "../token-payload.interface";
import { AuthService } from "../auth.service";


@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
){
    constructor(configService: ConfigService, private readonly authService: AuthService){
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request ) => request?.cookies?.['Refresh'] 
            ]),
            secretOrKey: configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
            passReqToCallback: true,
        })
        
    }

    async validate(request: Request, payload: TokenPayload) {
        console.log('validating refresh from strategy')
        console.log('Payload from refresh strategy:', payload);
        console.log('Refresh Cookie:', request.cookies?.Refresh)

        return this.authService.verifyUserRefreshToken(request.cookies?.Refresh, payload.email)
    }
}