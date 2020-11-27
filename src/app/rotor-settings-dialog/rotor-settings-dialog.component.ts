import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-rotor-settings-dialog',
  templateUrl: './rotor-settings-dialog.component.html',
  styleUrls: ['./rotor-settings-dialog.component.css']
})


export class RotorSettingsDialogComponent {
  
  rotors = [
    {name: 'I'},
    {name: 'II'},
    {name: 'III'},
    {name: 'IV'},
    {name: 'V'}
  ];

  // selectedRotor_I = { index: 1, name: 'I'};
  selectedRotor_I = 1;
  constructor( public dialogRef: MatDialogRef<RotorSettingsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
      this.dialogRef.close();
    }

    confirm() {
      this.dialogRef.close(this.data);
    }

}
