import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/auth')
  getToken(): object {
    try {
      return this.appService.getToken();
    } catch (e) {
      throw new HttpException(
        `Something went wrong: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @HttpCode(200)
  @Post('/create/:type')
  create(
    @Param('type') type: string,
    @Body() body: [string, string, object],
  ): Promise<number> {
    try {
      return this.appService.create(type, ...body);
    } catch (e) {
      throw new HttpException(
        `Something went wrong: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('/get/:type/:id')
  get(
    @Param('type') type: string,
    @Param('id') id: number,
    @Body() body: [string, string],
  ): Promise<object> {
    try {
      return this.appService.get(type, id, ...body);
    } catch (e) {
      throw new HttpException(
        `Something went wrong: ${e}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
