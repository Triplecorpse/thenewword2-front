import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {UserService} from "./user.service";
import {map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class NotUserGuard implements CanActivate {
  constructor(private userService: UserService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    return this.userService.getUser$()
      .pipe(map(user => !user));
  }
}
