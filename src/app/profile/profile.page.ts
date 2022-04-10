import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { isEmptyObj } from '../../helpers/helpers.js';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userProfile: object;

  constructor(private http: HttpClient, private router: Router, public toastController: ToastController) { }

  async ngOnInit() {
    const userOject = JSON.parse(localStorage.getItem('@userData'));
    this.validateSession(userOject);

    this.http.get<any>(`https://randomuser.me/api/?gender=${userOject.genero}`).subscribe((res) => {
      const imageUrl = res.results[0].picture.large;
      userOject.image = imageUrl;
    },
    async err => {
        console.error('ha surgido un error', err);
    });
    this.userProfile = userOject;
  }

  validateSession = (obj) => {
    if (isEmptyObj(obj)) {
      this.router.navigate(['/login']);
    }
  };

}
