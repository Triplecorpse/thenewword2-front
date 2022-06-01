import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {ExerciseMode} from '../models/enums';

@Injectable({
  providedIn: 'root'
})
export class DisplayService {
  exerciseMode: ReplaySubject<ExerciseMode> = new ReplaySubject<ExerciseMode>(1);

  constructor() {
    this.exerciseMode.next(ExerciseMode.None);
  }
}
