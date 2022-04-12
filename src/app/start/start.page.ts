import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

declare var google;

interface Marker {
  position: {
    lat: number,
    lng: number,
  };
  title: string;
}




@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {
  map: any;
directionsService = new google.maps.DirectionsService();
directionsDisplay = new google.maps.DirectionsRenderer();



// parque simon bolivar
origin = { lat: 32.461292, lng: -116.824788 };
// Parque la 93
destination = { lat: 32.457999, lng: -116.827285 };
  constructor(private http: HttpClient, private router: Router, public toastController: ToastController) { }

  ngOnInit() {
    //this.loadMap();
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
  
  rutasRandom(): object[]{
    const iniCoord = [/*{lat: 32.461656, lng: -116.824728}, {lat: 32.502796, lng: -116.977128}, */{lat: 32.461292, lng: -116.824788},{ lat: 32.461292, lng: -116.824788 }]
    const finCoord = [/*{lat: 32.461656, lng: -116.824728}, {lat: 32.502796, lng: -116.977128}, */{lat: 32.467573, lng:-116.819367},{ lat: 32.457999, lng: -116.827285 }] //,
    const random = Math.floor(Math.random() * (iniCoord.length));//Math.random() * iniCoord.length
    return [iniCoord[random], finCoord[random]]
  }


  async saveStats(id_Stats: number, distance:number, time:number) {
    //FETCH
    const stats = {
      userId: 1,
      speed: (Math.random() * (10 - 0) + 0).toFixed(2 || 2),
      distance: distance,
      time: time,
      date: new Date(),
      startTime: "01:00:00",
      endTime: "01:00:00",
      weekNum: 15,
      month: 4,
      year: 2022
    };
    this.http.post<any>('http://localhost:5001/addStats', stats).subscribe(async (res) => {
      if (res.status === 200) {
        await this.presentToast('Se ha guardado correctamente', 'success');
      }
    },

    async err => {
        await this.presentToast('No se ha podido registrar', 'danger');
        console.error('ha surgido un error', err);
    });
  }

  inicioTodo(){
    this.loadMap()
    this.calculateRoute()
  }

  loadMap() {
    // create a new map by passing HTMLElement
    const mapEle: HTMLElement = document.getElementById('map');
    const indicatorsEle: HTMLElement = document.getElementById('indicators');
    // create map
    this.map = new google.maps.Map(mapEle, {
      center: this.origin,
      zoom: 12
    });

    this.directionsDisplay.setMap(this.map);
    this.directionsDisplay.setPanel(indicatorsEle);
  
    google.maps.event.addListenerOnce(this.map, 'idle', () => {
      mapEle.classList.add('show-map');
    });
  }

  addMarker(marker: Marker) {
    return new google.maps.Marker({
      position: marker.position,
      map: this.map,
      title: marker.title
    });
  }

  calculateRoute(){
    this.directionsService.route({
      origin: this.rutasRandom()[0],//this.origin,
      destination: this.rutasRandom()[1],//this.destination,
      travelMode: google.maps.TravelMode.WALKING,
    }, (response, status)  => {
      if (status === google.maps.DirectionsStatus.OK) {
        this.directionsDisplay.setDirections(response);

        //Aqui calcula la distancia y el tiempo
        var route = response.routes[0];
        var totalDist = 0;
        var totalTime = 0;
        for (var i = 0; i < route.legs.length; i++) {
          totalDist += route.legs[i].distance.value;
          totalTime += route.legs[i].duration.value;      
        }
        totalDist = parseFloat((totalDist / 1000).toFixed(2));
        totalTime = parseFloat((totalTime / 60).toFixed(2));
        document.getElementById('distance').innerHTML = "Total Distance: " + totalDist + ' km';
        document.getElementById('time').innerHTML = "Total Time: " + totalTime + " Min";   
        //-------------------------------------------
        this.saveStats(1,totalDist,totalTime);


      } else {
        alert('Could not display directions due to: ' + status);
      }
    });
  }





}
