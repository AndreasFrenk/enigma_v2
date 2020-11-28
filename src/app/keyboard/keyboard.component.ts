import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import p5 from 'p5';
import { EnigmaSetting } from '../enigma-setting';
import { LoadconfigDialogComponent } from '../loadconfig-dialog/loadconfig-dialog.component';
import { PlugPointsService } from '../plug-points.service';
import { PlugboardService } from '../plugboard.service';
import { RotorSettingsDialogComponent } from '../rotor-settings-dialog/rotor-settings-dialog.component';
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
  save_icon_x;
  save_icon_y;
  save_icon_width;
  save_icon_height;
  load_icon;
  load_icon_x;
  load_icon_y;
  load_icon_width;
  load_icon_height;
  rotorSettingsButton;
  plugboardButton;
  plugboardButton_width;
  plugboardButton_height;

  inputElement_height;
  inputElement_width;

  mousePressedSaveButton = false;
  mousePressedLoadButton = false;
  mousePressedRotorSettingsButton = false;

    //https://en.wikipedia.org/wiki/Enigma_rotor_details Enigma I (first 5 rotors) & Reflector A
    // firstRotor = "EKMFLGDQVZNTOWYHXUSPAIBRCJ";
    firstRotorPermutation = [4, 10, 12, 5, 11, 6, 3, 16, 21, 25, 13, 19, 14, 22, 24, 7, 23, 20, 18, 15, 0, 8, 1, 17, 2, 9];
    // secondRotorPermutation = "AJDKSIRUXBLHWTMCQGZNPYFVOE";
    secondRotorPermutation = [0, 9, 3, 10, 18, 8, 17, 20, 23, 1, 11, 7, 22, 19, 12, 2, 16, 6, 25, 13, 15, 24, 5, 21, 14, 4];
    // thirdRotorPermutation = "BDFHJLCPRTXVZNYEIWGAKMUSQO";
    thirdRotorPermutation = [1, 3, 5, 7, 9, 11, 2, 15, 17, 19, 23, 21, 25, 13, 24, 4, 8, 22, 6, 0, 10, 12, 20, 18, 16, 14];
    // fourthRotorPermutation = "ESOVPZJAYQUIRHXLNFTGKDCMWB";
    fourthRotorPermutation = [4, 18, 14, 21, 15, 25, 9, 0, 24, 16, 20, 8, 17, 7, 23, 11, 13, 5, 19, 6, 10, 3, 2, 12, 22, 1];
    // fifthRotorPermutation = "VZBRGITYUPSDNHLXAWMJQOFECK";
    fifthRotorPermutation = [21, 25, 1, 17, 6, 8, 19, 24, 20, 15, 18, 3, 13, 7, 11, 23, 0, 22, 12, 9, 16, 14, 5, 4, 2, 10];
  
    //Reflector A 
    // reflector = "EJMZALYXVBWFCRQUONTSPIKHGD"; 
    reflector = [4, 9, 12, 25, 0, 11, 24, 23, 21, 1, 22, 5, 2, 17, 16, 20, 14, 13, 19, 18, 15, 8, 10, 7, 6, 3];

    //Plugboard 
    plugboard = [17,20,11,16,12,25,9,18,24,6,14,2,4,19,10,22,3,0,7,13,1,23,15,21,8,5];

    upperCaseAlp = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];


    index: number;
    keypressed : boolean;
    keyAlreadyPressed = false;
    previousHighlightedKey;
    windowWidth;
    windowHeight;
    windowSizeChanged = false;

    firstWalzenRotor : Walze = {
      permutation: this.firstRotorPermutation,
      position: 11,
      name: 'I'
    };

    secondWalzenRotor : Walze = {
      permutation: this.secondRotorPermutation,
      position: 4,
      name: 'II'
    };
    

    thirdWalzenRotor : Walze = {
      permutation: this.thirdRotorPermutation,
      position: 20,
      name: 'III'
    };

    fourthWalzenRotor : Walze = {
      permutation: this.fourthRotorPermutation,
      position: 20,
      name: 'IV'
    };

    fifthWalzenRotor : Walze = {
      permutation: this.fifthRotorPermutation,
      position: 20,
      name: 'V'
    };


    enigmaSetting : EnigmaSetting = {
      name: 'default',
      firstWalze: this.firstWalzenRotor,
      secondWalze: this.secondWalzenRotor,
      thirdWalze: this.thirdWalzenRotor,
      plugboard: this.plugboard,
      umkehrWalze: this.reflector
    }

    firstWaltzeInput;
    secondWaltzeInput;
    thirdWaltzeInput;
    destroyed;
    
    
  constructor(public dialog: MatDialog,
    private router: Router,
    private plugBoardService: PlugboardService,
    private plugPointsService: PlugPointsService) { 
  }

  runThroughMachine( input ,plugboard, firstRotor, secondRotor, thirdRotor, umkehrWalze){
    let currentNo;
    currentNo = plugboard[input];
    currentNo = this.runThrough(currentNo, firstRotor, true);
    currentNo = this.runThrough(currentNo, secondRotor, true);
    currentNo = this.runThrough(currentNo, thirdRotor, true);
    currentNo = umkehrWalze[currentNo];
    currentNo = this.runThrough(currentNo, thirdRotor, false);
    currentNo = this.runThrough(currentNo, secondRotor, false);
    currentNo = this.runThrough(currentNo, firstRotor, false);
    currentNo = plugboard[currentNo];


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
    if (isNaN(filteredInput)) {
      filteredInput = 0;
    }
      if (filteredInput > 25){
        filteredInput = filteredInput.toString();
        const firstdigit = filteredInput[0]; 
        const lastdigit = filteredInput[filteredInput.length -1];
        const newNumber = firstdigit + lastdigit; 
        switch (filteredInput.length) {
          case 2:
            filteredInput = lastdigit;
            break;
          case 3:
            if (parseInt(newNumber) <= 25 ){
              filteredInput = newNumber;
            }
            else {
              filteredInput = filteredInput.slice(0, filteredInput.length - 1);              
            }
            break;

            default: 
            while (filteredInput.length >= 3 && parseInt(filteredInput) > 25){
              filteredInput = filteredInput.slice(0, filteredInput.length - 1);              
            }
          }
        filteredInput = parseInt(filteredInput);
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
          this.enigmaSetting.thirdWalze.position = filteredInput;
          break;
        default:
          console.log('Could not find id'); 
          }
  
    }


   inputCharacter(key) {
    //rotate the Walzen with each input
    if (key.data === ' '){
      return key.data;
  }
    const input = key.data?.replace(/[^A-Za-z]/g, '');
    if (input === '') {
      key.target.value  = key.target.value.replace(key.data, '');
    }
    if (key.inputType === 'insertFromPaste' && typeof key.target.value !== 'undefined'){
      let encryptedText = '';
      const pastedText = key.target.value;
      for ( let i = 0; i < pastedText.length; i ++){
        if (pastedText.charAt(i) === ' '){
          encryptedText += pastedText.charAt(i);
        }
        const character = pastedText.charAt(i).replace(/[^A-Za-z]/g, '').toUpperCase();
        if (character === '' ){
          continue;
        }
        const index = this.upperCaseAlp.indexOf(character);
        const encryptedKeyIndex = this.runThroughMachine(index, this.enigmaSetting.plugboard, this.enigmaSetting.firstWalze, this.enigmaSetting.secondWalze, this.enigmaSetting.secondWalze, this.enigmaSetting.umkehrWalze);
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
      return encryptedText;

    }

  if(key.inputType === 'insertText' && input !== ''){
    const lastCharacter = input[input?.length - 1].toUpperCase();
    const index = this.upperCaseAlp.indexOf(lastCharacter);
    const encryptedKeyIndex = this.runThroughMachine(index,  this.enigmaSetting.plugboard, this.enigmaSetting.firstWalze, this.enigmaSetting.secondWalze, this.enigmaSetting.secondWalze, this.enigmaSetting.umkehrWalze);
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

    if (this.enigmaSetting.firstWalze.position >= (this.upperCaseAlp.length)) {
      this.enigmaSetting.firstWalze.position =  0;
      this.enigmaSetting.secondWalze.position += 1;
    }
    
    if (this.enigmaSetting.secondWalze.position >= (this.upperCaseAlp.length)) {
      this.enigmaSetting.secondWalze.position = 0;
      this.enigmaSetting.secondWalze.position += 1;
    }
    if (this.enigmaSetting.secondWalze.position >= (this.upperCaseAlp.length)) {
      this.enigmaSetting.secondWalze.position =  0;
    }
    this.firstWaltzeInput.value(this.enigmaSetting.firstWalze.position);
    this.secondWaltzeInput.value(this.enigmaSetting.secondWalze.position);
    this.thirdWaltzeInput.value(this.enigmaSetting.thirdWalze.position);

  }
  
   shiftIndex(index, rotatorIndex) {
    //Shift index according to the rotation of the Walze
    const shift = (index + rotatorIndex) % 26;
    return shift;
  }


  inputHtml(element, id, position, size) {
    element.id(id);
    element.position(position[0], position[1]);
    element.style('width', size[0].toString() + 'px');
    element.style('height', size[1].toString() + 'px');
    element.style('text-align','center');
    const walze_id = id;
    const inputElement = <HTMLInputElement>document.getElementById(id);
    inputElement.addEventListener('input', input => {
      this.enforcePositiveInteger(input, walze_id );
    });
  }

  saveConfig(filename) {

    //https://stackoverflow.com/questions/19706046/how-to-read-an-external-local-json-file-in-javascript credits to yordan georgiev and musicformellons
    
      const enigmaSetting = this.enigmaSetting;
      enigmaSetting['name'] = filename;
      this.downloadJsonFile(enigmaSetting, filename);

    this.mousePressedSaveButton = true;
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

    this.enigmaSetting.plugboard = this.plugBoardService.getPlugboard().length > 0 ? this.plugBoardService.getPlugboard() : this.plugboard;
    this.destroyed = false;

    const sketch = (s) => {

      s.preload = () => {
        // preload code
        this.adjustSizes(window.innerWidth * 0.95, window.innerHeight * 0.95);

        
      }

      s.setup = () => {
        this.bg = s.loadImage('../../assets/blacktexture.jpg');
        this.save_icon = s.loadImage('../../assets/save-icon.png');
        this.load_icon = s.loadImage('../../assets/load-icon.png');

        s.createCanvas(this.windowWidth, this.windowHeight);
        this.clearText = s.createElement('textarea', '');
        this.clearText.size(this.windowWidth/5, this.windowHeight/5);
        this.clearText.id('clearText');
        this.clearText.style('resize', 'none');

        const clearText = <HTMLInputElement>document.getElementById('clearText');
        this.encryptedText = s.createElement('textarea', '');
        this.encryptedText.size(this.windowWidth/5, this.windowHeight/5);
        this.encryptedText.id('encryptedText');
        this.encryptedText.attribute('disabled','');
        this.encryptedText.style('resize', 'none');
        const encryptedText = <HTMLInputElement>document.getElementById('encryptedText');

        clearText.addEventListener('input', input => {
          const encryptedKey = this.inputCharacter(input);
          if (typeof encryptedKey !== 'undefined') {
            encryptedText.value += encryptedKey;
          }
        });
        this.clearText.position(this.windowWidth/4 - this.windowWidth/5 * 0.5,  this.windowHeight/8);
        this.encryptedText.position(this.windowWidth/4 * 3 - this.windowWidth/5 * 0.5,  this.windowHeight/8);

        s.background(this.bg);
        this.plugsPoints = this.plugPointsService.createPlugPoints(this.windowWidth, this.windowHeight);
        this.highlightedKey = s.color(255,204,0);
        this.firstWaltzeInput = s.createElement('input', '');
        this.inputHtml(this.firstWaltzeInput, 'firstWaltzeInput', [this.windowWidth/4 - 11, this.windowHeight/8 * 3], [this.inputElement_width,this.inputElement_height]);
        this.firstWaltzeInput.value(this.enigmaSetting.firstWalze.position);

        this.secondWaltzeInput = s.createInput('input', '');
        this.inputHtml(this.secondWaltzeInput, 'secondWaltzeInput', [this.windowWidth/2 - 11, this.windowHeight/8 * 3], [this.inputElement_width,this.inputElement_height]);
        this.secondWaltzeInput.value(this.enigmaSetting.secondWalze.position);

        this.thirdWaltzeInput = s.createInput('');
        this.inputHtml(this.thirdWaltzeInput, 'thirdWaltzeInput', [this.windowWidth/4 * 3 - 11, this.windowHeight/8 * 3], [this.inputElement_width,this.inputElement_height]);
        this.thirdWaltzeInput.value(this.enigmaSetting.thirdWalze.position);

        this.rotorSettingsButton = s.createButton("Rotor Settings"); 
        this.rotorSettingsButton.position(this.windowWidth/2 - this.plugboardButton_width/2, this.windowHeight/3 * 0.7); 
        this.rotorSettingsButton.size(this.plugboardButton_width, this.plugboardButton_height);
        this.rotorSettingsButton.id('rotorSettingsButton');
        this.rotorSettingsButton.style('background-color', '#008CBA');
        this.rotorSettingsButton.style('border-radius', '12px');
        this.rotorSettingsButton.style('border', 'none');
        const fontsize = (this.plugboardButton_width/10).toString() + 'px';
        this.rotorSettingsButton.style('font-size', fontsize );

        document.getElementById('rotorSettingsButton').addEventListener('click', click => {
          this.openRotorSettingDialog();
        });

        this.plugboardButton = s.createButton("Plugboard"); 
        this.plugboardButton.position(this.windowWidth/2 - this.plugboardButton_width/2, this.windowHeight/3 * 0.9); 
        this.plugboardButton.size(this.plugboardButton_width, this.plugboardButton_height);
        this.plugboardButton.id('plugboardButton');
        this.plugboardButton.style('background-color', '#008CBA');
        this.plugboardButton.style('border-radius', '12px');
        this.plugboardButton.style('border', 'none');
        this.plugboardButton.style('font-size', fontsize );

        document.getElementById('plugboardButton').addEventListener('click', click => {
          this.navigateToPlugboard();
        });

      };


//https://tutorial.eyehunts.com/html/html-textarea-input-placeholder-value-resize-readonly/

      s.draw = () => {

        if (this.windowSizeChanged) {

          
          s.resizeCanvas(this.windowWidth, this.windowHeight);
          this.adjustSizes(this.windowWidth, this.windowHeight);
          
          this.plugsPoints = this.plugPointsService.createPlugPoints(this.windowWidth, this.windowHeight);
          this.clearText.position(this.windowWidth/4 - this.windowWidth/5 * 0.5, this.windowHeight/8);
          this.encryptedText.position(this.windowWidth/4 * 3 - this.windowWidth/5 * 0.5, this.windowHeight/8);
  


          this.encryptedText.size(this.windowWidth/5, this.windowHeight/5);
          this.clearText.size(this.windowWidth/5, this.windowHeight/5);
          const fontsize = (this.plugboardButton_width/10).toString() + 'px';
          
          this.rotorSettingsButton.style('font-size', fontsize );
          this.rotorSettingsButton.size(this.plugboardButton_width, this.plugboardButton_height);
          this.rotorSettingsButton.position(this.windowWidth/2 - this.plugboardButton_width/2, this.windowHeight/3 * 0.7); 

          this.plugboardButton.style('font-size', fontsize );
          this.plugboardButton.size(this.plugboardButton_width, this.plugboardButton_height);
          this.plugboardButton.position(this.windowWidth/2 - this.plugboardButton_width/2, this.windowHeight/3 * 0.9); 

          // this.firstWaltzeInput.position(this.windowWidth/4 - this.inputElement_width/2, this.windowHeight/8 * 3);
          this.firstWaltzeInput.position(this.windowWidth/4  - 11, this.windowHeight/8 * 3);
          this.secondWaltzeInput.position(this.windowWidth/2 - 11,  this.windowHeight/8 * 3);
          this.thirdWaltzeInput.position(this.windowWidth/4 * 3 - 11,  this.windowHeight/8 * 3);

          // this.firstWaltzeInput.size(this.inputElement_width, this.inputElement_height);
          // this.secondWaltzeInput.size(this.inputElement_width, this.inputElement_height);
          // this.thirdWaltzeInput.size(this.inputElement_width, this.inputElement_height);

          this.windowSizeChanged = false;
        }
          if (this.destroyed){
          s.remove();
        }

        s.background(this.bg);
        s.push();
        s.image(this.save_icon, this.save_icon_x, this.save_icon_y, this.save_icon_width, this.save_icon_height);
        s.pop();
        s.push();
        s.image(this.load_icon, this.load_icon_x, this.load_icon_y, this.load_icon_width, this.load_icon_height);
        s.pop();
        this.drawPlugPoints(s, this.windowWidth, this.windowHeight);
        if (s.mouseIsPressed){
          this.checkSaveButton(s.mouseX, s.mouseY);
          this.checkLoadButton(s.mouseX, s.mouseY);
        }

        s.fill(255);
        const textsize = this.windowWidth/50 > this.windowHeight/40 ? this.windowHeight/40 : this.windowWidth/50;
        s.textSize(textsize);
        s.textAlign(s.CENTER, s.CENTER);
        s.text(this.enigmaSetting.firstWalze.name, this.windowWidth/4  , this.windowHeight/8 * 3 * 0.95);
        s.text(this.enigmaSetting.secondWalze.name, this.windowWidth/2 , this.windowHeight/8 * 3 * 0.95);
        s.text(this.enigmaSetting.thirdWalze.name, this.windowWidth/4 * 3 , this.windowHeight/8 * 3 * 0.95);
        
      };



      
    }

    let canvas = new p5(sketch);
  }

  adjustSizes(windowWidth, windowHeight) {
    this.windowHeight = windowHeight;
    this.windowWidth = windowWidth;

    let ratio = this.windowWidth/25 > this.windowHeight/25 ? this.windowWidth/25 : this.windowHeight/25;
    this.save_icon_width = ratio;
    this.save_icon_height = ratio;
    this.load_icon_width = ratio * 0.8;
    this.load_icon_height = ratio * 0.8;
    this.save_icon_x = this.windowWidth/2 - this.save_icon_width * 1.25;
    this.save_icon_y = this.windowHeight/20;
    this.load_icon_x = this.windowWidth/2 + this.load_icon_width * 0.25;
    this.load_icon_y = this.windowHeight/20 + ratio * 0.11;
    this.plugboardButton_height = this.windowHeight/40;
    this.plugboardButton_width = this.windowWidth/10;

    // this.inputElement_height = this.windowHeight/45;
    // this.inputElement_width = this.windowWidth/100;
    this.inputElement_height = 14;
    this.inputElement_width = 14;

  }

drawPlugPoints(sketch, windowWidth, windowHeight) {
  
  const ellipseWidth = Math.round(windowWidth/15);
  const ellipseHeight = Math.round(windowHeight/10);
  const radius = ellipseHeight > ellipseWidth ? ellipseWidth : ellipseHeight;
  const fontSize = Math.round(radius/3);
  for (let i = 0; i < this.plugsPoints.length; i++){
    const plugPoint = this.plugsPoints[i];
    sketch.stroke(255);
    sketch.textAlign(sketch.CENTER, sketch.CENTER);
    sketch.textSize(fontSize);
    if (this.plugsPoints[i].light){
      sketch.fill(this.highlightedKey);      
    }
    else {
      sketch.fill(255,255,255);
    }

    sketch.ellipse(plugPoint.x, plugPoint.y, radius, radius);
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

@HostListener('window:resize', ['$event'])
onResize(event){
  this.windowWidth = event.target.innerWidth * 0.95;
  this.windowHeight = event.target.innerHeight * 0.95;
  this.windowSizeChanged = true;
}



highlightkey(index, pressed, previousIndex) {
  if (pressed && typeof index !== 'undefined') {

    this.plugsPoints[index].light = true;
    const previousPlugPoint = this.plugsPoints[previousIndex]; 
    if (typeof previousPlugPoint !== 'undefined' && previousIndex !== index) {
      previousPlugPoint.light = false;
    }
  }
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
    this.openLoadDialog();

}

}

openSaveDialog(): void {
  if (!this.mousePressedRotorSettingsButton && !this.mousePressedSaveButton && !this.mousePressedLoadButton){
    this.mousePressedSaveButton = true;  
    let dialogRef = this.dialog.open(SaveconfigDialogComponent, {
      width: '250px',
      data: { name: "setting"  }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveConfig(result.name);
      }
      this.mousePressedSaveButton = false;  
    });
  
  }
}


openLoadDialog(): void {
  if (!this.mousePressedRotorSettingsButton && !this.mousePressedSaveButton && !this.mousePressedLoadButton){
    this.mousePressedLoadButton = true;
    let dialogRef = this.dialog.open(LoadconfigDialogComponent, {
      width: '280px',
      data: {  }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      this.mousePressedLoadButton = false;
      if (result) {
        if (Object.entries(result).length !== 0) {
          const settings = result;
          this.enigmaSetting = settings;
          this.firstWaltzeInput.value(this.enigmaSetting.firstWalze.position);
          this.secondWaltzeInput.value(this.enigmaSetting.secondWalze.position);
          this.thirdWaltzeInput.value(this.enigmaSetting.thirdWalze.position);  

          this.plugBoardService.setPlugboard(settings.plugboard);
        }
      }
    });


    
  
  }
}

openRotorSettingDialog(): void {
    if (!this.mousePressedRotorSettingsButton && !this.mousePressedSaveButton && !this.mousePressedLoadButton){
      this.mousePressedRotorSettingsButton = true;
    let dialogRef = this.dialog.open(RotorSettingsDialogComponent, {
      width: '250px',
      data: { 
        firstWalze: this.enigmaSetting.firstWalze.name,
        secondWalze: this.enigmaSetting.secondWalze.name,
        thirdWalze: this.enigmaSetting.thirdWalze.name,
       }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      this.mousePressedRotorSettingsButton = false;
      if (result) {
        if (Object.entries(result).length !== 0) {
          let Walze = this.changeRotorsOfEnigma(result.firstWalze);
          this.enigmaSetting.firstWalze = typeof Walze !== 'undefined' ? Walze : this.enigmaSetting.firstWalze;

          Walze = this.changeRotorsOfEnigma(result.secondWalze);
          this.enigmaSetting.secondWalze = typeof Walze !== 'undefined' ? Walze : this.enigmaSetting.secondWalze;

          Walze = this.changeRotorsOfEnigma(result.thirdWalze);
          this.enigmaSetting.thirdWalze = typeof Walze !== 'undefined' ? Walze : this.enigmaSetting.thirdWalze;
        }
      }
    });  
  }
}

changeRotorsOfEnigma(name){

  switch(name) {
    case 'I':
      return this.firstWalzenRotor;
    case 'II':
      return this.secondWalzenRotor;
    case 'III':
      return this.thirdWalzenRotor;
    case 'IV':
      return this.fourthWalzenRotor;
    case 'V':
      return this.fifthWalzenRotor;
    default:
      return;
    }
}

navigateToPlugboard(){
  this.destroyed = true;
  this.router.navigate(['plugboard']);

}

}
