import { importProvidersFrom, provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { checkCircle, gripHorizontal, NgxBootstrapIconsModule, plusSquareDotted, xLg } from 'ngx-bootstrap-icons';
import { AppComponent } from './app/app.component';

const icons = {
  checkCircle,
  xLg,
  gripHorizontal,
  plusSquareDotted
};

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideAnimationsAsync(),
    importProvidersFrom(NgxBootstrapIconsModule.pick(icons))
  ]
})
  .catch(err => console.error(err));
