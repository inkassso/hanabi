import { importProvidersFrom, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { checkCircle, gripHorizontal, NgxBootstrapIconsModule, plusSquareDotted, xLg } from 'ngx-bootstrap-icons';

const icons = {
  checkCircle,
  xLg,
  gripHorizontal,
  plusSquareDotted
};

export default [
  provideZonelessChangeDetection(),
  provideAnimationsAsync(),
  importProvidersFrom(NgxBootstrapIconsModule.pick(icons))
];
