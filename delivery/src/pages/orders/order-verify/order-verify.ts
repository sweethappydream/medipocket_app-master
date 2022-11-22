import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DeliveryServiceProvider } from '../../../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../../../providers/temp-storage/temp-storage';
import { MapLocationPage } from '../../../pages/map-location/map-location';
import { OrderConfirmationPage } from '../order-confirmation/order-confirmation';
// import { mobiscroll, MbscNumpadOptions } from '@mobiscroll/angular';
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
	deliveryFormData 				: FormGroup;
	displayError 					: any;
	codeError 						: any;
	errorMsg						: any;
	codeSuccess 					: any;
	successMsg 						: any;
	user_id								: any;
	filteredData          : any;
	showspinner          : any;
	orderVerified 				: any;
	amountToPay  : any;
	patientInfo : any;
	patientVerified : any;
	amountPaid : any;
	
	constructor(public deliveryService: DeliveryServiceProvider, private formBuilder: FormBuilder, public tempService: TempStorageProvider, public navCtrl: NavController, public navParams: NavParams) {
		this.user_id 							= this.tempService.authsession.userdata.user_id;
		this.pageAction							= this.navParams.get('pageaction');
		this.displayError 						= false;
		this.codeError							= false;
		this.patientVerified       = false;
		this.filteredData            = [];
		this.patientInfo					= {};
		this.errorMsg							= "";
		this.successMsg							= "";
		this.amountToPay						= {};
		this.currentOrderId						= this.navParams.get('orderid');
		this.currentOrder                       = this.navParams.get('orderDetail');;
		

		if(this.pageAction == 'pickup') {
			this.pageTitle						= "Pickup Order";
			this.orderVerified = false;
			this.amountToPay          = this.deliveryService.calculateTotalFromPriceArray(this.currentOrder.pharmacy.pricing);
			  this.getPatientInfo();
			
		}
		else{

			this.patientInfo = this.tempService.patientInfo;
			this.amountToPay = {};
			this.amountToPay.totalPrice =  this.currentOrder.total_amount  
				

			this.pageTitle						= "Delivery Order";
			this.deliveryFormData 				= this.formBuilder.group({
	            code                        	: ["", Validators.required]
	        });
		}
		
		
		console.log(this.currentOrder);
	}

	ionViewDidLoad() {
	console.log('ionViewDidLoad OrderVerifyPage');
	}

	getPatientInfo(){

		this.deliveryService.profileInfo("patient", this.currentOrder.user_id).then((result:any)=>{

				console.log(result);
				if(result.data !== undefined){
				this.patientInfo = result.data;
				console.log(this.patientInfo);
				console.log(result.data);
				this.tempService.patientInfo = this.patientInfo
				}else{
					this.patientInfo = {};
				this.tempService.patientInfo = this.patientInfo
				}

		});

}

	verifyWithPharmacy(){
		console.log(this.currentOrder);
		let filterObj :any = {};
						filterObj.is_cart  = false;
						filterObj.user_id  = this.user_id;
						filterObj._id  = this.currentOrder._id;
						filterObj.fromApp  = "delivery";
						filterObj.list_type  = "verifypharmacy";
						filterObj.limit  = 20;
						this.filteredData = [];
						this.showspinner = true;
						this.deliveryService.checkUserCart(filterObj).then((result: any) => { 

							  this.showspinner = false;
						
							if(result !== undefined && result.data !== undefined && result.data.length > 0){

								if(result.data[0].order_status === "pharmacy-verified"){

									  this.deliveryService.mobiToast("Order successfully verfied with pharmacy", "success");
									this.orderVerified = true;

								}else{

									 this.deliveryService.mobiToast("Not verified with pharmacy", "danger");
									this.orderVerified = false;

								}


							}else{
								this.filteredData = [];
							}
							
						
						});	

	}

	goto(action: any = null) {
		let log 			: any = {status: "picked-package", datetime: moment().format('X')};
		if(action == 'delivery') {
			// this.tempService.activeOrders[this.currentOrderId].status = "picked";
			// this.tempService.activeOrders[this.currentOrderId].log.unshift(log);
			// activeorderspage
			if(this.amountPaid == undefined || !this.amountPaid || this.amountPaid < 1){
				this.deliveryService.mobiToast("Please fill the amount that was paid", "danger");
				return false;
			}
			let item = this.currentOrder;
			this.showspinner  = true;
			let orderData : any = {};
					 orderData.activities   = item.activities;
					
					 if(orderData.activities === undefined || orderData.activities == null || orderData.activities == ""){

							orderData.activities = [];

					 }
		 
					orderData.activities.push(
							{msg: "Pickedup from pharmacy", created_at: moment().format("X"), by: this.user_id}
		       );
					orderData.order_status = 'pickedup-package';
					
						//  console.log(mobiToester);
					this.deliveryService.createOrder(orderData, item._id).then((result)=>{
						 
						this.currentOrder.activities  = orderData.activities; // update local variabl
            //   this.currentOrder.picked_by = this.user_id;// // update local variabl
							 this.currentOrder.order_status = orderData.order_status;// // update local variabl
							 this.showspinner  = false;

						 let sendData 				: any = {backto: 'default', pageaction: "delivery", pagetitle: "Delivery Location", orderDetail: this.currentOrder, orderid: this.currentOrderId};

						// sending user notificaiton start
						console.log(this.patientInfo);
						 let postData: any = {};
						postData.msg = "your order from Medipocket, Picked from pharmacy by our delivery agent";
						postData.action = "order-coming";
						postData.purpose = "notify";
						postData.to = this.patientInfo.phone; //this.profileInfo.phone,
						postData.user_id = this.user_id,
					 // this.deliveryService.mobiToast('Sending OTP, Please wait...', 'success');
						this.deliveryService.registerGetOTP(postData).then((result) => {

						
						});
						// sending user notification 

			       this.navCtrl.push(MapLocationPage, sendData);
						 
					})
			
		}
		else{
			log.status 							= 'delivered';
		//	this.tempService.activeOrders[this.currentOrderId].status = "delivered";
		//	this.tempService.activeOrders[this.currentOrderId].log.unshift(log);
		//	let moveOrder 						: any = Object.assign(this.tempService.activeOrders[this.currentOrderId]);
		//	this.tempService.pastOrders.push(moveOrder);
		//	this.tempService.sliceOrder(this.currentOrderId, 'active');
		//	this.navCtrl.setRoot(OrderConfirmationPage);


			let item = this.currentOrder;
			this.showspinner  = true;
			let orderData : any = {};
					 orderData.activities   = item.activities;
					
					 if(orderData.activities === undefined || orderData.activities == null || orderData.activities == ""){

							orderData.activities = [];

					 }
		 
					orderData.activities.push(
							{msg: "Verified code and delivered", created_at: moment().format("X"), by: this.user_id}
		       );
					orderData.order_status = 'delivered';
					
						//  console.log(mobiToester);
					this.deliveryService.createOrder(orderData, item._id).then((result)=>{
						 
						this.currentOrder.activities  = orderData.activities; // update local variabl
            //   this.currentOrder.picked_by = this.user_id;// // update local variabl
							 this.currentOrder.order_status = orderData.order_status;// // update local variabl
							 this.showspinner  = false;

						 let sendData 				: any = {backto: 'default',  orderDetail: this.currentOrder};
						 this.navCtrl.setRoot(OrderConfirmationPage, {orderDetail: sendData});
						 
					})


		}
		
		
	}

	verifyDeliveryCode() {
		this.displayError 						= false;
		this.codeError							= false;
		this.errorMsg							= "";
		this.successMsg							= "";
		console.log(this.deliveryFormData.value);
		if(!this.deliveryFormData.valid) {
				this.displayError             	= true;
				return false;
		}

		if(this.currentOrder.verify_patient_code != this.deliveryFormData.value.code) {
			this.codeError						= true;
			this.patientVerified   = false;
			this.errorMsg 						= "Invalid code!!!";
			console.log("Invalid code");
			return false;
		}
		this.patientVerified   = true;
		this.codeSuccess						= true;
		this.successMsg							= "Code Verified Successfully";
	}

}
