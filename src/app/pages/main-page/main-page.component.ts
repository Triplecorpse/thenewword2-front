import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {filter} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit(): void {
    this.userService.getUser$()
      .pipe(
        filter(r => !!r)
      )
      .subscribe(() => {
        this.router.navigate(['word']);
      });
  }

}
