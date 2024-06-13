import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import {
  RefresherCustomEvent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRefresher,
  IonRefresherContent,
  IonList,
  IonButtons,
  IonButton,
  IonIcon,
  IonModal,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
} from '@ionic/angular/standalone';
import { initializeApp } from 'firebase/app';
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
import { DataService } from '../services/data.service';
import { OverlayEventDetail } from '@ionic/core';
import { ModalController } from '@ionic/angular';
import { Item } from '../model/item';
import { TiendaModalComponent } from '../tienda-modal/tienda-modal.component';
import { Lista } from '../model/lista';
import { ListaSeleccionadaService } from '../services/lista-seleccionada-service';
import { Router } from '@angular/router';
import { ListaCreate } from '../model/lista-create';
import { ItemsListaComponent } from '../items-lista/items-lista.component';
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
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    FormsModule,
    IonInput,
    IonItem,
    IonModal,
    IonIcon,
    IonButton,
    IonButtons,
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonList,
    IonSelect,
    IonSelectOption,
  ],
  providers: [ModalController],
})
export class HomePage {
  lista: Lista = new Lista();
  private data = inject(DataService);
  listas: Lista[] = [];
  newItem: Item = new Item();
  items: Item[] = [];
  tiendas: { nombre: string }[] = [];

  app = initializeApp(firebaseConfig);
  db = getDatabase(this.app);

  private modalCtrl: ModalController = inject(ModalController);

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private listaSeleccionadaService: ListaSeleccionadaService,
    private toastController: ToastController
  ) {
    this.getListFromFirebase();
  }

  // Mostrar el modal con los items de la lista seleccionada
  async showItems(lista: Lista) {
    const modal = await this.modalCtrl.create({
      component: ItemsListaComponent,
      componentProps: {
        lista: lista, // Pasar la lista seleccionada al modal
      },
    });
    await modal.present();
  }

  @ViewChild(IonModal)
  modal!: IonModal;

  //Abrir modales
  openModal() {
    this.modal.present();
    this.getTiendas();
  }

  async openModalStore() {
    try {
      const modal = await this.modalCtrl.create({
        component: TiendaModalComponent, // Assuming TiendaModalComponent is your modal component
      });
      await modal.present(); // Await presenting the modal after creation
    } catch (error) {
      console.error('Error creating or presenting modal:', error);
      // Handle modal creation/presentation errors here (optional)
    }
  }
  //Cerrar Modal
  cancel() {
    this.modal.dismiss();
  }

  //Traer las  Tiendas
  getTiendas() {
    const tiendaRef = ref(this.db, 'Tienda'); // Assuming 'tiendas' is your data node
    // Escuchar cambios en el nodo 'Tienda'
    onValue(tiendaRef, (snapshot) => {
      const tiendasData = snapshot.val(); // Obtener los datos del nodo

      // Extraer los nombres de las tiendas
      this.tiendas = tiendasData ? Object.values(tiendasData) : [];

      // Actualizar la interfaz de usuario con los nombres de las tiendas
      // (Por ejemplo, actualizar una lista o variable)
      console.log('Tiendas:', this.tiendas); // Ejemplo de uso
    });
  }
  //Traer lista
  getListFromFirebase() {
    const listasRef = ref(this.db, 'Listas'); // Referencia al nodo de listas en Firebase

    // Escuchar cambios en el nodo 'Listas'
    onValue(listasRef, (snapshot) => {
      const data = snapshot.val(); // Obtener los datos del nodo

      // Convertir los datos a un array de Listas si hay datos
      this.listas = data
        ? Object.keys(data)
            .map((key) => ({ id: key, ...data[key] }))
            .reverse()
        : [];

      console.log('Listas desde Firebase:', this.listas);
      // Aquí puedes hacer lo que necesites con la lista, como asignarla a una propiedad en tu componente
    });
  }



  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
    }
  }

  //agregar items de productos al array
  addItem() {
    if (!this.newItem.nombre || this.newItem.nombre.trim().length === 0) {
      this.showToast('El nombre del producto no puede estar vacío', 'warning');
      return;
    }

    if (!this.newItem.tienda || this.newItem.tienda.trim().length === 0) {
      this.showToast('Debes seleccionar una tienda', 'warning');
      return;
    }
    this.newItem.estado=false;

    const newItemCopy = { ...this.newItem };
    this.items.push(newItemCopy);

    this.newItem.nombre = '';
    this.newItem.tienda = '';
    this.changeDetectorRef.detectChanges();
    console.log(this.items);
  }

  refresh(ev: any) {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }


  // Método para guardar la lista de ítems en Firebase
  SaveListItems() {
    if (this.items.length === 0) {
      this.showToast('No hay elementos para guardar', 'warning');
      return;
    }
    // Crear una nueva lista con la fecha actual y los ítems actuales
    // Crear una nueva lista con la fecha formateada
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}-${(
      today.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${today.getFullYear()}`;

    const nuevaLista: ListaCreate = {
      fecha: formattedDate, 
      items: this.items,
    };

    // Referencia a la ubicación en Firebase donde se guardará la lista
    const listasRef = ref(this.db, 'Listas'); 

    // Agregar la nueva lista a Firebase
    push(listasRef, nuevaLista)
      .then(() => {
        console.log('Lista guardada exitosamente:', nuevaLista);
        this.showToast('Lista Guardada Correctamente', 'success');

        // Reiniciar la lista de ítems después de guardar
        this.items = [];
        this.modal.dismiss();
        this.changeDetectorRef.detectChanges();
      })
      .catch((error) => {
        console.error('Error al guardar la lista:', error);
      });
  }

  eliminarItem(item: Item) {
    const index = this.items.findIndex((existingItem) => existingItem === item);

    if (index !== -1) {
      this.items.splice(index, 1);
      console.log('Item removed successfully:', item);
    } else {
      console.warn('Item not found in the list:', item);
    }
  }

  eliminarLista(lista: Lista) {
    // Obtener la referencia a la lista específica que se va a eliminar
    const listaRef = ref(this.db, `Listas/${lista.id}`);

    // Llamar al método remove() en la referencia para eliminar la lista de Firebase
    remove(listaRef)
      .then(() => {
        console.log('Lista eliminada exitosamente de Firebase:', lista);

        // Actualizar la lista después de eliminarla
        this.getListFromFirebase();
      })
      .catch((error) => {
        console.error('Error al eliminar la lista de Firebase:', error);
      });
  }


  async showToast(message: string, type: 'success' | 'warning' = 'success') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      cssClass: [
        'toast-common',
        type === 'success' ? 'toast-success' : 'toast-warning',
      ],
    });
    toast.present();
  }
}
