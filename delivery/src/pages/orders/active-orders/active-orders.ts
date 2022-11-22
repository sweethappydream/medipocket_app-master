import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { DeliveryServiceProvider } from '../../../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../../../providers/temp-storage/temp-storage';
import { AppSettings } from '../../../app/settings';
import { MapLocationPage } from '../../../pages/map-location/map-location';
import { ActiveOrderDetailsPage } from '../active-order-details/active-order-details';
import { mobiscroll, MbscRangeOptions, MbscListviewOptions } from '@mobiscroll/angular';
import * as moment from 'moment';
/**
 * Generated class for the ActiveOrdersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 let now = new Date();

@Component({
  selector: 'page-active-orders',
  templateUrl: 'active-orders.html',
})
export class ActiveOrdersPage {
	user_id 									: any;
	activeorders 									: any;
	pageTitle 									: any;
	showTemplate 								: any;
	orderstatus 								: any;
	showspinner: any;
	filteredData						: any;
	
	rangeSettings: MbscRangeOptions = {
        showSelector: false
    };
	filters: any = {
        range: 'today',
        calls: true,
        meetings: true,
        customRange: [
            new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)
        ]
    }

   
    listviewSettings: MbscListviewOptions = {
        enhance: true,
        swipe: false,
        striped: true
	};
	
	constructor(public modalCtrl: ModalController, public deliveryService: DeliveryServiceProvider, public tempStorage: TempStorageProvider, public navCtrl: NavController, public navParams: NavParams) {
		this.user_id 							= this.tempStorage.authsession.userdata.user_id;
		this.activeorders 						= [];
		
		this.showTemplate 						= "list";
		//this.currentOrder 			= this.tempStorage.newOrder;
		this.user_id =  this.tempStorage.authsession.userdata.user_id;
		this.showspinner = false;
		this.filteredData = [];
		//this.filter();
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad activeordersPage');
		this.pageTitle 							= "Active orders";
		this.showTemplate 						= "list";
	}

	ionViewDidEnter() {
		console.log("test");
		this.filter();
		// this.activeorders 				= this.tempStorage.activeOrders;
		// this.getActiveOrders();
		// this.activeorders 						= this.tempStorage.activeOrders;
	}
   /*
	getActiveOrders() {
		let postData                     	   : any;
			postData						   = {};
			postData.user_id 				   = this.user_id;
            postData.user_type                 = AppSettings.usertype;
            console.log(this.tempStorage.activeOrders.length);
            if(this.tempStorage.activeOrders.length <= 0) {
            	this.deliveryService.getActiveOrders(postData).then((result) => { 
		            let resultData                  : any;
		                resultData                  = result;
		            if(typeof resultData !== "undefined" )
		            {
		                this.activeorders 					= resultData.outdata;
		                this.tempStorage.activeOrders		= resultData.outdata;
		            }else{
						
					}
				},
				(error)=>{
					console.log(error);
				}); 
            }
            else{
            	this.activeorders 				= this.tempStorage.activeOrders;
            	console.log(this.activeorders);
            }
         	
	}

	switchTemplate(action: any = null) {
		this.showTemplate						= action;
	} */
	
	
	filter() {
        var i,
            item,
            start,
            end,
            range,
            filteredData = [];
			this.filteredData = [];
			this.showspinner = true;

        switch (this.filters.range) {

			case 'today':
				start = new Date(now.setHours(0, 0, 0, 0));
				end = new Date(now.setHours(23, 59, 59, 999));
				// console.log(start);
				// console.log(end);
				break;
			case 'week':
				start = new Date(
					now.getFullYear(),
					now.getMonth(),
					now.getDate() - (6 - now.getDay()), 0, 0, 0, 0
				);
				end = new Date(
					now.setHours(23, 59, 59, 999)
				);
				break;
			default:
				range = this.filters.customRange;
				start = range[0];
				end = range[1];
				end = moment(end).hours(23);
				end = moment(end).minutes(59);
				end = moment(end).seconds(59);

        }

      /* for (i = 0; i < this.data.length; i++) {
            item = this.data[i];
            if ((
                    (item.type == 'call' && this.filters.calls) ||
                    (item.type == 'meeting' && this.filters.meetings)
                ) && (item.date >= start) && (item.date <= end)) {
                filteredData.push(item);
            }
		}*/
		                let filterObj :any = {};
						filterObj.is_cart  = false;
						filterObj.user_id  = this.user_id;
						filterObj.fromApp  = "delivery";
						filterObj.start_time  = Number(moment(start).format('X'));
						filterObj.end_time  = Number(moment(end).format('X'));
						filterObj.list_type  = "activeorder";
						filterObj.limit  = 20;
						this.filteredData = [];
						this.deliveryService.checkUserCart(filterObj).then((result: any) => { 

							this.showspinner = false;
						
							if(result !== undefined && result.data !== undefined){
								this.filteredData = result.data;
							}else{
								this.filteredData = [];
							}
							
						
						});	

		//this.filteredData = filteredData;
		console.log(this.filteredData);
    }
    parseUTCTime(utcTimeStamp){
        //console.log( moment.unix(utcTimeStamp).toDate());
        //console.log(moment.unix(utcTimeStamp));
        //console.log(moment.utc(utcTimeStamp).local());
        //console.log(moment.utc(utcTimeStamp).local().toDate());

        return this.deliveryService.parseUTCTime(utcTimeStamp);
	}
    onChange() {
        setTimeout(() => {
            this.filter();
        });
    }

	/*
	openOrder(index: any) {
		this.navCtrl.push(ActiveOrderDetailsPage, {order: this.tempStorage.activeOrders[index], orderindex: index, ordertype: 'active'});
		// this.switchTemplate("confirmation");
	} */

	acceptOrder(item:any = {}) {
		console.log(item);
		/*let log 			: any = {status: "accepted", datetime: moment().format('X')};
		this.tempService.newOrder.status = "accepted";
		this.tempService.newOrder.log.unshift(log);
		this.tempService.activeOrders.unshift(this.tempService.newOrder);
		this.currentOrder 				= Object.assign(this.tempService.activeOrders);
		this.tempService.resetNewOrder();
		  this.goto('pickup'); */
		  this.goto('pickup', item);
		  
	}

	goto(action: any = null, item :any = {}) {
		console.log(action);
		console.log(item);
		if(item.order_status == "pickedup-package"){

			let sendData : any = {backto: 'default', pageaction: "delivery", pagetitle: "Delivery Location", orderDetail: item, orderid: item._id};
				   this.navCtrl.push(MapLocationPage, sendData);		
				   
		}else{
			let sendData: any ;
			if(action == 'pickup') {

				if (item.rxPickup !== undefined && item.rx && item.rx.length > 0 && item.rxPickup.status != "picked") {

					console.log("rx pickup");

					sendData = { backto: 'default', pagetitle: "Rx Pickup Location", pageaction: "rx-pickup", orderDetail: item };

				} else {

					console.log("else");

				   sendData  = {backto: 'default', pagetitle: "Pharmacy Location", pageaction: "pickup", orderDetail: item};
				
				}
				
				this.navCtrl.push(MapLocationPage, sendData);			

				

			}else{
				
			}
	 }
	}
}
