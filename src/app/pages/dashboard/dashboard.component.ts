import {Component, OnInit} from '@angular/core';
import {UserService} from "../../services/user.service";
import {IDashboard} from "../../interfaces/IDashboard";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dashboard: IDashboard;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.getDashboard$()
      .subscribe((result) => {
        this.dashboard = result;
      });
  }

  convertToDays(past: Date): number {
    return +((Date.now() - past.getTime()) / (1000 * 60 * 60 * 24)).toFixed(0);
  }
}
