import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {IWord} from '../../interfaces/IWord';
import {isPlatformBrowser} from '@angular/common';
import {Router} from '@angular/router';
import {DisplayService} from '../../services/display.service';
import {ExerciseMode} from '../../models/enums';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.scss']
})
export class ExamComponent implements OnInit {
  private isBrowser: boolean;
  words: IWord[];

  constructor(@Inject(PLATFORM_ID) private platformId: string, private router: Router, private displayService: DisplayService) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.words = JSON.parse(sessionStorage.getItem('exercise'));
    }

    if (!this.words || !this.words.length) {
      this.router.navigate(['exercise']);
    }

    this.displayService.exerciseMode.next(ExerciseMode.Exam);
  }
}
