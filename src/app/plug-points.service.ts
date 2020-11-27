import { Injectable } from '@angular/core';
import { PlugPoint } from './plug-point';

@Injectable({
  providedIn: 'root'
})
export class PlugPointsService {
  plugsPoints;
  plugsConnectionPairs;
  plugsConnection;
  keyboardLayout = ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P',
  'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
  'Y', 'X', 'C', 'V', 'B', 'N', 'M'];

  constructor() { }

  createPlugPoints(width,height){
    this.plugsPoints = [];
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

  return this.plugsPoints;
}

}
