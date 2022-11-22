import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NewOrdersPage } from '../new-orders/new-orders';

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
	pageaction							: any;
	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.pageaction					= this.navParams.data.pageaction;
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad OrderConfirmationMessagePage');
	}

	goto() {
		this.navCtrl.setRoot(NewOrdersPage);
	}

}
