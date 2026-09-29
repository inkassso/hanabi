import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GameComponent } from './game/game.component';
import { ToastContainerComponent } from './toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  imports: [GameComponent, ToastContainerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
}
