import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly httpService: HttpService) {}

  async getToken(): Promise<object> {
    const { data } = await firstValueFrom(
      this.httpService
        .get<JSON[]>('https://test.gnzs.ru/oauth/get-token.php', {
          headers: {
            'X-Client-Id': 31550986,
            'Content-Type': 'application/json',
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened on getting token!';
          }),
        ),
    );
    return data;
  }

  async create(
    type: string,
    domain: string,
    token: string,
    instance: object,
  ): Promise<number> {
    const { data } = await firstValueFrom(
      this.httpService
        .post<JSON[]>(`https://${domain}/api/v4/${type}`, [instance], {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened when creating instance!';
          }),
        ),
    );

    return data?.['_embedded']?.[type][0].id;
  }

  async get(
    type: string,
    id: number,
    domain: string,
    token: string,
  ): Promise<object> {
    const { data }: any = await firstValueFrom(
      this.httpService
        .get<JSON[]>(`https://${domain}/api/v4/${type}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw 'An error happened when tried to get instance!';
          }),
        ),
    );

    return { id: data.id, name: data.name };
  }
}
