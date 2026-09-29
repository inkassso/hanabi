import { importProvidersFrom, provideZonelessChangeDetection } from '@angular/core';
import { checkCircle, gripHorizontal, NgxBootstrapIconsModule, plusSquareDotted, xLg } from 'ngx-bootstrap-icons';

const icons = {
  checkCircle,
  xLg,
  gripHorizontal,
  plusSquareDotted
};

export default [
  provideZonelessChangeDetection(),
  importProvidersFrom(NgxBootstrapIconsModule.pick(icons))
];
