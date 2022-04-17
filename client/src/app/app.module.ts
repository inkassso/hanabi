import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { checkCircle, NgxBootstrapIconsModule, xLg } from 'ngx-bootstrap-icons';
import { ToastrModule } from 'ngx-toastr';
import { AppComponent } from './app.component';
import { CardComponent } from './card/card.component';
import { FireworkBoardComponent } from './firework-board/firework-board.component';
import { GameComponent } from './game/game.component';
import { PlayerBoardComponent } from './player-board/player-board.component';
import { PlayerHandComponent } from './player-hand/player-hand.component';
import { SetupPlayerNamesComponent } from './setup-player-names/setup-player-names.setup.component';
import { SetupComponent } from './setup/setup.component';

const icons = {
  checkCircle,
  xLg
};

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    FireworkBoardComponent,
    CardComponent,
    PlayerHandComponent,
    PlayerBoardComponent,
    SetupPlayerNamesComponent,
    SetupComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    NgbModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    NgxBootstrapIconsModule.pick(icons),
    ReactiveFormsModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
