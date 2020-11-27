import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EnigmaPlugboardComponent } from './enigma-plugboard/enigma-plugboard.component';
import { RouterModule, Routes } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import { KeyboardComponent } from './keyboard/keyboard.component';
import { LoadconfigDialogComponent } from './loadconfig-dialog/loadconfig-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { SaveconfigDialogComponent } from './saveconfig-dialog/saveconfig-dialog.component';
import { RotorSettingsDialogComponent } from './rotor-settings-dialog/rotor-settings-dialog.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
// const routes: Routes = [  { path: '', component: EnigmaComponent },
// { path: 'plugboard', component: EnigmaPlugboardComponent },]

const routes: Routes = [  { path: '', component: KeyboardComponent },
{ path: 'plugboard', component: EnigmaPlugboardComponent },]

@NgModule({
  declarations: [
    AppComponent,
    EnigmaPlugboardComponent,
    KeyboardComponent,
    LoadconfigDialogComponent,
    SaveconfigDialogComponent,
    RotorSettingsDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    MatIconModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatOptionModule,
    MatSelectModule
    
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [LoadconfigDialogComponent]
})
export class AppModule { }
