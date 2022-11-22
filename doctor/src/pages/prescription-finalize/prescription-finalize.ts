import { Component } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams } from 'ionic-angular';
import { DeliveryServiceProvider } from '../../providers/delivery-service/delivery-service';
import { PastRequestsPage } from '../../pages/past-requests/past-requests';
import { RequestConfirmationPage } from '../../pages/request-confirmation/request-confirmation';
import * as moment from 'moment';

/**
 * Generated class for the PrescriptionFinalizePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-prescription-finalize',
  templateUrl: 'prescription-finalize.html',
})
export class PrescriptionFinalizePage {
	currOrder 								: any;
	create_order 							: any;
	create_request 							: any;
	submitted 								: any;
    pagefrom                                : any;
    Object                                  = Object;
	constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public deliveryService: DeliveryServiceProvider) {
		this.pagefrom            = this.navParams.data.pagefrom;
        this.currOrder			= this.navParams.data.order;
		this.create_order			= this.navParams.data.create_order;
        console.log(this.navParams.data);
        console.log(this.create_order.doctor_suggested_medications);
		this.create_request			= this.navParams.data.create_request;
		this.submitted 				= false;
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad PrescriptionFinalizePage');
	}

	submit() {
        this.submitted                         = true;
		this.deliveryService.createRequest(this.create_request, this.currOrder._id).then((result)=>{
            console.log("Request result " + result);
        });
        this.deliveryService.createOrder(this.create_order, this.currOrder.order._id).then((result)=>{
            this.submitted = false;   
            let resultData : any =  result;
            if(resultData.insertedId !== undefined){
                this.deliveryService.mobiToast("Updating please wait..", "success").then((result) => {
                    this.navCtrl.setRoot(RequestConfirmationPage, {gotopage: "newrequest", purpose: "eprescription"});
                    // this.navCtrl.setRoot(CheckoutPage, { createdOrderId: resultData.insertedId, payOption:payOption});
                });
            }else if(resultData.updatedId !== undefined){
                this.deliveryService.mobiToast("Updating please wait..", "success").then((result) => {
                    this.navCtrl.setRoot(RequestConfirmationPage, {gotopage: "newrequest", purpose: "eprescription"});
                    // this.navCtrl.pop();
                    // this.navCtrl.setRoot(CheckoutPage, { createdOrderId: resultData.updatedId, payOption:payOption});
                });
            }else{
                this.deliveryService.mobiToast("some technical issue, please contact adminstrator", "danger");
            }
        }) 
	}

    parseDOB(timestamp: any) {
        return moment(timestamp, 'X').format('Mo-MMM-YYYY');
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    close() {
        this.dismiss();
    }

}
