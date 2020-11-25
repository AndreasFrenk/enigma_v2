import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-loadconfig-dialog',
  templateUrl: './loadconfig-dialog.component.html',
  styleUrls: ['./loadconfig-dialog.component.css']
})

// https://stackoverflow.com/questions/47936183/angular-file-upload

export class LoadconfigDialogComponent {
  fileToUpload: File = null;
  constructor(
    public dialogRef: MatDialogRef<LoadconfigDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  upload(event){
  const file = event.target.files[0];
  const fileReader = new FileReader();
  fileReader.readAsText(file, "UTF-8");

  fileReader.onload = () => {
   this.data = JSON.parse(<string>fileReader.result);
  }
  fileReader.onerror = (error) => {
    console.log(error);
  }
    // this.uploadAndProgress(files);
  }


}
