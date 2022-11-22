import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, Navbar } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FileTransfer, FileTransferObject} from '@ionic-native/file-transfer';
import { mobiscroll, MbscPopupOptions } from '@mobiscroll/angular';

import { File } from '@ionic-native/file';
import { DeliveryServiceProvider } from '../../../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../../../providers/temp-storage/temp-storage';
import { PastOrdersPage } from '../past-orders/past-orders';
import { ActiveOrdersPage } from '../active-orders/active-orders';
import { OrderVerifyPage } from '../order-verify/order-verify';
import { AppSettings } from '../../../app/settings';
import { OrderConfirmationPage } from '../order-confirmation/order-confirmation';
import { ImageOriginalPage } from '../../image-original/image-original';
import * as moment from 'moment';

/**
 * Generated class for the OrderDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-order-details',
  templateUrl: 'order-details.html',
})
export class OrderDetailsPage {
	@ViewChild(Navbar) navBar: Navbar;
	Object                                  = Object;
	currentOrder 						: any;
	user_id 									: any;
	pageTitle 									: any;
	showTemplate 								: any;
	orderstatus 								: any;
	currentOrderindex							: any;
	ordertype 									: any;
	drugFormData								: FormGroup;
	showDrugcont 								: any;
	authid 										: any;
	submitted 									: any;
	acceptClick 								: any;
	rejectedClick								: any;
	pickupClick 								: any;
	assignedPilot 								: any;
	prescriptions 								: any;
	dynamicStatus 								: any;
	modifiedOrder 								: any;
	getPilotClick 								: any;
	pendingMsg									: any;
	settings: MbscPopupOptions = {
		display: 'center',
		buttons: [
			{
				text: 'Close',
				handler: 'cancel'
			},
			{
				text: 'Pending',
				handler: 'set'
			}
	],
		onSet: (event, inst) => {
			// Your custom event handler goes here
			this.rejectOrder(true);
		},
		onClose: (event, inst) => {
			// Your custom event handler goes here
		}
	};

	constructor(private transfer: FileTransfer, private file: File, private formBuilder: FormBuilder, public tempService: TempStorageProvider, public modalCtrl: ModalController, public deliveryService: DeliveryServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
		
		this.pageTitle							= "New Order";
		this.currentOrder 						= this.navParams.get('order');
		
        this.assignedPilot 						= {
        	assigned 							: false,
        	details 							: {}
        }
        this.modifiedOrder 						= {};
		this.prescriptions						= [];
		this.pendingMsg							= "The drugs : are not available at this time, will be available ";
        if(this.currentOrder.rx && this.currentOrder.rx.length > 0) {
        	this.prescriptions					= this.currentOrder.rx;
        }

        this.dynamicStatus						= this.currentOrder.order_status;
        if(this.currentOrder.pharmacy_delivered) {
        	if(this.currentOrder.pharmacy_delivered.status == 'partial') {
        		this.dynamicStatus 				= "pharmacy-verified-partial";
        	}
        	else if(this.currentOrder.pharmacy_delivered.status == 'full') {
        		this.dynamicStatus 				= "pharmacy-verified";
        	}
        }
        else if(this.currentOrder.pharmacy_accepted) {
        	if(this.currentOrder.pharmacy_accepted.status == 'partial') {
        		this.dynamicStatus 				= "accepted-pharmacy-partial";
        	}
        	else if(this.currentOrder.pharmacy_accepted.status == 'full') {
        		this.dynamicStatus 				= "accepted-pharmacy";
        	}
        }


        // Remove delivered Drugs

        let modifiedMedication 					= {};
        let deliveredMedication					= {};
        if(Object.keys(this.currentOrder.medications).length) {
            for(var item in this.currentOrder.medications) {
            	this.currentOrder.medications[item].selected = false;
            	if(this.currentOrder.pharmacy_delivered) {
            		if(!this.currentOrder.pharmacy_delivered.medications[item]) {
            			modifiedMedication[item] 		  		  = this.currentOrder.medications[item];
            			if(this.currentOrder.pharmacy_accepted) {
		            		if(this.currentOrder.pharmacy_accepted.medications[item]) {
		            			modifiedMedication[item] 		  = this.currentOrder.medications[item];
		            			modifiedMedication[item].selected = this.currentOrder.pharmacy_accepted.medications[item].status;
		            		}
		            	}
            		}
            		else{
            			deliveredMedication[item]					= this.currentOrder.medications[item];
            		}
            	}
            	else{
            		modifiedMedication[item] 		  		  = this.currentOrder.medications[item];
            		if(this.currentOrder.pharmacy_accepted) {
	            		if(this.currentOrder.pharmacy_accepted.medications[item]) {
	            			modifiedMedication[item] 		  = this.currentOrder.medications[item];
	            			modifiedMedication[item].selected = this.currentOrder.pharmacy_accepted.medications[item].status;
	            		}
	            	}
            	}
            	
            }
        }

        this.modifiedOrder.medications 					= {
        	delivered 									: deliveredMedication,
        	undelivered									: modifiedMedication,
        	all											: this.currentOrder.medications
        }
        console.log(this.dynamicStatus);
        console.log(this.modifiedOrder);
        /* console.log(deliveredMedication);
        console.log(modifiedMedication); */

        // Remove delivered Drugs

        console.log(this.dynamicStatus);

        this.getDeliveryStaffInfo();
		
		this.getPatientInfo();

		this.currentOrderindex 					= this.navParams.get('orderindex');
		this.ordertype 							= this.navParams.get('ordertype');
		this.user_id 							= this.tempService.authsession.userdata.user_id;
		this.pageTitle							= "Prepare order";
		this.showTemplate						= "details";
		this.orderstatus 						= this.currentOrder.status;
		this.showDrugcont 						= true;
		this.authid								= "XCV456789HJ";
		console.log(this.navParams);

		// if(this.navParams.get('pageaction') == 'pickup') {
			if(this.currentOrder.order_status 	== 'accepted-pharmacy' || this.currentOrder.order_status == 'ready-to-pickup' || this.currentOrder.order_status == 'pickup-accepted') {
				this.showDrugcont 						= false;
			}
		// }
		this.submitted							= false;
		this.rejectedClick						= false;
		this.acceptClick						= false;
		this.pickupClick 						= false;
		this.getPilotClick 						= false;
		
	}

	ionViewDidLoad() {
	console.log('ionViewDidLoad OrderDetailsPage');
	}

	getDeliveryStaffInfo(redirect = false){
		if (this.currentOrder.order_status == "ready-to-pickup" || this.currentOrder.order_status == "pickup-accepted") {
			if (this.currentOrder.picked_by) {
				this.deliveryService.profileInfo('delivery', this.currentOrder.picked_by).then((result) => {
					let pilotData: any;
					pilotData = result;
					this.assignedPilot.assigned = true;
					this.assignedPilot.details = pilotData.data;
					this.currentOrder.delivery = pilotData.data;
					if(redirect){
						this.goto('deliverydrugs');
					}
				});
				// 354
			}
		}
	}
	getPatientInfo(){
		this.currentOrder.patient = {};
		this.deliveryService.profileInfo('patient', this.currentOrder.user_id).then((result) => {
			let patientData: any;
			patientData = result;
			this.currentOrder.patient = patientData.data;
		})
	}

	toggleSelectDrug(index: any) {
		console.log(index);
	}
	openPrescription (index: any) {
		console.log(index);
	}
	promptAcceptOrder(){
		this.deliveryService.mobiconfirm("I confirm that, All medicines are available as per the description?").then(value => {
			if (value) {
			this.acceptOrder();
			}else{

			}
		});
	}
	acceptOrder() {
		let checkSelectedDrug 			= this.currentOrder;
		let count 						= 0;

		let accepted_medications 		: any = {};
			if(this.currentOrder.pharmacy_accepted) {
				accepted_medications 	= this.currentOrder.pharmacy_accepted.medications;
			}

		let deliveryAttempt 			: any = 0;
		if(!this.currentOrder.pharmacy_delivered)
		{
			deliveryAttempt++;
		}
		else{
			deliveryAttempt 			= this.currentOrder.pharmacy_delivered.attempt + 1;
		}

		for(var item in this.modifiedOrder.medications.undelivered) {
            if(this.modifiedOrder.medications.undelivered[item].selected === true) {
            	accepted_medications[item]	= {status: true, attempt: deliveryAttempt};
				count++;
			}
        }

        console.log(this.modifiedOrder.medications.undelivered);
		if(count <= 0) {
			this.deliveryService.mobiToast("Please select atleast one drug!", "danger");
			return false;
		}
		else if(count < Object.keys(this.modifiedOrder.medications.undelivered).length) {
			this.deliveryService.mobiToast("Please select all drugs and accept!", "danger");
			return false;
		}
		this.submitted = true;
		let supplied_status 	= "partial";
		let activity_msg 	= "accepted-pharmacy-partial";
		if(count == Object.keys(this.modifiedOrder.medications.undelivered).length) {
			activity_msg 	= "accepted-pharmacy";
			supplied_status	= "full";
		}
		let curritem : any = this.currentOrder;
        let orderData : any = {};
            orderData.activities   = curritem.activities;
            
		if(orderData.activities === undefined || orderData.activities == null || orderData.activities == ""){
			orderData.activities = [];
		}
		orderData.medications 				= curritem.medications;
		orderData.pharmacy_accepted			= {status : supplied_status, medications: accepted_medications};
		orderData.activities.push(
			{msg: activity_msg, created_at: moment().format("X"), by: this.user_id}
		);
		// orderData.order_status = "accepted-pharmacy";
		if(curritem.order_status == 'ready-to-pharmacy' ) {
			orderData.order_status = "accepted-pharmacy";
		}
		else{
			orderData.order_status = curritem.order_status;
		}
		this.acceptClick 				= true;
		let mobiToester = this.deliveryService.mobiToast("Accepting, please wait ...", "success");
		// console.log(mobiToester);
		this.deliveryService.createOrder(orderData, curritem._id).then((result)=>{
			this.submitted = false;   
			this.currentOrder.activities  = orderData.activities; // update local variable
			this.currentOrder.order_status = orderData.order_status;// // update local variable
			console.log(this.currentOrder);
			this.showDrugcont 						= false;
			this.acceptClick 						= false;
		})
		

		this.navBar.backButtonClick = () => {
			let pages = [{
				page: ActiveOrdersPage
			}];
            this.navCtrl.setPages(pages);
        }
	}

	modifyDrugs() {
		this.showDrugcont 				= true;
	}
	
	promptRejectOrder() {

		this.deliveryService.mobiconfirm("Would you like to reject this order?").then(value => {
			if (value) {
				this.rejectOrder();
			} else {

			}
		});
		
	}

	rejectOrder(isPending = false) {

 
                this.rejectedClick 			= true;
				let curritem : any = this.currentOrder;
		        let orderData : any = {};
		            orderData.activities   = curritem.activities;
		            
				if(orderData.activities === undefined || orderData.activities == null || orderData.activities == ""){
					orderData.activities = [];
				}
              if(isPending){

				  orderData.activities.push(
					  { msg: 'one or more medicine may not be available', created_at: moment().format("X"), by: this.user_id }
				  );
				  orderData.order_status = 'pending-pharmacy';

				   this.deliveryService.mobiToast("Marking as pending order, please wait ...", "success");

			  }else{

				  orderData.activities.push(
					  { msg: 'rejected-pharmacy', created_at: moment().format("X"), by: this.user_id }
				  );
				  orderData.order_status = 'rejected-pharmacy';

				    this.deliveryService.mobiToast("Rejecting order, please wait ...", "success");

			  }
				

				
				this.deliveryService.createOrder(orderData, curritem._id).then((result)=>{
					this.rejectedClick = false;   
					this.currentOrder.activities  = orderData.activities; // update local variable
					this.currentOrder.order_status = orderData.order_status;// // update local variable
					this.navCtrl.setRoot(PastOrdersPage);
				});
            
        
		
	}

	goto(action: any) {
		if(action == 'pickup') {
			let curritem : any = this.currentOrder;
			let orderData : any = {};
	            orderData.activities   = curritem.activities;
	            
			if(orderData.activities === undefined || orderData.activities == null || orderData.activities == ""){
				orderData.activities = [];
			}

			orderData.activities.push(
				{msg: 'ready-to-pickup', created_at: moment().format("X"), by: this.user_id}
			);
			orderData.order_status = 'ready-to-pickup';
			this.pickupClick 			= true;
			this.deliveryService.createOrder(orderData, curritem._id).then((result)=>{ 
				this.currentOrder.activities  = orderData.activities; // update local variable
				this.currentOrder.order_status = orderData.order_status;// // update local variable
				this.pickupClick 				= false;
				let sendData                 : any = {pageaction: action, order: this.currentOrder, orderid: 0};
				this.navCtrl.setRoot(OrderConfirmationPage, sendData);
			})
		}
		else if(action == 'back') {
			this.navCtrl.setRoot(ActiveOrdersPage);
		}
		else if(action == "deliverydrugs") {
			this.navCtrl.push(OrderVerifyPage, {order: this.currentOrder, modifiedorder: this.modifiedOrder, pageaction: 'pickup'});
		}

		
	}

	viewImage(url: any = null) {
		this.navCtrl.push(ImageOriginalPage, {url: url});
	}
	downloadImage(url: any = null) {
		const fileTransfer: FileTransferObject = this.transfer.create();
		fileTransfer.download(url, this.file.dataDirectory + 'file.pdf').then((entry) => {
		console.log('download complete: ' + entry.toURL());
		}, (error) => {
		// handle error
		});
	}

	getDeliveryStaff() {
		this.getPilotClick 				= true;
		let orderData 	: any = {};
	    orderData.user_id 	= this.user_id;
		orderData._id = this.currentOrder._id;
			orderData.list_type 	= "verifypharmacy"
			orderData.fromApp  = "pharmacy";
		this.deliveryService.checkUserCart(orderData).then((result)=>{ 
			this.getPilotClick = false;
			let orderData 	: any	= result;
			console.log(orderData.data);
			if(orderData.data[0].picked_by && orderData.data[0].picked_by != "") {
				this.currentOrder.picked_by			= orderData.data[0].picked_by;
				if (this.currentOrder.delivery !== undefined && this.currentOrder.delivery.name !== undefined){
					this.goto('deliverydrugs');
				}else{
					this.getDeliveryStaffInfo(true);
				}
				//this.goto('deliverydrugs');
			}
			else{
				this.deliveryService.mobiToast("Sorry! Delivery staff is not assigned yet. Please check after sometime", 'danger');
			}
			console.log(orderData.result);
		})
	}

}
