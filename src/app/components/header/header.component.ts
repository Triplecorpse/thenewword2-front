import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {Observable, Subject} from 'rxjs';
import {IUser} from '../../interfaces/IUser';
import {environment} from '../../../environments/environment';
import {DisplayService} from '../../services/display.service';
import {ExerciseMode} from '../../models/enums';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  user$: Observable<IUser | null> | undefined;
  mode$: Observable<ExerciseMode>;
  ExerciseMode = ExerciseMode;

  constructor(private userService: UserService, private displayService: DisplayService) {
    this.mode$ = displayService.exerciseMode;
  }

  ngOnInit(): void {
    this.user$ = this.userService.getUser$();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  logout() {
    this.userService.logout();
  }

  isDevMode(): boolean {
    return !environment.production;
  }
}
