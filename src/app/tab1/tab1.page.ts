import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight: number;
}

interface Training {
  name: string;
  date: string;
  exercises: Exercise[];
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  training: Training = {
    name: '',
    date: '',
    exercises: [],
  };

  newExercise: Exercise = {
    name: '',
    sets: 0,
    reps: 0,
    weight: 0,
  };
  
  constructor(private storage: Storage) {}

  //Initialization
  async ngOnInit() {
    await this.storage.create();
  }

  // Add exercise
  addExercise() {
    if (
      this.newExercise.name &&
      this.newExercise.sets !== null &&
      this.newExercise.reps !== null &&
      this.newExercise.weight !== null
    ) {
      this.training.exercises.push({ ...this.newExercise });

      this.newExercise = { name: '', sets: 0, reps: 0, weight: 0 };
    } else {
      alert('Add all details about exercise!');
    }
  }

  // Remove excercise
  removeExercise(index: number) {
    this.training.exercises.splice(index, 1);
  }

  // Save to Ionic Storage
  async saveTraining() {
    if (this.training.name && this.training.date && this.training.exercises.length > 0) {
      const storedTrainings: Training[] = (await this.storage.get('trainings')) || [];

      storedTrainings.push(this.training);

      await this.storage.set('trainings', storedTrainings);

      this.training = { name: '', date: '', exercises: [] };

      console.log('Saved');
    } else {
      console.log('Not saved');
    }
  }
}
