import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonContent,
  IonTitle,
  IonCard,
  IonCardTitle,
  IonCardHeader,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonContent,
    IonTitle,
    IonCard,
    IonCardTitle,
    IonCardHeader,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    FormsModule,
  ],
})
export class LoginComponent {
irRegistro() {
throw new Error('Method not implemented.');
}
iniciarSesion() {
throw new Error('Method not implemented.');
}
correo: String='';
contrasena:String='';
  constructor() {}
}
