import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { DeliveryServiceProvider } from '../../../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../../../providers/temp-storage/temp-storage';
import { AppSettings } from '../../../app/settings';
import { MapLocationPage } from '../../../pages/map-location/map-location';
import * as moment from 'moment';
/**
 * Generated class for the ActiveOrderDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-active-order-details',
  templateUrl: 'active-order-details.html',
})
export class ActiveOrderDetailsPage {
	currentOrder 						: any;
	user_id 									: any;
	pageTitle 									: any;
	showTemplate 								: any;
	orderstatus 								: any;
	currentOrderindex							: any;
	ordertype 									: any;
	constructor(public tempService: TempStorageProvider, public modalCtrl: ModalController, public deliveryService: DeliveryServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
		this.pageTitle							= "New Order";
		this.currentOrder 						= this.navParams.get('order');
		this.currentOrderindex 					= this.navParams.get('orderindex');
		this.ordertype 							= this.navParams.get('ordertype');
		this.user_id 							= this.tempService.authsession.userdata.user_id;
		this.pageTitle							= "Order details";
		this.showTemplate						= "details";
		this.orderstatus 						= this.currentOrder.status;
		console.log(this.navParams)
		
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad ActiveOrderDetailsPage');
	}

	ionViewDidEnter() {
		if(this.ordertype == 'active')
		{
			this.currentOrder						= this.tempService.activeOrders[this.currentOrderindex];
		}
		else{
			this.currentOrder						= this.tempService.pastOrders[this.currentOrderindex];
		}
		
	}

	goto(action: any = null) {
		let sendData : any = {pageaction: null, pagetitle: null, order: {}, orderid: null};
		if(action == 'pickup') {
			sendData.pageaction 		= "pickup";
			sendData.pagetitle			= "Pharmacy Location";	
			sendData.order				= this.tempService.activeOrders[this.currentOrderindex];
			sendData.orderid			= this.currentOrderindex;
		}
		else{
			sendData.pageaction 		= "delivery";
			sendData.pagetitle			= "Delivery Location";
			sendData.order				= this.tempService.activeOrders[this.currentOrderindex];
			sendData.orderid			= this.currentOrderindex;
		}
		this.navCtrl.push(MapLocationPage, sendData);	
	}

	timeago(datetime: any = moment()) {
		return moment(datetime, 'X').fromNow();
	}

	cancelOrder() {
		
	}
}
