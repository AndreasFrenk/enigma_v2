import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlugboardService {
  
  private plugBoardSetting = [];

   setPlugboard(plugBoard) {
    this.plugBoardSetting = plugBoard;
  }

  getPlugboard() {
    return this.plugBoardSetting; 
  }
}
