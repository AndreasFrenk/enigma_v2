import { Component, OnInit } from '@angular/core';
import p5 from 'p5';
import { Plug } from '../plug';
import { PlugPoint } from '../plug-point';
import {Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PlugboardDialogComponent } from '../plugboard-dialog/plugboard-dialog.component';
@Component({
  selector: 'app-enigma-plugboard',
  templateUrl: './enigma-plugboard.component.html',
  styleUrls: ['./enigma-plugboard.component.css']
})
export class EnigmaPlugboardComponent implements OnInit {
  sw = 2;
  bg;
  keyboardLayout = ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P',
  'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
  'Y', 'X', 'C', 'V', 'B', 'N', 'M'];
  umkehrWalzePermutation = [17, 20, 11, 16, 12, 25, 9, 18, 24, 6, 14, 2, 4, 19, 10, 22, 3, 0, 7, 13, 1, 23, 15, 21, 8, 5];
  alreadyConnectedPlugs = [];
  plugsConnection = [];
  plugsPoints = [];
  plugsConnectionPairs = [];
  moving = false;
  movingNo: number;
  moving1: boolean;
  moving2: boolean;
  movingPairNo: number;
  changedPlugDone: boolean;
  openedDialog = false;

  constructor(private router: Router,
    private dialog: MatDialog) {
    
   }

   openDialog(clickedPlugPair): void {
    let dialogRef = this.dialog.open(PlugboardDialogComponent, {
      width: '250px',
      data: { clickedPlugPair }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.openedDialog = false;
    });
  }

   
  ngOnInit() {

    const sketch = (s) => {

      s.preload = () => {
        // preload code
      }

      s.setup = () => {
        this.bg = s.loadImage('../../assets/blacktexture.jpg');
        s.createCanvas(s.windowWidth, s.windowHeight);
        s.background(this.bg);
        s.strokeWeight(this.sw);
        s.rect(30,30, 500,500);
        this.createPlugPoints(s.windowWidth, s.windowHeight);
        // this.connectPlugPoints();
        this.loadConfiguredPlugPointsConnections();
      };

      s.draw = () => {
        s.background(this.bg);
        this.drawPlugPoints(s);
        this.drawConnection(s);

      };
    }

    let canvas = new p5(sketch);
  }


  createPlugPoints(width,height){
    for (let i = 0; i < this.keyboardLayout.length; i++){
      let level;
      let x;
      let y;
      if (i < 10) {
        level = 1;
        const rowPos = i; 
        x = (rowPos+1.0)* width/11;
      }
      else if (i < 19) {
        level = 2;
        const rowPos = i - 10;
        x = (rowPos+1.5)*width/11;
      } else {
  
        level = 3;
        const rowPos = i - 19;
        x = (rowPos+2.0)*width/11;
      }
      y  = height/3 + level*(height*2/3)/4;
      if(i%3 ==0){
        y += 15; 
       }
       let plugPoint = new PlugPoint();
       plugPoint.character = this.keyboardLayout[i];
       plugPoint.letterNo = i;
       plugPoint.occupied = false;
       plugPoint.x = x;
       plugPoint.y = y;
       this.plugsPoints.push(plugPoint);

  }
}

  drawPlugPoints(sketch) {
    for (let i = 0; i < this.plugsPoints.length; i++){
      const plugPoint = this.plugsPoints[i];
      sketch.stroke(255);
      sketch.textAlign(sketch.CENTER, sketch.CENTER);
      sketch.text(plugPoint.character, plugPoint.x, plugPoint.y - 20);
      sketch.ellipse(plugPoint.x, plugPoint.y, 20, 20);
      sketch.ellipse(plugPoint.x, plugPoint.y+30, 20, 20);
      if ((plugPoint.x - 15 < sketch.mouseX  && sketch.mouseX < plugPoint.x + 15) && (plugPoint.y - 35 < sketch.mouseY && sketch.mouseY < plugPoint.y + 35)
        && this.moving && !this.plugsPoints[i].occupied && !sketch.mouseIsPressed){
          console.log('worked');
          this.plugsPoints[i].occupied = true;
          this.plugsPoints[this.movingNo].occupied = false;
          if (this.moving1){
            console.log(this.plugsConnectionPairs);
            this.plugsConnectionPairs[this.movingPairNo].point_1 = plugPoint;
            this.plugsConnectionPairs[this.movingPairNo].connection_1 = plugPoint.letterNo;
            this.changedPlugDone = true;
          }
          if (this.moving2) {
            this.plugsConnectionPairs[this.movingPairNo].point_2 = plugPoint;
            this.plugsConnectionPairs[this.movingPairNo].connection_2 = plugPoint.letterNo;
            this.changedPlugDone = true;
          }
        }
      

    }
  }

  connectPlugPoints(){
    for (let i = 0; i < 10; i++) {
      let rand1;
      rand1 = Math.floor(Math.random() * this.plugsPoints.length);
      while(this.plugsConnection.includes(rand1)){
       rand1 = Math.floor(Math.random() * this.plugsPoints.length);
      }
      this.plugsConnection.push(rand1);
      let rand2;
      rand2 = Math.floor(Math.random() * this.plugsPoints.length);
      while(this.plugsConnection.includes(rand2)){
       rand2 = Math.floor(Math.random() * this.plugsPoints.length);
      }
      this.plugsConnection.push(rand2);
      const connection = new Plug;
      connection.connection_1 = rand1;
      connection.connection_2 = rand2;
      connection.point_1 = this.plugsPoints[rand1];
      connection.point_2 = this.plugsPoints[rand2];
      this.plugsConnectionPairs.push(connection);
      this.plugsPoints[rand1].occupied = true;
      this.plugsPoints[rand2].occupied = true;

    } 
  }

  loadConfiguredPlugPointsConnections(){
    for (let i = 0; i < this.umkehrWalzePermutation.length; i++) {
      const index = this.umkehrWalzePermutation[i];
      if (!this.plugsConnection.includes(index) && !this.plugsConnection.includes(i)) {
        this.plugsConnection.push(index);
        this.plugsConnection.push(i);
        const connection = new Plug;
        connection.connection_1 = index;
        connection.connection_2 = i;
        connection.point_1 = this.plugsPoints[index];
        connection.point_2 = this.plugsPoints[i];
        this.plugsConnectionPairs.push(connection);
        this.plugsPoints[index].occupied = true;
        this.plugsPoints[i].occupied = true;
      }
      // if (this.plugsConnection.length >= 20) {
      //   break;
      // }
    }
  }

  drawConnection(sketch){
      for (let i = 0; i < this.plugsConnectionPairs.length; i++){
        const plugConnection = this.plugsConnectionPairs[i];
        sketch.fill(100, 100, 100, 150);
        if (!sketch.mouseIsPressed){
          this.moving = false;
          this.moving1 = false;
          this.moving2 = false;
          if (this.movingNo) {
            this.plugsPoints[this.movingNo].clicked = false;
          }
        }

        const firstPlug = this.dragPlugs(1, i, plugConnection.point_1, sketch.mouseX, sketch.mouseY, sketch.mouseIsPressed)
        const secondPlug = this.dragPlugs(2, i, plugConnection.point_2, sketch.mouseX, sketch.mouseY, sketch.mouseIsPressed)
        if (firstPlug) {
          // if (!this.openedDialog){
          //   this.openedDialog = true;
          //   this.openDialog(this.plugsConnectionPairs[i]);
          // }
          sketch.rect(sketch.mouseX - 15, sketch.mouseY -10, 30, 70);
        }
        else {
          sketch.rect(plugConnection.point_1.x - 15, plugConnection.point_1.y -10, 30, 70);
        }
        if (secondPlug) {
          sketch.rect(sketch.mouseX - 15, sketch.mouseY -10, 30, 70);
        }
        else {
          sketch.rect(plugConnection.point_2.x - 15, plugConnection.point_2.y -10, 30, 70);
        }
        sketch.line(plugConnection.point_1.x, plugConnection.point_1.y + 25,plugConnection.point_2.x , plugConnection.point_2.y + 25);

        
      }
  }

  dragPlugs(pairIndex, index, plugPoint, mouseX, mouseY, mouseIsPressed ){
    let isDragged = false;

    if ((plugPoint.x - 15 < mouseX  && mouseX < plugPoint.x + 15) && (plugPoint.y - 35 < mouseY && mouseY < plugPoint.y + 35)
    && mouseIsPressed && !this.moving){
      this.movingNo = plugPoint.letterNo;
      this.plugsPoints[this.movingNo].clicked = true;
      this.moving = true;
    }
  
    if (this.plugsPoints[plugPoint.letterNo]?.clicked) {
      this.changedPlugDone = false;
      if (pairIndex === 1){
        this.moving1 = true;
      }
      else {
        this.moving2 = true;
      }
      this.movingPairNo = index;
      isDragged = true;
    }
    else {
      isDragged = false;
    }

    return isDragged;
  }

  navigateToKeyboard(){
    this.router.navigate(['']);
    const testarray = [];
    for (let i = 0; i < this.plugsConnectionPairs.length; i++){
      testarray.push(this.plugsConnectionPairs[i])
    }
  }
}
