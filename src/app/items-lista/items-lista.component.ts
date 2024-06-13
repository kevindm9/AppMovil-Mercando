import { Component, ElementRef, Input, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
import { Lista } from '../model/lista';
import { ListaSeleccionadaService } from '../services/lista-seleccionada-service';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonContent,
  IonList,
  IonLabel,
  IonItem
} from '@ionic/angular/standalone';
import {
  getDatabase,

  ref,
  get,
  update,
  remove,
  onValue,
  push,
} from 'firebase/database';
import { ModalController,GestureController } from '@ionic/angular';
import { Item } from '../model/item';
import { initializeApp } from 'firebase/app';

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
  selector: 'app-items-lista',
  templateUrl: './items-lista.component.html',
  styleUrls: ['./items-lista.component.scss'],
  standalone: true,
  imports: [
    IonLabel,
    IonItem,
    IonList,
    IonContent,
    IonIcon,
    IonButton,
    IonButtons,
    IonTitle,
    IonToolbar,
    IonHeader,
    CommonModule,
  ],
})
export class ItemsListaComponent implements AfterViewInit {

  app = initializeApp(firebaseConfig);
  db = getDatabase(this.app);
  
  @Input() lista!: Lista;
  selectedLista: Lista | null = null;
  @ViewChildren(IonItem, { read: ElementRef }) items?: QueryList<ElementRef> ;
  index!:number;
  private lastTapTime: number = 0;
  private readonly DOUBLE_TAP_THRESHOLD: number = 300; // Tiempo en ms para considerar como doble tap

  constructor(
    private modalCtrl: ModalController,
    private gestureCtrl: GestureController
  ) {}


  ngAfterViewInit() {
    this.items?.forEach((item, index) => {
      const gesture = this.gestureCtrl.create({
        el: item.nativeElement,
        threshold: 0,
        gestureName: 'double-tap',
        onStart: () => this.onStart(item, index)
      });

      gesture.enable();
    });
  }

  private onStart(item: ElementRef, index: number) {
    const now = Date.now();

    if (Math.abs(now - this.lastTapTime) <= this.DOUBLE_TAP_THRESHOLD) {
      // Encuentra el ítem correspondiente por su índice en la lista
      const matchedItem = this.lista.items[index];
      if (matchedItem) {
        this.index=index;
        this.lista.items[index].estado = !matchedItem.estado;
        console.log( this.lista.items[index].estado)

        this.updateItemInFirebase(this.lista.id, matchedItem);
        // No es necesario cambiar el color manualmente
      }
      this.lastTapTime = 0; // Reinicia el tiempo del último tap
    } else {
      this.lastTapTime = now;
    }
  }

  private updateItemInFirebase(listaId: string, item: Item) {
    // Asumiendo que 'listaId' es el identificador único de la lista
    // y cada ítem tiene un identificador único en la lista
    const itemRef = ref(this.db, `Listas/${listaId}/items/${this.index}`); // Aquí usamos `item.nombre` como ID del ítem
    update(itemRef, { estado: item.estado }).then(() => {
      console.log('Item actualizado en Firebase:', item);
    }).catch((error) => {
      console.error('Error al actualizar el item en Firebase:', error);
    });
  }
  
  // Método para cerrar el modal
  dismiss() {
    this.modalCtrl.dismiss();
  }
}
