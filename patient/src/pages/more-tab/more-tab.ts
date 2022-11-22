import { Component, ViewChild } from '@angular/core';
import {
	NavController,
	NavParams,
	ViewController,
	MenuController,
	App
} from 'ionic-angular';
import { DeliveryServiceProvider } from '../../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../../providers/temp-storage/temp-storage';
import { SigninPage } from '../auth/signin/signin';
/**
 * Generated class for the OrderStatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-more-tab',
	templateUrl: 'more-tab.html'
})
export class MoreTabPage {
	constructor(
		public menuCtrl: MenuController,
		public navCtrl: NavController,
		public navParams: NavParams,
		private deliveryService: DeliveryServiceProvider,
		public viewCtrl: ViewController,
		public tempStorage: TempStorageProvider,
		private app: App
	) {}

	close() {
		this.viewCtrl.dismiss();
	}

	ionViewDidEnter() {}

	ionViewDidLoad() {}
	onLogout() {
		this.viewCtrl.dismiss();
		this.tempStorage.clearAuthSession();
		this.tempStorage.clearCart();
		this.app.getRootNavs()[0].setRoot(SigninPage);
	}
}
