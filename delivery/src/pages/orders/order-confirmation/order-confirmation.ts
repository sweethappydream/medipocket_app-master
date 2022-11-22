import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PastOrdersPage } from '../past-orders/past-orders';

/**
 * Generated class for the OrderConfirmationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-order-confirmation',
  templateUrl: 'order-confirmation.html',
})
export class OrderConfirmationPage {
	constructor(public navCtrl: NavController, public navParams: NavParams) {

	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad OrderConfirmationMessagePage');
	}

	goto() {
		this.navCtrl.setRoot(PastOrdersPage);
	}

}
