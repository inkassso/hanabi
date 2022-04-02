import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { allIcons, NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { CardComponent } from './card/card.component';
import { GameComponent } from './game/game.component';
import { PlayerBoardComponent } from './player-board/player-board.component';
import { PlayerHandComponent } from './player-hand/player-hand.component';


@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    BoardComponent,
    CardComponent,
    PlayerHandComponent,
    PlayerBoardComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    NgbModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    NgxBootstrapIconsModule.pick(allIcons)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
