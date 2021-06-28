import { Injectable } from '@angular/core';
import {AbstractControl, AsyncValidatorFn, ValidationErrors} from "@angular/forms";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AsyncValidatorService {
  constructor(private httpClient: HttpClient) {
  }

  http(endpoint: string): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.httpClient.post(endpoint, {value: control.value})
        .pipe(map((response: any) => {
          if (response.success) {
            return null;
          }

          return {http: true}
        }));
    }
  }
}
