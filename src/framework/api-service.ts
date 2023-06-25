export type Method = 'GET' | 'PUT' | 'POST' | 'DELETE';

interface Config {
  /** Адрес относительно сервера */
  url: string;
  /** Метод запроса */
  method?: Method;
  /** Тело запроса */
  body?: string | null;
  /** Заголовки запроса */
  headers?: Headers;
}

/**
 * Класс для отправки запросов к серверу
 */
export default class ApiService {
  _endPoint: string;
  _authorization: string;
  /**
   * @param endPoint Адрес сервера
   * @param authorization Авторизационный токен
   */
  constructor(endPoint: string, authorization: string) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  /**
   * Метод для отправки запроса к серверу
   */
  async _load({
    url,
    method = 'GET',
    body = null,
    headers = new Headers(),
  }: Config) {
    headers.append('Authorization', this._authorization);

    const response = await fetch(
      `${this._endPoint}/${url}`,
      {method, body, headers},
    );

    try {
      ApiService.checkStatus(response);
    } catch (err) {
      if (err instanceof Error) {
        ApiService.catchError(err);
      }
    }

    return response;
  }

  /**
   * Метод для обработки ответа
   * @param  response Объект ответа
   * @returns {Promise}
   */
  static parseResponse(response: Response) {
    return response.json();
  }

  /**
   * Метод для проверки ответа
   * @param {Response} response Объект ответа
   */
  static checkStatus(response: Response) {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  /**
   * Метод для обработки ошибок
   * @param err Объект ошибки
   */
  static catchError(err: Error) {
    throw err;
  }
}
