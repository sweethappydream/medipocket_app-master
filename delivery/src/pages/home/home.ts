import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, NavParams, ModalController, Content } from 'ionic-angular';
import { DeliveryServiceProvider } from '../../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../../providers/temp-storage/temp-storage';
import { DeliveryProfilePage } from '../delivery-profile/delivery-profile';
import { Geolocation } from '@ionic-native/geolocation';
import { PastOrdersPage } from '../../pages/orders/past-orders/past-orders';
import { ActiveOrdersPage } from '../../pages/orders/active-orders/active-orders';
//import * as moment from 'moment';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
    @ViewChild(Content) content: Content;
    loggedData : any = "";
	constructor(public deliveryService: DeliveryServiceProvider, public ngzone: NgZone,
    public tempStorage: TempStorageProvider, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public geolocation: Geolocation) {
      
     this.loggedData  = this.navParams.get('loggedData');

      console.log(this.loggedData);
     if(this.loggedData !== undefined){
       if(this.loggedData.profileIncompelete === true){
        this.navCtrl.push(DeliveryProfilePage, {viewMode:false});
       }
     }
    
	}

	ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.content.resize();
	}
    ionViewDidEnter() {
        console.log("test");
    }

    goto(page: any = null) {
        if(page == "activeorders") {
            this.navCtrl.push(ActiveOrdersPage);
        }
        else{
            this.navCtrl.push(PastOrdersPage);
        }
    }
 

}
