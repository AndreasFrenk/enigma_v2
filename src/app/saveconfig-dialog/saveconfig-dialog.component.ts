import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoadconfigDialogComponent } from '../loadconfig-dialog/loadconfig-dialog.component';

@Component({
  selector: 'app-saveconfig-dialog',
  templateUrl: './saveconfig-dialog.component.html',
  styleUrls: ['./saveconfig-dialog.component.css']
})
export class SaveconfigDialogComponent  {

  constructor( public dialogRef: MatDialogRef<LoadconfigDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
      this.dialogRef.close();
    }



}



