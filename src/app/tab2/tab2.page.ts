  import { Component } from '@angular/core';
  import { Storage } from '@ionic/storage-angular';
  import { AlertController, ModalController } from '@ionic/angular'; // Pridaný ModalController
  import { ExerciseModalComponent } from '../exercise-modal/exercise-modal.component'; // Import komponentu modálneho okna

  interface Exercise {
    name: string;
    sets: string;
    reps: string;
    weight: string;
  }

  interface Training {
    name: string;
    date: string;
    exercises: Exercise[];
  }

  @Component({
    selector: 'app-tab2',
    templateUrl: './tab2.page.html',
    styleUrls: ['./tab2.page.scss'],
  })
  export class Tab2Page {
    savedTrainings: Training[] = [];

    constructor(
      private storage: Storage, 
      private alertController: AlertController, 
      private modalController: ModalController  // Inject ModalController
    ) {}

    // Initialization
    async ngOnInit() {
      await this.storage.create();
      await this.loadTrainings();
    }

    // Trainings list refresh
    async ionViewWillEnter() {
      await this.loadTrainings();
    }

    // Load saved trainings from Ionic Storage
    async loadTrainings() {
      const savedTrainings = await this.storage.get('trainings');
      this.savedTrainings = savedTrainings || [];
    }

    // Show modal with exercises for a selected training
    async showExercises(training: Training) {
      const modal = await this.modalController.create({
        component: ExerciseModalComponent, // Komponent na zobrazenie cvičení
        componentProps: { exercises: training.exercises }, // Odovzdanie cvičení do modálneho okna
      });

      await modal.present();
    }

    // Remove a specific training
    async removeTraining(index: number) {
      const confirmation = await this.showConfirmDeleteAlert();
      if (confirmation) {
        this.savedTrainings.splice(index, 1);
        await this.storage.set('trainings', this.savedTrainings);
        console.log('Training removed.');
      } else {
        console.log('Training removal cancelled.');
      }
    }

    // Clear all saved trainings from Ionic Storage
    async clearTrainings() {
      const confirmation = await this.showConfirmDeleteAlert(true);
      if (confirmation) {
        await this.storage.remove('trainings');
        this.savedTrainings = [];
        console.log('All trainings cleared.');
      } else {
        console.log('Clear all trainings cancelled.');
      }
    }

    // Show confirmation alert
    async showConfirmDeleteAlert(clearAll: boolean = false): Promise<boolean> {
      const alert = await this.alertController.create({
        header: clearAll ? 'Clear All Trainings' : 'Delete Training',
        message: clearAll
          ? 'Are you sure you want to clear all saved trainings?'
          : 'Are you sure you want to delete this training?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
          },
          {
            text: 'Yes',
            role: 'confirm',
          },
        ],
      });

      await alert.present();

      const result = await alert.onWillDismiss();
      return result.role === 'confirm';
    }
  }
