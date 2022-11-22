import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, Content } from 'ionic-angular';
import { DeliveryServiceProvider } from '../../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../../providers/temp-storage/temp-storage';
import { NewRequestsPage } from '../../pages/new-requests/new-requests';
import { DoctorProfilePage } from '../../pages/doctor-profile/doctor-profile';
import * as moment from 'moment';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  @ViewChild(Content) content: Content;
	constructor(public deliveryService: DeliveryServiceProvider,
    public tempStorage: TempStorageProvider, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
   
	}

	ionViewDidLoad() {
        console.log('ionViewDidLoad HomePage');
        this.content.resize();
	}

    ionViewDidEnter() {
      //console.log(this.tempStorage.authsession.userdata);
      if (!this.tempStorage.authsession.userdata.profileData.phone_verified) {
        //console.log("is it in");
        this.navCtrl.setRoot(DoctorProfilePage);
      }
    }
    gotoRXpage() {
        this.navCtrl.push(NewRequestsPage);
    }

}
