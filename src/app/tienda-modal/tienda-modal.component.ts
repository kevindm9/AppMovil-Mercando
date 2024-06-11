import { Component } from '@angular/core';
import { IonModal, IonToolbar, IonItem, IonButtons, IonButton, IonTitle, IonContent, IonHeader, IonInput } from "@ionic/angular/standalone";
import {
  getDatabase,
  set,
  ref,
  get,
  update,
  remove,
  onValue,
  push,
} from 'firebase/database';
import { FormsModule } from '@angular/forms';
import { initializeApp } from 'firebase/app';
import { ModalController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
const firebaseConfig = {
  apiKey: 'AIzaSyDDMug9P84piMPp1NlHvQ_BNaLY5fOsimQ',
  authDomain: 'mercando-89b88.firebaseapp.com',
  databaseURL: 'https://mercando-89b88-default-rtdb.firebaseio.com',
  projectId: 'mercando-89b88',
  storageBucket: 'mercando-89b88.appspot.com',
  messagingSenderId: '105571052473',
  appId: '1:105571052473:web:bc676e4f4dc39709126468',
};

@Component({
  selector: 'app-tienda-modal',
  templateUrl: './tienda-modal.component.html',
  styleUrls: ['./tienda-modal.component.scss'],
  standalone: true,
  imports: [
    IonInput,
    IonItem,
    IonModal,
    IonButton,
    IonButtons,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    FormsModule,
  ],
})
export class TiendaModalComponent   {

  app = initializeApp(firebaseConfig);
  db = getDatabase(this.app);

  nuevaTienda: { nombre: string } = { nombre: '' };


  constructor(private modalCtrl: ModalController, private toastController: ToastController) { }

    //Adicionar una Tienda
    addTienda() {
      const tiendaName = this.nuevaTienda.nombre; // Assuming 'nuevaTienda' holds the new store data
  
      if (!tiendaName) {
        this.showToast("El nombre de la tienda no puede estar vacío", 'warning');
        return;
      }
  
      const tiendaRef = ref(this.db, 'Tienda'); // Assuming 'Tiendas' is the node for stores
  
      // Push the new store data to Firebase
      set(push(tiendaRef), { nombre: tiendaName })
        .then(() => {
          console.log('New store added to Firebase:', tiendaName);
          this.showToast("Tienda Guardada ", 'success');
          this.nuevaTienda.nombre = ''; // Clear the input field
          return this.modalCtrl.dismiss(null,'confirm');// Dismiss the second modal
        })
        .catch((error) => {
          console.error('Error adding store to Firebase:', error);
          // Handle errors appropriately (e.g., display an error message)
        });
    }

    cancel() {
      return this.modalCtrl.dismiss(null, 'cancel');
    }
    async showToast(message: string, type: 'success' | 'warning' = 'success') {
      const toast = await this.toastController.create({
        message: message,
        duration: 2000,
        position: 'top',
        cssClass: ['toast-common', type === 'success' ? 'toast-success' : 'toast-warning']
      });
      toast.present();
    }
}
