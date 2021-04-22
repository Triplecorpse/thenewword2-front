import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {Observable, Subject} from "rxjs";
import {IUser} from "../../interfaces/IUser";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  user$: Observable<IUser | null> | undefined;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.user$ = this.userService.getUser$()
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
