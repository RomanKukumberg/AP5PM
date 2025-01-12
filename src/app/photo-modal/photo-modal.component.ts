import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-photo-modal',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ photo.name }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="close()">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-img [src]="photo.data"></ion-img>
    </ion-content>
  `
})
export class PhotoModalComponent {
  @Input() photo!: { name: string, data: string };

  constructor(private modalController: ModalController) {}

  close() {
    this.modalController.dismiss();
  }
}
