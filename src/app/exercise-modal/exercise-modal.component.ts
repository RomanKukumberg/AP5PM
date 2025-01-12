import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

interface Exercise {
  name: string;
  sets: string;
  reps: string;
  weight: string;
}

@Component({
  selector: 'app-exercise-modal',
  templateUrl: './exercise-modal.component.html',
  styleUrls: ['./exercise-modal.component.scss'],
})
export class ExerciseModalComponent {
  @Input() exercises: Exercise[] = [];

  constructor(private modalController: ModalController) {}

  // Zavrie modal
  closeModal() {
    this.modalController.dismiss();
  }
}
