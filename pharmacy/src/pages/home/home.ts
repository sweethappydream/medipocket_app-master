import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, Content } from 'ionic-angular';
import { DeliveryServiceProvider } from '../../providers/delivery-service/delivery-service';
import { AppSettings } from '../../app/settings';
import { TempStorageProvider } from '../../providers/temp-storage/temp-storage';
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
  user_id : any ;
	profileInfo : any = {};
	constructor(public deliveryService: DeliveryServiceProvider,
    public tempStorage: TempStorageProvider, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
      this.user_id =  this.tempStorage.authsession.userdata.user_id;
      if(this.tempStorage.authsession.userdata.profileIncompelete === false) {
        
           this.getProfileInfo()

      }
	}

	ionViewDidLoad() {
        console.log('ionViewDidLoad HomePage');
        this.content.resize();
	}

    ionViewDidEnter() {
        console.log("test");
    }
   
    getProfileInfo() {
		
      this.deliveryService.profileInfo(AppSettings.usertype,this.user_id).then((result)=>{
          let resultData : any = {}; 
          resultData    = result;
          if(resultData.data !== undefined){
            this.profileInfo  = resultData.data;
             this.tempStorage.pharmacyInfo.pharmacy_name = this.profileInfo.pharmacy_name;
            this.tempStorage.pharmacyInfo.pharmacy_address = this.profileInfo.address;
            this.tempStorage.pharmacyInfo.pharmacy_country = this.profileInfo.countryname;
            this.tempStorage.pharmacyInfo.pharmacy_state = this.profileInfo.statename;
            this.tempStorage.pharmacyInfo.pharmacy_city = this.profileInfo.cityname;
            this.tempStorage.pharmacyInfo.pharmacy_zip = this.profileInfo.zip_code;
           }
  
    });
}

}