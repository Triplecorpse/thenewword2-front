import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {TranslateService} from "@ngx-translate/core";

export interface IModalConfirm {
  header: string;
  body: string;
}

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss']
})
export class ModalConfirmComponent implements OnInit {
  header: string;
  body: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: IModalConfirm) { }

  ngOnInit(): void {
    this.header = this.data.header;
    this.body = this.data.body;
  }
}
