# Stackblitz

Run Enigma on Stackblitz: https://stackblitz.com/github/AndreasFrenk/enigma_v2

# Enigma

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.2.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## Project description

This project is meant to be a copy of the Enigma machine used by the Germans during World War II. It was an encryption device that allowed secret communication. 

<a href="https://github.com/kryptoguy/enigma_v2/blob/main/images/enigma.jpg"><img src="https://github.com/kryptoguy/enigma_v2/blob/main/images/enigma.jpg" align="center" height="380" width="580" ></a>

The basic idea was that before you type your secret message you would determine the setting. There are three rotors that can be configured. There were five rotors to choose from. 
The order of the rotors could be altered as well. Each time a key was pressed one rotor rotated. Thus, the same key would result into different encryption. I.e. "AA" would be encrypted to "GE". This enhanced the security. Once one rotator made a whole revolution the next rotator rotated once. This system is similiar to the hands of a clock.

<a href="https://github.com/kryptoguy/enigma_v2/blob/main/images/enigma-rotors.jpg"><img src="https://github.com/kryptoguy/enigma_v2/blob/main/images/enigma-rotors.jpg" align="center" height="320" width="580" ></a>

Furthermore, there was a plugboard that swapped letters. Each letter could only have one connection to another letter. The connections could be configured as well.

<a href="https://github.com/kryptoguy/enigma_v2/blob/main/images/enigma-plugboard.jpg"><img src="https://github.com/kryptoguy/enigma_v2/blob/main/images/enigma-plugboard.jpg" align="center" height="380" width="580" ></a>

Pictures from https://en.wikipedia.org/wiki/Enigma_machine && https://pixabay.com/photos/enigma-encryption-cryptologic-army-883925/. 
(https://en.wikipedia.org/wiki/File:Enigma-plugboard.jpg)
(https://en.wikipedia.org/wiki/File:Enigma_rotors_with_alphabet_rings.jpg)

## How To Use


<a href="https://github.com/kryptoguy/enigma_v2/blob/main/images/enigma-how-to-use_v2.PNG"><img src="https://github.com/kryptoguy/enigma_v2/blob/main/images/Enigma-how-to-use_v2.PNG" align="center" height="380" width="680" ></a>

1. 1 & 2 & 3 Rotor Setting. 4 Change Order of Rotors
2. 5 Navigate to Plugboard
4. 6 Save Current Settings & 7 Upload Settings
5. 8 Clear Text & 9 Encrypted Text


<a href="https://github.com/kryptoguy/enigma_v2/blob/main/images/enigma-plugboard-how-to-use_v2.PNG"><img src="https://github.com/kryptoguy/enigma_v2/blob/main/images/enigma-plugboard-how-to-use.PNG" align="center" height="380" width="680" ></a>

1. Drag Connections Here to Delete Them
2. Add Connections (only possible if there are free letters)
3. Change Connections
4. Navigate Back to Keyboard

## IMPORTANT
Before you encrypt or decrypt a message, make sure to save or load the right setting. Otherwise, the machine will not work. You can also paste a whole a text into
the input box. Note that the input is restricted to letters. In order to make the text more readable you can add spaces. Spaces will not be encrypted nor decrypted.
If you want to upload settings make sure it is in the right format. You can download your current setting. This will be in a json format. 

## Summary
Encryption:
1. Configure the settings
2. Download the settings (or write them down)
3. Type in your secret message
4. Share your settings and your secret message

Decryption:
1. Upload the settings (or configure it yourself)
2. Type in the decrypted message (or just copy and paste it)
3. Read the secret message
