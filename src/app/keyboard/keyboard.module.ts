import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadconfigDialogComponent } from '../loadconfig-dialog/loadconfig-dialog.component';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatButtonModule
  ],
  entryComponents: [LoadconfigDialogComponent]
})
export class KeyboardModule { }
