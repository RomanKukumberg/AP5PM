import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { DatePipe } from '@angular/common';

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
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  providers: [DatePipe],
})
export class Tab1Page {
  training: Training = {
    name: '',
    date: '',
    exercises: [],
  };

  newExercise: Exercise = {
    name: '',
    sets: '',
    reps: '',
    weight: '',
  };
  
  constructor(private storage: Storage, private datePipe: DatePipe) {}

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

      this.newExercise = { name: '', sets: '', reps: '', weight: '' };
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
      // Format the date to 'yyyy-MM-dd' using DatePipe
      this.training.date = this.datePipe.transform(this.training.date, 'yyyy-MM-dd') || '';

      const storedTrainings: Training[] = (await this.storage.get('trainings')) || [];

      storedTrainings.push(this.training);

      await this.storage.set('trainings', storedTrainings);

      // Reset the training object
      this.training = { name: '', date: '', exercises: [] };

      console.log('Saved');
    } else {
      console.log('Not saved: Please fill out all fields.');
    }
  }
}
