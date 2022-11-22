import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the EverytimePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-everytime-password',
  templateUrl: 'everytime-password.html',
})
export class EverytimePasswordPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EverytimePasswordPage');
  }
  	everytimepassword(){
		this.navCtrl.push(EverytimePasswordPage);
	}

}
