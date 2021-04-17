import { Injectable } from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {DataService} from "./data.service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private dataService: DataService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.dataService.getToken();
    const headers = req.headers;
    let url = req.url;

    if (token) {
      headers.append('token', token);
    }

    if (!req.url.startsWith('http://') && !req.url.startsWith('https://')) {
      url = `${environment.api}/${url}`;
    }

    const newReq = req.clone({headers, url});

    return next.handle(newReq);
  }
}
