import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { GameComponent } from './game/game.component';
import { CardComponent } from './card/card.component';
import { PlayerHandComponent } from './player-hand/player-hand.component';


@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    BoardComponent,
    CardComponent,
    PlayerHandComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    NgbModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
