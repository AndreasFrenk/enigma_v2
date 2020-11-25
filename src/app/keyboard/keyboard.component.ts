import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { lookup } from 'dns';
import p5 from 'p5';
import { EnigmaSetting } from '../enigma-setting';
import { LoadconfigDialogComponent } from '../loadconfig-dialog/loadconfig-dialog.component';
import { PlugPoint } from '../plug-point';
import { PlugboardService } from '../plugboard.service';
import { SaveconfigDialogComponent } from '../saveconfig-dialog/saveconfig-dialog.component';
import { Walze } from '../walze';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.css']
})
export class KeyboardComponent implements OnInit {
  bg;
  keyboardLayout = ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P',
  'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
  'Y', 'X', 'C', 'V', 'B', 'N', 'M'];
  plugsPoints = [];
  highlightedKey;
  clearText;
  encryptedText;
  save_icon;
  save_icon_x = 50;
  save_icon_y = 200;
  save_icon_width = 100;
  save_icon_height = 100;
  load_icon;
  load_icon_x = 50;
  load_icon_y = 350;
  load_icon_width = 100;
  load_icon_height = 100;

  mousePressedSaveButton = false;
  mousePressedLoadButton = false;


    // Enigma-G G312 https://de.wikipedia.org/wiki/Enigma-Walzen
    alphabet = ["ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
    // firstWaltzePermutation = "DMTWSILRUYQNKFEJCAZBPGXOHV";
    firstWaltzePermutation = [3, 12, 19, 22, 18, 8, 11, 17, 20, 24, 16, 13, 10, 5, 4, 9, 2, 0, 25, 1, 15, 6, 23, 14, 7, 21];
    // secondWaltzePermutation = "HQZGPJTMOBLNCIFDYAWVEUSRKX";
    secondWaltzePermutation = [7, 16, 25, 6, 15, 9, 19, 12, 14, 1, 11, 13, 2, 8, 5, 3, 24, 0, 22, 21, 4, 20, 18, 17, 10, 23];
    // thirdWaltzePermutation = "UQNTLSZFMREHDPXKIBVYGJCWOA";
    thirdWaltzePermutation = [20, 16, 13, 19, 11, 18  , 25, 5, 12, 17, 4, 7, 3, 15, 23, 10, 8, 1, 21, 24, 6, 9, 2, 22, 14, 0];
    // umkehrWalzePermutation = "RULQMZJSYGOCETKWDAHNBXPVIF";
    umkehrWalzePermutation = [17, 20, 11, 16, 12, 25, 9, 18, 24, 6, 14, 2, 4, 19, 10, 22, 3, 0, 7, 13, 1, 23, 15, 21, 8, 5];
  
    lowerAlph = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
    upperCaseAlp = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    upperCaseAlpNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
    firstWalze = 11;
    secondWalze = 4;
    thirdWalze = 20;
    changeLetter: number;
    index: number;
    keypressed : boolean;
    keyAlreadyPressed = false;
    previousHighlightedKey;

    firstWalzenRotor : Walze = {
      permutation: [3, 12, 19, 22, 18, 8, 11, 17, 20, 24, 16, 13, 10, 5, 4, 9, 2, 0, 25, 1, 15, 6, 23, 14, 7, 21],
      position: 11,
      name: 'first'
    };

    secondWalzenRotor : Walze = {
      permutation: [7, 16, 25, 6, 15, 9, 19, 12, 14, 1, 11, 13, 2, 8, 5, 3, 24, 0, 22, 21, 4, 20, 18, 17, 10, 23],
      position: 4,
      name: 'second'
    };
    

    thirdWalzenRotor : Walze = {
      permutation: [20, 16, 13, 19, 11, 18, 25, 5, 12, 17, 4, 7, 3, 15, 23, 10, 8, 1, 21, 24, 6, 9, 2, 22, 14, 0],
      position: 20,
      name: 'third'
    };


    enigmaSetting : EnigmaSetting = {
      name: 'default',
      firstWalze: this.firstWalzenRotor,
      secondWalze: this.secondWalzenRotor,
      thirdWalze: this.thirdWalzenRotor,
      umkehrWalze: this.umkehrWalzePermutation
    }

    firstWaltzeInput;
    secondWaltzeInput;
    thirdWaltzeInput;
    destroyed;
    
    
  constructor(public dialog: MatDialog,
    private router: Router,
    private plugBoardService: PlugboardService) { 
  }

  runThroughMachine( input ,firstRotor, secondRotor, thirdRotor, umkehrWalze){
    let currentNo;
    currentNo = this.runThrough(input, firstRotor, true);
    currentNo = this.runThrough(currentNo, secondRotor, true);
    currentNo = this.runThrough(currentNo, thirdRotor, true);
    currentNo = umkehrWalze[currentNo];
    currentNo = this.runThrough(currentNo, thirdRotor, false);
    currentNo = this.runThrough(currentNo, secondRotor, false);
    currentNo = this.runThrough(currentNo, firstRotor, false);
    return currentNo;

  }

  runThrough(input, rotor, forward) {
      if (forward) {
        input = (input + rotor.position) % 26;
        return rotor.permutation[input];  
      }
      else {
        let output = (rotor.permutation.indexOf(input) - rotor.position) % 26;
        while (output < 0) {
          output += 26;
        }
        output = output % 26;
        return output;
      }

  }


  

   enforcePositiveInteger(input, walze_id) {
    let filteredInput; 
    const userInput = input.target.value;
    filteredInput = userInput.replace(/^0+|[^\d]/g, '');
    filteredInput = parseInt(filteredInput);
      if (filteredInput > 26){
        filteredInput = Math.floor(filteredInput / 1e2);
      }
      input.target.value = filteredInput;
      switch (walze_id) {
        case 'firstWaltzeInput':
          this.enigmaSetting.firstWalze.position = filteredInput;
          break;
        case 'secondWaltzeInput':
          this.enigmaSetting.secondWalze.position = filteredInput;
          break;
        case 'thirdWaltzeInput':
          this.enigmaSetting.secondWalze.position = filteredInput;
          break;
        default:
          console.log('Could not find id'); 
          }
  
    }


   inputCharacter(key, Walze) {
    //rotate the Walzen with each input
    const input = key.data;
    console.log(key.inputType);
    if (key.inputType === 'insertFromPaste' && typeof key.target.value !== 'undefined'){
      let encryptedText = '';
      const pastedText = key.target.value;
      for ( let i = 0; i < pastedText.length; i ++){
        const character = pastedText.charAt(i).toUpperCase();
        const index = this.upperCaseAlp.indexOf(character);
        const encryptedKeyIndex = this.runThroughMachine(index, this.enigmaSetting.firstWalze, this.enigmaSetting.secondWalze, this.enigmaSetting.secondWalze, this.enigmaSetting.umkehrWalze);
        const encryptedCharacter = this.upperCaseAlp[encryptedKeyIndex];
        encryptedText += encryptedCharacter;
        this.index = this.plugsPoints.findIndex(element => {
          if ( element.character === encryptedCharacter) {
            return true;
          }
        });
        this.highlightkey(this.index, this.keypressed, this.previousHighlightedKey);
        this.previousHighlightedKey = this.index;
        this.keyAlreadyPressed = true;
    
        this.rotateWalzen();    
    
      }
      console.log(encryptedText);
      return encryptedText;

    }
    console.log(key.target.value);
    // if(!this.keyAlreadyPressed && key.inputType === 'insertText' && input !== ' '){
    if(key.inputType === 'insertText' && input !== ' '){
        console.log(input);
    const lastCharacter = input[input?.length - 1].toUpperCase();
    const index = this.upperCaseAlp.indexOf(lastCharacter);
    const encryptedKeyIndex = this.runThroughMachine(index, this.enigmaSetting.firstWalze, this.enigmaSetting.secondWalze, this.enigmaSetting.secondWalze, this.enigmaSetting.umkehrWalze);
    const encryptedCharacter = this.upperCaseAlp[encryptedKeyIndex];
    this.index = this.plugsPoints.findIndex(element => {
      if ( element.character === encryptedCharacter) {
        return true;
      }
    });
    this.highlightkey(this.index, this.keypressed, this.previousHighlightedKey);
    this.previousHighlightedKey = this.index;
    this.keyAlreadyPressed = true;

    this.rotateWalzen();

    return encryptedCharacter;
    }
  }
  
   rotateWalzen() {

    this.enigmaSetting.firstWalze.position += 1;

    if (this.enigmaSetting.firstWalze.position >= (this.upperCaseAlp.length - 1)) {
      this.enigmaSetting.firstWalze.position =  0;
      this.enigmaSetting.secondWalze.position += 1;
    }
    
    if (this.enigmaSetting.secondWalze.position >= (this.upperCaseAlp.length - 1)) {
      this.enigmaSetting.secondWalze.position = 0;
      this.enigmaSetting.secondWalze.position += 1;
    }
    if (this.enigmaSetting.secondWalze.position >= (this.upperCaseAlp.length - 1)) {
      this.enigmaSetting.secondWalze.position =  0;
    }

  }
  
   shiftIndex(index, rotatorIndex) {
    //Shift index according to the rotation of the Walze
    const shift = (index + rotatorIndex) % 26;
    return shift;
  }


  inputHtml(element, id, position) {
    element.id(id);
    element.position(position[0], position[1]);
    const walze_id = id;
    const inputElement = <HTMLInputElement>document.getElementById(id);
    inputElement.addEventListener('input', input => {
      this.enforcePositiveInteger(input, walze_id );
    });
  }

  saveConfig(filename) {

    //https://stackoverflow.com/questions/19706046/how-to-read-an-external-local-json-file-in-javascript credits to yordan georgiev and musicformellons
    
      const enigmaSetting = this.enigmaSetting;
      console.log(this.enigmaSetting);
      enigmaSetting['name'] = filename;
      this.downloadJsonFile(enigmaSetting, filename);

    this.mousePressedSaveButton = true;
  // }
    }
    
    loadConfig() {
      if (!this.mousePressedLoadButton){
        console.log('load config');
        this.mousePressedLoadButton = true;
      }
    
    }
    // credits to https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser Nam Do
    downloadJsonFile(data, filename: string){
      // Creating a blob object from non-blob data using the Blob constructor
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      // Create a new anchor element
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'download';
      a.click();
      a.remove();
    }
  
  ngOnInit(): void {

    this.enigmaSetting.umkehrWalze = this.plugBoardService.getPlugboard().length > 0 ? this.plugBoardService.getPlugboard() : this.umkehrWalzePermutation;
    this.destroyed = false;

    const sketch = (s) => {

      s.preload = () => {
        // preload code
      }

      s.setup = () => {
        this.bg = s.loadImage('../../assets/blacktexture.jpg');
        this.save_icon = s.loadImage('../../assets/save-icon.png');
        this.load_icon = s.loadImage('../../assets/load-icon.png');
        s.createCanvas(s.windowWidth, s.windowHeight);
        this.clearText = s.createElement('textarea', '');
        this.clearText.value('')
        this.clearText.id('clearText');
        const clearText = <HTMLInputElement>document.getElementById('clearText');
        this.encryptedText = s.createElement('textarea', '');
        this.encryptedText.value('');
        this.encryptedText.id('encryptedText');
        const encryptedText = <HTMLInputElement>document.getElementById('encryptedText');

        clearText.addEventListener('input', input => {
          const encryptedKey = this.inputCharacter(input, this.firstWalze);
          if (typeof encryptedKey !== 'undefined') {
            encryptedText.value += encryptedKey;
          }
        });
        this.clearText.position(s.width/4, 100);

        this.encryptedText.position(s.width - s.width/4, 100);
        s.background(this.bg);
        this.createPlugPoints(s.windowWidth, s.windowHeight);
        this.highlightedKey = s.color(255,204,0);
        this.firstWaltzeInput = s.createElement('input', '');
        this.inputHtml(this.firstWaltzeInput, 'firstWaltzeInput', [s.width/5, 200]);
        this.firstWaltzeInput.value(this.firstWalze);

        this.secondWaltzeInput = s.createInput('input', '');
        this.inputHtml(this.secondWaltzeInput, 'secondWaltzeInput', [s.width/5 * 2, 200]);
        this.secondWaltzeInput.value(this.secondWalze);

        this.thirdWaltzeInput = s.createInput('');
        this.inputHtml(this.thirdWaltzeInput, 'thirdWaltzeInput', [s.width/5 * 3, 200]);
        this.thirdWaltzeInput.value(this.thirdWalze);

      };


//https://tutorial.eyehunts.com/html/html-textarea-input-placeholder-value-resize-readonly/

      s.draw = () => {

          if (this.destroyed){
          s.remove();
        }

        s.background(this.bg);
        s.push();
        s.tint(255,0,255);
        s.image(this.save_icon, this.save_icon_x, this.save_icon_y, this.save_icon_width, this.save_icon_height);
        s.pop();
        s.push();
        s.tint(255,0,255);
        s.image(this.load_icon, this.load_icon_x, this.load_icon_y, this.load_icon_width, this.load_icon_height);
        s.pop();
        this.drawPlugPoints(s);
        if (s.mouseIsPressed){
          this.checkSaveButton(s.mouseX, s.mouseY);
          this.checkLoadButton(s.mouseX, s.mouseY);
        }
        else {
          this.mousePressedSaveButton = false;
          this.mousePressedLoadButton = false;
        }
        


        
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
    sketch.textSize(25);
    if (this.plugsPoints[i].light){
      sketch.fill(this.highlightedKey);      
    }
    else {
      sketch.fill(255,255,255);
    }
    sketch.ellipse(plugPoint.x, plugPoint.y, 80, 80);
    sketch.fill(0,0,0);
    sketch.text(plugPoint.character, plugPoint.x, plugPoint.y);

  }
}





@HostListener('window:keydown', ['$event'])
handleKeyboardEventDown() {
  this.keypressed = true;

}

@HostListener('window:keyup', ['$event'])
handleKeyboardEventUp() {
  this.keypressed = false;
  this.keyAlreadyPressed = false;
  this.highlightkey(this.index, this.keypressed, this.previousHighlightedKey);
}

highlightkey(index, pressed, previousIndex) {
  if (pressed && typeof index !== 'undefined') {

    this.plugsPoints[index].light = true;
    const previousPlugPoint = this.plugsPoints[previousIndex]; 
    if (typeof previousPlugPoint !== 'undefined' && previousIndex !== index) {
      previousPlugPoint.light = false;
    }
  }
  // if (!pressed && index){
  //   this.plugsPoints[index].light = false;
  // }
}

checkSaveButton(mouseX, mouseY){
  if ((this.save_icon_x - this.save_icon_width < mouseX  && mouseX < this.save_icon_x + this.save_icon_width) &&
   (this.save_icon_y - this.save_icon_height < mouseY && mouseY < this.save_icon_y + this.save_icon_height)){
    this.openSaveDialog();
}
}

checkLoadButton(mouseX, mouseY){
  if ((this.load_icon_x - this.load_icon_width < mouseX  && mouseX < this.load_icon_x + this.load_icon_width) &&
   (this.load_icon_y - this.load_icon_height < mouseY && mouseY < this.load_icon_y + this.load_icon_height)){
    // this.loadConfig();
    this.openLoadDialog();

}

}

openSaveDialog(): void {
  let test;
  if (!this.mousePressedSaveButton){
    let dialogRef = this.dialog.open(SaveconfigDialogComponent, {
      width: '250px',
      data: { name: "test"  }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result?.name);
      if (result) {
        this.saveConfig(result.name);
      }

    });

    this.mousePressedSaveButton = true;
  
  }
}


openLoadDialog(): void {
  if (!this.mousePressedLoadButton){
    let dialogRef = this.dialog.open(LoadconfigDialogComponent, {
      width: '250px',
      data: {  }
    });
  
    dialogRef.afterClosed().subscribe(result => {

      // const settings = require('C:/Users/Irene/Desktop/Uni_Regensburg_Dokumente/Projekte/EnigmaV3/enigma/src/assets/enigmaSetting.json');
      // const settings = require('C:/Users/Irene/Desktop/Uni_Regensburg_Dokumente/Projekte/EnigmaV3/enigma/src/assets/testwerweff.json');
      if (result) {
        if (Object.entries(result).length !== 0) {
          const settings = result;
          this.enigmaSetting = settings;
          this.firstWaltzeInput.value(this.enigmaSetting.firstWalze.position);
          this.secondWaltzeInput.value(this.enigmaSetting.secondWalze.position);
          this.thirdWaltzeInput.value(this.enigmaSetting.thirdWalze.position);  
        }
      }
    });

    this.mousePressedLoadButton = true;
  
  }
}

navigateToKeyboard(){
  this.destroyed = true;
  this.router.navigate(['plugboard']);

}



}
