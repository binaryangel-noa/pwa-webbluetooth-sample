import { Component } from '@angular/core';
declare var TextDecoder: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public title = 'app';
  public outputvalue = '';
  public lastupdate = null;
  public service = 'user_data';
  public characteristic = 'first_name';

  constructor() {
  }
  public connect() {
    var self = this;
    var nav: any = navigator;
    if (nav.bluetooth && nav.bluetooth.requestDevice) {
      nav.bluetooth.requestDevice({ filters: [{ services: [self.service] }] })
        .then(device => {
          console.log("requestDevice", device);
          /* ... */
          console.log("device name", device.name);
          return device.gatt.connect();
        })
        .then(server => {
          console.log("server", server);
          // Getting Battery Service...
          return server.getPrimaryService(self.service);
        })
        .then(service => {
          console.log("service", service);
          // Getting Characteristic...
          return service.getCharacteristic(self.characteristic);
        }).then(characteristic => {
          console.log("characteristic", characteristic);
          // Reading Battery Level...
          return characteristic.readValue();
        })
        .then(value => {
          console.log("value", value);
          let decoder = new TextDecoder('utf-8');
          let name = decoder.decode(value)
          this.outputvalue = name;
          this.lastupdate = new Date().toJSON();
          console.log('value is ' + name);
        })
        .catch(error => { console.log("webbluetooth error", error); });

    }

  }
}
