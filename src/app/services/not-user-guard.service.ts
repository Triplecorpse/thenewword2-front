import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {UserService} from "./user.service";
import {map, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class NotUserGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userService.getUser$()
      .pipe(
        map(user => !user),
        tap((user) => {
          if (user) {
            this.router.navigate(['word'])
          }
        })
      );
  }
}
