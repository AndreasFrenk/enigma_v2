import { Component, OnDestroy, OnInit } from '@angular/core';
import p5 from 'p5';
import { Plug } from '../plug';
import { PlugPoint } from '../plug-point';
import {Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-enigma-plugboard',
  templateUrl: './enigma-plugboard.component.html',
  styleUrls: ['./enigma-plugboard.component.css']
})
export class EnigmaPlugboardComponent implements OnInit, OnDestroy {
  sw = 2;
  bg;
  trash;
  add_connection;
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
  trash_x = 50;
  trash_y = 200;
  trash_width = 100;
  trash_height = 100;
  add_connection_x = 550;
  add_connection_y = 200;
  add_connection_width = 100;
  add_connection_height = 100;
  added_connection = false;
  destroyed : boolean;
  sketch;
  constructor(private router: Router,
    ) {
    
   }


   
  ngOnInit() {
    this.destroyed = false;
   
    this.sketch = (s) => {
  
      s.preload = () => {
        // preload code
      }

      s.setup = () => {
        
        this.bg = s.loadImage('../../assets/blacktexture.jpg');
        this.trash = s.loadImage('../../assets/Trash-empty-icon.png');
        this.add_connection = s.loadImage('../../assets/Add-icon.png');
        s.createCanvas(s.windowWidth, s.windowHeight);
        s.background(this.bg);
        // s.strokeWeight(this.sw);
        // s.rect(30,30, 500,500);
        this.createPlugPoints(s.windowWidth, s.windowHeight);
        this.loadConfiguredPlugPointsConnections();
        // const button = s.createButton('Add Connection');
        // s.textAlign(s.CENTER);
        // button.position(s.windowWidth/2 - 50, s.windowHeight/2 - 100);
        // button.mousePressed(this.AddConnection);

      };

      s.draw = () => {
        if (this.destroyed){
          s.remove();
        }
        s.push();
        s.noTint();
        s.background(this.bg);
        s.pop();
        s.push();
        s.tint(255,0,0);
        s.image(this.trash, this.trash_x, this.trash_y, this.trash_width, this.trash_height);
        s.pop();
        s.push();
        s.tint(0,255,0);
        s.image(this.add_connection, this.add_connection_x, this.add_connection_y, this.add_connection_width, this.add_connection_height);
        s.pop();

        this.drawPlugPoints(s);
        this.drawConnection(s);
        }
    }

    let canvas = new p5(this.sketch);
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
          this.plugsPoints[i].occupied = true;
          this.plugsPoints[this.movingNo].occupied = false;
          const plugs_index = this.plugsConnection.indexOf(this.movingNo);
          this.plugsConnection.splice(plugs_index, 1);
          this.plugsConnection.push(i);
          if (this.moving1){
            this.plugsConnectionPairs[this.movingPairNo].point_1 = plugPoint;
            this.plugsConnectionPairs[this.movingPairNo].connection_1 = plugPoint.letterNo;
            this.changedPlugDone = true;
            // this.moving1 = false;
          }
          if (this.moving2) {
            this.plugsConnectionPairs[this.movingPairNo].point_2 = plugPoint;
            this.plugsConnectionPairs[this.movingPairNo].connection_2 = plugPoint.letterNo;
            this.changedPlugDone = true;
            // this.moving2 = false;
          }
        }
    }
    // check whether to separate to another function
    if ((this.trash_x  < sketch.mouseX  && sketch.mouseX < this.trash_x + this.trash_width) && (this.trash_y < sketch.mouseY && sketch.mouseY < this.trash_y + this.trash_height)
    && this.moving  && !sketch.mouseIsPressed){ 
      const index_1 = this.plugsConnectionPairs[this.movingPairNo].connection_1;
      const index_2 = this.plugsConnectionPairs[this.movingPairNo].connection_2;
      this.plugsPoints[index_1].occupied = false;
      this.plugsPoints[index_2].occupied = false;
      this.plugsConnectionPairs.splice(this.movingPairNo, 1);

      const plugs_index_1 = this.plugsConnection.indexOf(index_1);
      const plugs_index_2 = this.plugsConnection.indexOf(index_2);

      this.plugsConnection.splice(plugs_index_1 , 1);
      this.plugsConnection.splice(plugs_index_2 , 1);
    }


    if ((this.add_connection_x  < sketch.mouseX  && sketch.mouseX < this.add_connection_x + this.add_connection_width) && (this.add_connection_y < sketch.mouseY && sketch.mouseY < this.add_connection_y + this.add_connection_height)
     && sketch.mouseIsPressed && !this.added_connection && !this.moving){ 
      this.AddConnection();
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
      if (this.plugsConnection.length >= 20) {
        break;
      }
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
          this.added_connection = false;
          if (typeof this.movingNo !== 'undefined') {
            this.plugsPoints[this.movingNo].clicked = false;
          }
        }

        const firstPlug = this.dragPlugs(1, i, plugConnection.point_1, sketch.mouseX, sketch.mouseY, sketch.mouseIsPressed)
        const secondPlug = this.dragPlugs(2, i, plugConnection.point_2, sketch.mouseX, sketch.mouseY, sketch.mouseIsPressed)
        if (firstPlug) {
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


  AddConnection(){
    let free_connection_1;
    let free_connection_2;
      for (let i = 0; i < this.plugsPoints.length; i++){
        if (!this.plugsPoints[i].occupied) {
          if (typeof free_connection_1 === "undefined"){
            console.log(i);
            free_connection_1 = i;
          }
          else {
            console.log(i);
            free_connection_2 = i;
            break;
          }
        }
      }
      if (typeof free_connection_1 !== "undefined" && typeof free_connection_2 !== "undefined") {
        const connection = new Plug;
        connection.connection_1 = free_connection_1;
        connection.connection_2 = free_connection_2;
        connection.point_1 = this.plugsPoints[free_connection_1];
        connection.point_2 = this.plugsPoints[free_connection_2];
        this.plugsConnectionPairs.push(connection);
        console.log(connection);
        this.plugsPoints[free_connection_1].occupied = true;
        this.plugsPoints[free_connection_2].occupied = true;
  
      }
      this.added_connection = true;
}
navigateToKeyboard(){
  this.router.navigate(['']);
  const testarray = [];
  for (let i = 0; i < this.plugsConnectionPairs.length; i++){
    testarray.push(this.plugsConnectionPairs[i])
  }

}

ngOnDestroy(){
this.destroyed = true;
}

}
