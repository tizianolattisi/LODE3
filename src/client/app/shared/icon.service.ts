import {Injectable} from '@angular/core';
import {MdIconRegistry} from '@angular/material';
import {DomSanitizer} from '@angular/platform-browser';

@Injectable()
export class IconService {
  constructor(mdIconRegistry: MdIconRegistry, sanitizer: DomSanitizer) {
    mdIconRegistry.addSvgIconSet(sanitizer.bypassSecurityTrustResourceUrl('/assets/icons/mdi-icons.svg'));
  }

  init() {

  }
}
