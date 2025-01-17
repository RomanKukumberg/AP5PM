import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { ModalController } from '@ionic/angular';
import { PhotoModalComponent } from '../photo-modal/photo-modal.component';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush  // Add OnPush change detection strategy
})
export class Tab3Page {
  photos: { name: string, data: string }[] = [];
  selectedPhoto: { name: string, data: string } | null = null;

  constructor(private modalController: ModalController, private cdr: ChangeDetectorRef) {}

  // Initialization
  async ngOnInit() {
    await this.loadPhotos();
  }

  // Method to capture a new photo using the device camera
  async takePhoto() {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });
  
      const savedFile = await this.savePhoto(photo);
  
      const photoInfo = await Filesystem.readFile({
        path: savedFile.uri,
        directory: Directory.Data
      });
  
      const displayName = this.formatDateFromFileName(savedFile.uri);
  
      // Pridaj fotku do zoznamu
      this.photos.push({ name: displayName, data: `data:image/jpeg;base64,${photoInfo.data}` });
  
      // Spusti detekciu zmien
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error taking photo', error);
    }
  }

  // Method to save a photo to the filesystem
  async savePhoto(photo: any) {
    const fileName = `photo_${new Date().getTime()}.jpeg`;
    const photoUri = photo.webPath;

    const response = await fetch(photoUri);
    const blob = await response.blob();

    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: await this.convertBlobToBase64(blob),
      directory: Directory.Data,
    });

    return { uri: fileName, data: savedFile };
  }

  // Helper method to convert a Blob object to a base64 string
  convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  // Method to load photos from the filesystem
  async loadPhotos() {
    try {
      const savedPhotos = await Filesystem.readdir({
        directory: Directory.Data,
        path: ''
      });
  
      for (const photo of savedPhotos.files) {
        const photoInfo = await Filesystem.readFile({
          path: photo.name,
          directory: Directory.Data
        });
  
        const displayName = this.formatDateFromFileName(photo.name);
  
        if (displayName !== 'Invalid Date') {
          this.photos.push({ name: displayName, data: `data:image/jpeg;base64,${photoInfo.data}` });
        }
      }
  
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Error loading photos', error);
    }
  }

  // Helper method to format a filename into a human-readable date string
  formatDateFromFileName(fileName: string): string {
    const timestampString = fileName.replace('photo_', '').replace('.jpeg', '');
    const timestamp = parseInt(timestampString);
  
    // Check if the timestamp is valid
    if (isNaN(timestamp)) {
      return 'Invalid Date';
    }
  
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
  
    return date.toLocaleString();
  }

  // Method to display a selected photo
  async showPhoto(photo: { name: string, data: string }) {
    const modal = await this.modalController.create({
      component: PhotoModalComponent,
      componentProps: { photo: photo }
    });
    return await modal.present();
  }

  // Method to close the photo display
  closePhoto() {
    this.selectedPhoto = null;
  }
}
