import { Injectable } from '@angular/core';
import {ReplaySubject} from 'rxjs';

export interface IScreen {
  width: number;
  height: number;
  size: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
  sizes: ['xs', 's', 'm', 'l', 'xl', 'xxl'];
}

@Injectable({
  providedIn: 'root'
})
export class ScreenService {
  screen$ = new ReplaySubject<IScreen>(1);

  constructor() { }
}
