import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PastRequestsPage } from '../../pages/past-requests/past-requests';
import { NewRequestsPage } from '../../pages/new-requests/new-requests';

/**
 * Generated class for the RequestConfirmationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-request-confirmation',
  templateUrl: 'request-confirmation.html',
})
export class RequestConfirmationPage {
	gotopage						: any;
	purpose 						: any;
	constructor(public navCtrl: NavController, public navParams: NavParams) {
		this.gotopage				= this.navParams.data.gotopage;
		this.purpose				= this.navParams.data.purpose;

	}

	ionViewDidLoad() {
	console.log('ionViewDidLoad RequestConfirmationPage');
	}

	goto() {
		if(this.gotopage == 'newrequest') {
			this.navCtrl.setRoot(NewRequestsPage);
		}
		else if(this.gotopage == 'pastrequest') {
			this.navCtrl.setRoot(PastRequestsPage);
		}
		
	}

}
