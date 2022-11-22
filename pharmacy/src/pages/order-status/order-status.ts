import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { DeliveryServiceProvider } from '../../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../../providers/temp-storage/temp-storage';
import { AppSettings } from '../../app/settings';
import { OrderDetailsPage } from '../orders/order-details/order-details';
import * as moment from 'moment';

/**
 * Generated class for the OrderStatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-order-status',
  templateUrl: 'order-status.html',
})
export class OrderStatusPage {
	currentOrder 						: any;
	user_id 									: any;
	pageTitle 									: any;
	showTemplate 								: any;
	orderstatus 								: any;
	currentOrderindex							: any;
	ordertype 									: any;
	Object                                  = Object;
	constructor(public tempService: TempStorageProvider, public modalCtrl: ModalController, public deliveryService: DeliveryServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
		this.pageTitle							= "New Order";
		this.currentOrder 						= this.navParams.get('order');
		console.log(this.currentOrder);

		this.deliveryService.profileInfo('patient', this.currentOrder.user_id).then((result) => {
			let patientData 					: any;
				patientData						= result;
			this.currentOrder.patient 			= patientData.data;
		})
		this.currentOrderindex 					= this.navParams.get('orderindex');
		this.ordertype 							= this.navParams.get('ordertype');
		this.user_id 							= this.tempService.authsession.userdata.user_id;
		this.pageTitle							= "Order details";
		this.showTemplate						= "details";
		this.orderstatus 						= this.currentOrder.status;
	}

	ionViewDidLoad() {
		/* if(this.ordertype == 'active')
		{
			this.currentOrder						= this.tempService.activeOrders[this.currentOrderindex];
		}
		else{
			this.currentOrder						= this.tempService.pastOrders[this.currentOrderindex];
		} */
	}

	goto(action: any = null) {
		let sendData : any = {pageaction: null, pagetitle: null, order: {}, orderid: null};
		if(action == 'pickup') {
			sendData.pageaction 		= "pickup";
			sendData.order				= this.tempService.activeOrders[this.currentOrderindex];
			sendData.orderid			= this.currentOrderindex;
		}
		this.navCtrl.push(OrderDetailsPage, sendData);
	}

	timeago(datetime: any = moment()) {
		return moment(datetime, 'X').fromNow();
	}

}
