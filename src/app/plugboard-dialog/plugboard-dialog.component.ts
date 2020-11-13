import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-plugboard-dialog',
  templateUrl: './plugboard-dialog.component.html',
  styleUrls: ['./plugboard-dialog.component.css']
})
export class PlugboardDialogComponent {

  constructor(public dialogRef: MatDialogRef<PlugboardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log(data);
     }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
