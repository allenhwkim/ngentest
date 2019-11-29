import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-switch-off-services-error',
  templateUrl: './switch-off-services-error.component.html',
  styleUrls: ['./switch-off-services-error.component.scss']
})
export class SwitchOffServicesErrorComponent {

 @Output('navigateToWireless') navigateToWireless = new EventEmitter();

}
