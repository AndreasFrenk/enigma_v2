import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import p5 from 'p5';
import { Plug } from '../plug';
import { PlugPoint } from '../plug-point';
import {Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PlugboardService } from '../plugboard.service';
import { PlugPointsService } from '../plug-points.service';
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
  plugboard = [17, 20, 11, 16, 12, 25, 9, 18, 24, 6, 14, 2, 4, 19, 10, 22, 3, 0, 7, 13, 1, 23, 15, 21, 8, 5];
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
  trash_x;
  trash_y;
  trash_width;
  trash_height;
  add_connection_x;
  add_connection_y;
  add_connection_width;
  add_connection_height;
  added_connection = false;
  destroyed : boolean;
  sketch;
  windowWidth;
  windowHeight;
  windowSizeChanged = false;
  plugHeight;
  plugWidth;
  keyboardButton;
  keyboardButton_width;
  keyboardButton_height;
  constructor(private router: Router,
    private plugBoardService: PlugboardService,
    private plugPointsService: PlugPointsService
    ) {
    
   }


   
  ngOnInit() {
    this.plugboard = this.plugBoardService.getPlugboard().length == 26 ? this.plugBoardService.getPlugboard() : this.plugboard;
    this.destroyed = false;
   
    this.sketch = (s) => {
  
      s.preload = () => {
        // preload code
        this.adjustSizes(window.innerWidth, window.innerHeight);
        this.windowSizeChanged = true;

      }

      s.setup = () => {
        
        this.bg = s.loadImage('../../assets/blacktexture.jpg');
        this.trash = s.loadImage('../../assets/Trash-empty-icon.png');
        this.add_connection = s.loadImage('../../assets/Add-icon.png');
        s.createCanvas(s.windowWidth, s.windowHeight);
        s.background(this.bg);
        this.keyboardButton = s.createButton("Keyboard"); 
        this.keyboardButton.position(this.windowWidth/2 - this.keyboardButton_width/2, this.windowHeight/3); 
        this.keyboardButton.size(this.keyboardButton_width, this.keyboardButton_height);
        this.keyboardButton.id('keyboardButton');
        this.keyboardButton.style('background-color', '#008CBA');
        this.keyboardButton.style('border-radius', '12px');
        this.keyboardButton.style('border', 'none');
        const fontsize = (this.keyboardButton_width/8).toString() + 'px';
        this.keyboardButton.style('font-size', fontsize );


        document.getElementById('keyboardButton').addEventListener('click', click => {
          this.navigateToKeyboard();
        });
        // this.createPlugPoints(this.windowWidth, this.windowHeight);
        this.plugsPoints = this.plugPointsService.createPlugPoints(this.windowWidth, this.windowHeight);
        this.loadConfiguredPlugPointsConnections();

      };

      s.draw = () => {
        if (this.windowSizeChanged) {
          s.resizeCanvas(this.windowWidth, this.windowHeight);

          this.adjustSizes(this.windowWidth, this.windowHeight);

          const fontsize = (this.keyboardButton_width/8).toString() + 'px';
          this.keyboardButton.style('font-size', fontsize );
          this.keyboardButton.size(this.keyboardButton_width, this.keyboardButton_height);
          this.keyboardButton.position(this.windowWidth/2 - this.keyboardButton_width/2, this.windowHeight/3); 
          // this.createPlugPoints(this.windowWidth, this.windowHeight);
          this.plugsPoints =  this.plugPointsService.createPlugPoints(this.windowWidth, this.windowHeight);
          this.loadConfiguredPlugPointsConnections();
          this.drawConnection(s);
          this.windowSizeChanged = false;
        }
        if (this.destroyed){
          s.remove();
        }
        s.push();
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

        this.drawPlugPoints(s, this.windowWidth, this.windowHeight);
        this.drawConnection(s);
        }
    }

    let canvas = new p5(this.sketch);
  }

  adjustSizes(windowWidth, windowHeight) {
        this.windowHeight = windowHeight;
        this.windowWidth = windowWidth;
        this.keyboardButton_height = this.windowHeight/40;
        this.keyboardButton_width = this.windowWidth/10;
        this.plugHeight = this.windowHeight/12;
        this.plugWidth = this.windowWidth/50;

        let ratio = this.windowWidth/15 > this.windowHeight/15 ? this.windowWidth/15 : this.windowHeight/15;
        this.trash_width = ratio;
        this.trash_height = ratio;
        this.add_connection_width = ratio * 0.8;
        this.add_connection_height = ratio * 0.8;
        this.trash_x =  this.trash_width * 1.25;
        this.trash_y = this.windowHeight/4;
        this.add_connection_x = this.windowWidth - this.trash_width * 2.5;
        this.add_connection_y = this.windowHeight/4 + ratio * 0.11;
  }

  drawPlugPoints(sketch, windowWidth, windowHeight) {
    const ellipseWidth = Math.round(windowWidth/50);
    const ellipseHeight = Math.round(windowHeight/50);
    const radius = ellipseHeight > ellipseWidth ? ellipseWidth : ellipseHeight;
    const fontSize = Math.round(radius);

    for (let i = 0; i < this.plugsPoints.length; i++){
      const plugPoint = this.plugsPoints[i];
      sketch.stroke(255);
      sketch.textAlign(sketch.CENTER, sketch.CENTER);
      sketch.text(plugPoint.character, plugPoint.x, plugPoint.y - this.plugHeight/2);
      sketch.textSize(fontSize);
      sketch.ellipse(plugPoint.x, plugPoint.y, radius, radius);
      sketch.ellipse(plugPoint.x, plugPoint.y + windowHeight/30, radius, radius);
      if ((plugPoint.x - this.plugWidth/2 < sketch.mouseX  && sketch.mouseX < plugPoint.x + this.plugWidth/2) && (plugPoint.y - this.plugHeight/2 < sketch.mouseY && sketch.mouseY < plugPoint.y + this.plugHeight/2)
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
          }
          if (this.moving2) {
            this.plugsConnectionPairs[this.movingPairNo].point_2 = plugPoint;
            this.plugsConnectionPairs[this.movingPairNo].connection_2 = plugPoint.letterNo;
            this.changedPlugDone = true;
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
    this.plugsConnectionPairs = [];
    this.plugsConnection = [];
    for (let i = 0; i < this.plugboard.length; i++) {
      const index = this.plugboard[i];
      if (index === i) {
        continue;
      }
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
      if (this.plugsConnection.length >= this.plugboard.length) {
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
          sketch.rect(sketch.mouseX - this.plugWidth/2, sketch.mouseY - this.plugHeight/3, this.plugWidth, this.plugHeight);
        }
        else {
          sketch.rect(plugConnection.point_1.x - this.plugWidth/2, plugConnection.point_1.y -this.plugHeight/3, this.plugWidth, this.plugHeight);
        }
        if (secondPlug) {
          sketch.rect(sketch.mouseX - this.plugWidth/2, sketch.mouseY -this.plugHeight/3, this.plugWidth, this.plugHeight);
        }
        else {
          sketch.rect(plugConnection.point_2.x - this.plugWidth/2, plugConnection.point_2.y -this.plugHeight/3, this.plugWidth, this.plugHeight);
        }
        sketch.line(plugConnection.point_1.x, plugConnection.point_1.y + this.plugHeight/5,plugConnection.point_2.x , plugConnection.point_2.y + this.plugHeight/5);

        
      }
  }

  dragPlugs(pairIndex, index, plugPoint, mouseX, mouseY, mouseIsPressed ){
    let isDragged = false;

    if ((plugPoint.x - this.plugWidth/2 < mouseX  && mouseX < plugPoint.x + this.plugWidth/2) && (plugPoint.y - this.plugHeight/2 < mouseY && mouseY < plugPoint.y + this.plugHeight/2)
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
  this.router.navigate(['./']);
  this.reloadplugboard();

  this.plugBoardService.setPlugboard(this.plugboard);

}

@HostListener('window:resize', ['$event'])
onResize(event){
  this.windowWidth = event.target.innerWidth;
  this.windowHeight = event.target.innerHeight;
  this.reloadplugboard();
  this.windowSizeChanged = true;
}

reloadplugboard() {
  this.plugboard = [];
  for (let i = 0; i < 26; i++){
    this.plugboard.push(i);
  }
  for (let i = 0; i < this.plugsConnectionPairs.length; i++){
    const connectionPair = this.plugsConnectionPairs[i];
    this.plugboard[connectionPair.connection_1] = connectionPair.connection_2;
    this.plugboard[connectionPair.connection_2] = connectionPair.connection_1;
  }
}



ngOnDestroy(){
this.destroyed = true;
}

}
