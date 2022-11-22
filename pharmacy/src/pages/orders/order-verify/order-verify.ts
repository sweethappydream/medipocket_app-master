import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { TempStorageProvider } from '../../../providers/temp-storage/temp-storage';
import { OrderConfirmationPage } from '../order-confirmation/order-confirmation';
import { DeliveryServiceProvider } from '../../../providers/delivery-service/delivery-service';
import * as moment from 'moment';

/**
 * Generated class for the OrderVerifyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-order-verify',
  templateUrl: 'order-verify.html',
})
export class OrderVerifyPage {
	pageTitle 						: any;
	currentOrder					: any;
	currentOrderId 					: any;
	pageAction 						: any;
	pickupFormData 				: FormGroup;
	displayError 					: any;
	codeError 						: any;
	errorMsg						: any;
	codeSuccess 					: any;
	disableCompleted 					: any;
	successMsg 						: any;
	user_id 						: any;
	modifiedOrder					: any;
	constructor(private formBuilder: FormBuilder, public tempService: TempStorageProvider, public deliveryService: DeliveryServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
		this.pageAction							= this.navParams.get('pageaction');
		this.user_id 							= this.tempService.authsession.userdata.user_id;
		this.displayError 						= false;
		this.codeError							= false;
		this.errorMsg							= "";
		this.successMsg							= "";
		this.currentOrderId						= this.navParams.get('orderid');
		
		this.currentOrder                       = this.navParams.get('order');
		this.modifiedOrder 						= this.navParams.get('modifiedorder');

		// trying to avalod undeifned error on avathr
		if (this.currentOrder.delivery !== undefined && this.currentOrder.delivery.avatar !== undefined){

		}else{
			if (this.currentOrder.delivery !== undefined){ 
			    this.currentOrder.delivery.avatar = {};
			}else{
				this.currentOrder.delivery = {};
				this.currentOrder.delivery.avatar = {};
			}
		}
		console.log(this.currentOrder);
		console.log(this.modifiedOrder);
		this.pageTitle						= "Pickup Details";
		this.pickupFormData 				= this.formBuilder.group({
            code                        	: ["", Validators.required]
        });
		
		this.codeSuccess 						= false;
		this.disableCompleted						= true
		console.log(this.currentOrder);
	}

	ionViewDidLoad() {
	console.log('ionViewDidLoad OrderVerifyPage');
	}

	goto(action: any = null) {
		let log 			: any = {status: "picked", datetime: moment().format('X')};
		if(action == 'pickup') {
			this.tempService.activeOrders[this.currentOrderId].status = "picked";
			this.tempService.activeOrders[this.currentOrderId].log.unshift(log);
			let sendData 				: any = {backto: 'activeorderspage', pageaction: "pickup", pagetitle: "Pickup Location", order: this.tempService.activeOrders[this.currentOrderId], orderid: this.currentOrderId};
			// this.navCtrl.push(MapLocationPage, sendData);
		}
		else if(action == "success") {
			let deliveryAttempt		: any;
				deliveryAttempt		= 1;
			let delivered_medications 		: any = {};
			if(this.currentOrder.pharmacy_delivered) {
				if(this.currentOrder.pharmacy_delivered.attempt) {
					deliveryAttempt = this.currentOrder.pharmacy_delivered.attempt + 1;
				}
				delivered_medications 	= this.currentOrder.pharmacy_delivered.medications;
			}
			let count : any = 0;
			for(var item in this.modifiedOrder.medications.undelivered) {
	            if(this.modifiedOrder.medications.undelivered[item].selected === true) {
	            	delivered_medications[item] 			= {status : true, attempt: deliveryAttempt, picked_by: this.currentOrder.picked_by};
					count++;
				}
	        }

	        


			let curritem : any = this.currentOrder;
			let orderData : any = {};
	            orderData.activities   = curritem.activities;
	         
	        let supplied_status 	= "partial";
			let activity_msg 	= "pharmacy-verified-partial";
			orderData.order_status = 'pharmacy-verified-partial';
			if(count == Object.keys(this.modifiedOrder.medications.undelivered).length) {
				activity_msg 	= "pharmacy-verified";
				supplied_status	= "full";
				orderData.order_status = 'pharmacy-verified';
			}   
			if(orderData.activities === undefined || orderData.activities == null || orderData.activities == ""){
				orderData.activities = [];
			}
			/* if(supplied_status == 'partial') {
				orderData.picked_by 					= "";
			} */
			orderData.pharmacy_delivered			= {status : supplied_status, medications: delivered_medications, attempt: deliveryAttempt};
			orderData.activities.push(
				{msg: activity_msg, created_at: moment().format("X"), by: this.user_id}
			);		

			console.log(orderData);
			this.deliveryService.createOrder(orderData, curritem._id).then((result)=>{ 
				this.currentOrder.activities  = orderData.activities; // update local variable
				this.currentOrder.order_status = orderData.order_status;// // update local variable
				let sendData                 : any = {pageaction: action, order: this.currentOrder};
				this.navCtrl.setRoot(OrderConfirmationPage, sendData);
			})
		}
		else{
			log.status 							= 'completed';
			this.tempService.activeOrders[this.currentOrderId].status = "completed";
			this.tempService.activeOrders[this.currentOrderId].log.unshift(log);
			let moveOrder 						: any = Object.assign(this.tempService.activeOrders[this.currentOrderId]);
			this.tempService.pastOrders.push(moveOrder);
			this.tempService.sliceOrder(this.currentOrderId, 'active');
			this.navCtrl.setRoot(OrderConfirmationPage);
		}
		
		
	}

	verifyPickupCode() {
		this.displayError 						= false;
		this.codeError							= false;
		this.errorMsg							= "";
		this.successMsg							= "";
		this.codeSuccess 						= true;
		this.disableCompleted 					= true;
		console.log(this.pickupFormData.value);
		if(!this.pickupFormData.valid) {
				this.displayError             	= true;
				return false;
		}

		if(this.currentOrder.verify_pharmacy_code != this.pickupFormData.value.code) {
			this.codeError						= true;
			this.errorMsg 						= "Invalid code!!!";
			this.disableCompleted 				= true;
			this.codeSuccess					= false;
			console.log("Invalid code");
			return false;
		}

		this.disableCompleted 					= false;
		/* this.codeSuccess						= true;
		this.disableCompleted 					= true; */
		this.successMsg							= "Code Verified Successfully";
	}

}
