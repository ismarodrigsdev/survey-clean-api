import { HttpResponse, HttpRequest } from '../protocols'
export interface Controller {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
