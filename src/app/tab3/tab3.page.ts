import { Component } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  photos: { name: string, data: string }[] = [];
  selectedPhoto: { name: string, data: string } | null = null;

  constructor() {}
  //Initialization
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
      const displayName = this.formatDateFromFileName(savedFile.uri);

      this.photos.push({ name: displayName, data: `data:image/jpeg;base64,${savedFile.data}` });
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

        this.photos.push({ name: displayName, data: `data:image/jpeg;base64,${photoInfo.data}` });
      }
    } catch (error) {
      console.error('Error loading photos', error);
    }
  }

  // Helper method to format a filename into a human-readable date string
  formatDateFromFileName(fileName: string): string {
    const timestamp = fileName.replace('photo_', '').replace('.jpeg', '');
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString();
  }

  // Method to display a selected photo
  showPhoto(photo: { name: string, data: string }) {
    this.selectedPhoto = photo;
  }

  // Method to close the photo display
  closePhoto() {
    this.selectedPhoto = null;
  }
}
