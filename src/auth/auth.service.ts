import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcrypt'
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from 'src/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './token-payload.interface';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt'
import { LoginHistoryService } from 'src/login-history/login-history.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly loginHistoryService: LoginHistoryService
    ){}

    async login(user:User, response:Response){
        const expiresAccessToken = new Date()
        expiresAccessToken.setMilliseconds(
            expiresAccessToken.getTime() + 
            parseInt(
                this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_EXPIRATION_MS')
            )
        )

        const expiresRefreshToken = new Date()
        expiresRefreshToken.setMilliseconds(
            expiresRefreshToken.getTime() + 
            parseInt(
                this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_EXPIRATION_MS')
            )
        )

        const tokenPayload: TokenPayload = {
            email: user.email
        }

        const accessToken = this.jwtService.sign(tokenPayload, {
            secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
            expiresIn: `${this.configService.getOrThrow(
                'JWT_ACCESS_TOKEN_EXPIRATION_MS',
            )}ms`
        })

        const refreshToken = this.jwtService.sign(tokenPayload,{
            secret: this.configService.getOrThrow('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: `${this.configService.getOrThrow(
                'JWT_ACCESS_TOKEN_EXPIRATION_MS',
            )}ms`
        })

        await this.userService.update(user.id, {
            refreshToken: await bcrypt.hash(refreshToken, 10)
        })

        response.cookie('Authentication', accessToken, {
            httpOnly: true,
            secure: this.configService.get('NODE_ENV') === 'production',
            expires: expiresAccessToken
        })

        console.log('Access Token Set & Signed')

        response.cookie('Refresh', refreshToken, {
            httpOnly: true,
            secure: this.configService.get('NODE_ENV') === 'production',
            expires: expiresRefreshToken
        })

        console.log('Refresh Token Set & Signed')

        await this.loginHistoryService.record(user, 'LOGIN')


        console.log('User Logged In \n')
    }

   

    async verifyUser(email: string, password:string){
        try{
            const user =  await this.userService.findByEmail(email)
            const authenticated = await compare(password, user.password)
            if(!authenticated){
                throw new UnauthorizedException()
            }
            console.log('User Verified - ', user)
            return user
        }catch(error){
            throw new UnauthorizedException('Credentials not valid')
        }
    }

    async verifyUserRefreshToken (refreshToken: string, email: string){
        try {
            const user = await this.userService.findByEmail(email)

            if (!user.refreshToken) {
                throw new UnauthorizedException('No Stored Refresh Token')
            }

            const authenticated = await compare(refreshToken, user.refreshToken)

            if(!authenticated){
                throw new UnauthorizedException()
            }

            console.log('Refresh Token Authenticated')

            await this.loginHistoryService.record(user, 'REFRESH')
            return user
        } catch (error) {
            throw new UnauthorizedException('Refresh Token Is Not Valid')
        }
    }

    async logout(user: User, response: Response){
        await this.userService.update(user.id, { refreshToken: '' })

        response.clearCookie('Authentication')
        response.clearCookie('Refresh')

        await this.loginHistoryService.record(user, 'LOGOUT')

        console.log('Cookies Cleared - User Logged Out \n')
    }




    //LOGIN SERVICE W/O REFRESH TOKEN

    // async login(user:User, response:Response){
    //     const expiresAccessToken = new Date()
    //     expiresAccessToken.setMilliseconds(
    //         expiresAccessToken.getTime() + 
    //         parseInt(
    //             this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_EXPIRATION_MS')
    //         )
    //     )

    //     const tokenPayload: TokenPayload = {
    //         userId: user.id
    //     }

    //     const accessToken = this.jwtService.sign(tokenPayload, {
    //         secret: this.configService.getOrThrow('JWT_ACCESS_TOKEN_SECRET'),
    //         expiresIn: `${this.configService.getOrThrow(
    //             'JWT_ACCESS_TOKEN_EXPIRATION_MS',
    //         )}ms`
    //     })

    //     console.log('Access Token Set & Signed')

    //     response.cookie('Authentication', accessToken, {
    //         httpOnly: true,
    //         secure: this.configService.get('NODE_ENV') === 'production',
    //         expires: expiresAccessToken
    //     })

    //     console.log('Cookie Set, User Logged In \n')
    // }
      
}
