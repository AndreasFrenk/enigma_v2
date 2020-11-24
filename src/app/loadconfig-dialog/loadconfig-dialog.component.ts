import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-loadconfig-dialog',
  templateUrl: './loadconfig-dialog.component.html',
  styleUrls: ['./loadconfig-dialog.component.css']
})
export class LoadconfigDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<LoadconfigDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
