import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EnigmaCharacter } from '../enigma-character';

@Component({
  selector: 'app-enigma',
  templateUrl: './enigma.component.html',
  styleUrls: ['./enigma.component.scss']
})
export class EnigmaComponent implements OnInit {
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
  firstWalze = 10;
  secondWalze = 4;
  thirdWalze = 20;
  changeLetter: number;
  index: number;
  enigmaCharacter = {
    character: String,
    light: Boolean,
  }
  keypressed : boolean;
  keyAlreadyPressed = false;
  firstRow = ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P'];
  secondRow = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L']; 
  thirdRow = ['Y', 'X', 'C', 'V', 'B', 'N', 'M'];
  keyboardLayout = ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P',
    'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L',
    'Y', 'X', 'C', 'V', 'B', 'N', 'M'];
  enigmaKeyboardLayout = [];

  // firstWalzeSetting = new FormControl(this.firstWalze, [Validators.required]);
  // secondWalzeSetting = new FormControl(this.secondWalze, [Validators.required]);
  // thirdWalzeSetting = new FormControl(this.thirdWalze, [Validators.required]);
  
  WalzenSetting: FormGroup = new FormGroup({
    firstWalzeSetting: new FormControl(this.firstWalze, [Validators.required]),
    secondWalzeSetting: new FormControl(this.secondWalze, [Validators.required]),
    thirdWalzeSetting: new FormControl(this.thirdWalze, [Validators.required]),
  });  
  constructor() { }

  ngOnInit() {
    this.WalzenSetting.get("firstWalzeSetting").valueChanges.subscribe(val => {
      this.firstWalze = val;
    });
    this.WalzenSetting.get("secondWalzeSetting").valueChanges.subscribe(val => {
      this.secondWalze = val;
    });
    this.WalzenSetting.get("thirdWalzeSetting").valueChanges.subscribe(val => {
      this.thirdWalze = val;
    });

    this.keyboardLayout.forEach(character => {
      const element = new EnigmaCharacter;
      element.character = character;
      element.light = false;
      this.enigmaKeyboardLayout.push(element);
    });    
    // enigmaKeyboardLayout =  define class with boolean (light or not) => {character, light(boolean)}
  }

  inputCharacter(input) {
    //rotate the Walzen with each input
    if(!this.keyAlreadyPressed){
      const lastCharacter = input[input.length - 1].toUpperCase();
      this.encyrptMessage(lastCharacter);
      this.rotateWalzen();  
    }
  }


  encyrptMessage(character) {
    //Get index of the given character
    const index = this.upperCaseAlp.indexOf(character);
    //First Way
    const oneWay = this.encryptCharacterBothWays(index, this.firstWaltzePermutation, this.secondWaltzePermutation,
      this.thirdWaltzePermutation, this.umkehrWalzePermutation, false);
    //Way back
    // const wayBack = this.encryptCharacterBothWays(oneWay, this.firstWaltzePermutation, this.secondWaltzePermutation,
    //   this.thirdWaltzePermutation, this.umkehrWalzePermutation, true);
    if (oneWay === -1) {
      console.log('ONEWAY' + oneWay);
    }
    const wayBack = this.encryptCharacterBothWays(oneWay, this.thirdWaltzePermutation, this.secondWaltzePermutation,
      this.firstWaltzePermutation, this.umkehrWalzePermutation, true);
      
    console.log(wayBack);

  }

  rotateWalzen() {
    this.firstWalze += 1;
    if (this.firstWalze >= (this.upperCaseAlp.length - 1)) {
      this.firstWalze -= (this.upperCaseAlp.length - 1);
      console.log('firstWalze ' + this.firstWalze);
      this.secondWalze += 1;
    }
    if (this.secondWalze >= (this.upperCaseAlp.length - 1)) {
      this.secondWalze -= (this.upperCaseAlp.length - 1);
      this.thirdWalze += 1;
    }
    if (this.thirdWalze >= (this.upperCaseAlp.length - 1)) {
      this.thirdWalze -= (this.upperCaseAlp.length - 1);
    }

  }

  shiftIndex(index, rotatorIndex) {
    //Shift index according to the rotation of the Walze
    const shift = (this.lowerAlph.length - 1) - (rotatorIndex + index) <= 0 ? (rotatorIndex + index) - (this.lowerAlph.length - 1) : (rotatorIndex + index);
    const test = rotatorIndex + index;
    if (shift === -1) {
      console.log('index' +  index);
      console.log('rotatorIndex' +  rotatorIndex);
    }
    // console.log('index rotatorIndex' +  test);
    // console.log('shift' + shift);
    return shift;
  }

  encryptCharacterBothWays(firstCharacterIndex, firstWalze, secondWalze, thirdWalze, umkehrWalze, wayBack) {
    //You have to differentiate between going from the keyboard to the Umkehrwalze and the other way around
    //Shift Character according to the rotation
    if (!wayBack){
      firstCharacterIndex = this.shiftIndex(firstCharacterIndex, this.firstWalze);
    }
    //Get character[number] of the first Waltze at the given index
    const firstWaltzeCharacter = firstWalze[firstCharacterIndex];
    //Get character of the first Waltze according to the alphabet
    let firstWaltzeIndex = this.upperCaseAlpNumbers[firstWaltzeCharacter];

    //Shift Character according to the rotation
    firstWaltzeIndex = this.shiftIndex(firstWaltzeIndex, this.secondWalze);

    //Get character[number] of the second Waltze at the given index
    const secondWaltzeCharacter = secondWalze[firstWaltzeIndex];
    //Get character of the second Waltze according to the alphabet
    let secondWaltzeIndex = this.upperCaseAlpNumbers[secondWaltzeCharacter];
    //Get character[number] of the third Waltze at the given index

    //Shift Character according to the rotation
    secondWaltzeIndex = this.shiftIndex(secondWaltzeIndex, this.thirdWalze);

    const thirdWaltzeCharacter = thirdWalze[secondWaltzeIndex];
    //Get character of the third Waltze according to the alphabet
    const thirdWaltzeIndex = this.upperCaseAlpNumbers[thirdWaltzeCharacter];
    // console.log(thirdWaltzeIndex);
    //Check if way back, if not use Umkehrwalze
    if (!wayBack) {
      //Get character of the Umkehrwaltze at the given index
      const UmkehrWaltzeCharacter = umkehrWalze[thirdWaltzeIndex];
      //Get character of the Umkehrwaltze at the given index
      const UmkehrWaltzeIndex = this.upperCaseAlpNumbers[UmkehrWaltzeCharacter];
      return UmkehrWaltzeIndex;
    }
    //Get final character from the alphabet
    const encryptedCharacter = this.upperCaseAlp[thirdWaltzeIndex];
    // this.enigmaKeyboardLayout[thirdWaltzeIndex].light = true;
    this.index  = thirdWaltzeIndex;
    if(this.index === undefined){
      console.log(this.firstWalze);
      console.log(this.secondWalze);
      console.log(this.thirdWalze);
    }
    this.higlightkey(this.index, this.keypressed);
    this.keyAlreadyPressed = true;
    return encryptedCharacter;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEventDown() {
    this.keypressed = true;
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyboardEventUp() {
    this.keypressed = false;
    this.keyAlreadyPressed = false;
    this.higlightkey(this.index, this.keypressed);
  }

  higlightkey(index, pressed) {
    if (pressed && index) {
      this.enigmaKeyboardLayout[index].light = true;
    }
    if (!pressed && index){
      this.enigmaKeyboardLayout[index].light = false;
    }
  }



}

