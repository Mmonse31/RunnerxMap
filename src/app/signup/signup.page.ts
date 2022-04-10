import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  firstName: string;
  lastName: string;
  weight: number;
  height: number;
  email: string;
  password: string;
  gender: string;
  constructor(private http: HttpClient, private router: Router, public toastController: ToastController) { }

  ngOnInit() {
  }

  async presentToast(msg, type) {
    const toast = await this.toastController.create({
      position: 'top',
      color: type,
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  async saveUser() {
    const user = {
      firstName: this.firstName,
      lastName: this.lastName,
      weight: this.weight,
      height: this.height,
      email: this.email,
      password: this.password,
      gender: this.gender,
    };

    this.http.post<any>('https://runnerapi.herokuapp.com/api/users/guardar', user).subscribe(async (res) => {
      if (res.status === 200) {
        await this.presentToast('Se ha guardado correctamente', 'success');
        this.router.navigate(['/login']);
      }
    },

    async err => {
        await this.presentToast('No se ha podido registrar', 'danger');
        console.error('ha surgido un error', err);
    });
  }

}
