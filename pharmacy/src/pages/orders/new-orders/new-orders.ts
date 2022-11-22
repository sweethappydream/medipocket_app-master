import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { DeliveryServiceProvider } from '../../../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../../../providers/temp-storage/temp-storage';
import { AppSettings } from '../../../app/settings';
import { OrderDetailsPage } from '../order-details/order-details';
import { PastOrdersPage } from '../past-orders/past-orders';
import { mobiscroll, MbscRangeOptions, MbscListviewOptions } from '@mobiscroll/angular';
import * as moment from 'moment';

/**
 * Generated class for the NewOrdersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
let now = new Date();
@Component({
  selector: 'page-new-orders',
  templateUrl: 'new-orders.html',
})
export class NewOrdersPage {
	currentOrder 					: any = null;
	filteredData						: any;
	user_id                                         : any;
	showspinner    : any;

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
	constructor(public tempService: TempStorageProvider, public modalCtrl: ModalController, public deliveryService: DeliveryServiceProvider, public navCtrl: NavController, public navParams: NavParams) {
		this.currentOrder 			= this.tempService.newOrder;
		this.user_id =  this.tempService.authsession.userdata.user_id;
		this.showspinner = false;
		this.filteredData = [];
		//this.filter();
	}

	filter() {
		console.log(this.filters.range);
		console.log(this.filter);
		console.log(range);
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
        let filterObj :any = {};
		filterObj.is_cart  = false;
		filterObj.user_id  = this.user_id;
		filterObj.fromApp  = "pharmacy";
		console.log(this.filters.customRange);
		console.log(this.filter);
		filterObj.start_time  = Number(moment(start).format('X'));
		filterObj.end_time  = Number(moment(end).format('X'));
		filterObj.list_type  = "neworder";
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
        return this.deliveryService.parseUTCTime(utcTimeStamp);
	}
    onChange() {
        setTimeout(() => {
            this.filter();
        });
    }

     showOrderView(item){
        /* let orderDetailModal = this.modalCtrl.create(MapLocationPage, {orderDetail: item, fromPage: 'orderList'});
        orderDetailModal.onDidDismiss(data => {
           // console.log('page > modal dismissed > data > ', data);
            if(data){
            }                
        });
        orderDetailModal.present(); */
	} 
	
	acceptOrder(item:any = {}) {
		console.log(item);
		this.goto('pickup', item);
		  
	}

	rejectOrder() {
		console.log("test");
		let log 			: any = {status: "rejected", datetime: moment().format('X')};
		this.tempService.newOrder.status = "rejected";
		this.tempService.newOrder.log.unshift(log);
		this.tempService.pastOrders.unshift(this.tempService.newOrder);
		this.currentOrder 				= Object.assign(this.tempService.activeOrders);
		this.tempService.resetNewOrder();
		this.navCtrl.setRoot(PastOrdersPage);
	}

	goto(action: any = null, item = {}) {
		console.log(action);
		let sendData : any = {};
		if(action == 'pickup') {
			let sendData : any = {backto: 'default', pagetitle: "Pharmacy Location", pageaction: "pickup", orderDetail: item};
			  // this.navCtrl.push(MapLocationPage, sendData);			
		}
		else if(action == 'orderdetails') {
			sendData = {backto: 'activeorderspage', pagetitle: "Active Orders", pageaction: "orderdetails", order: item, orderid: 0};
			this.navCtrl.push(OrderDetailsPage, sendData);
		}	
	}
	ionViewDidEnter() {
        console.log("enter");
          this.filter()
        
    }

	viewOrder(item: any) {
		let log 			: any = {status: "viewed", datetime: moment().format('X')};
		this.tempService.newOrder.status = "viewed";
		// this.tempService.newOrder.log.unshift(log);
		// this.tempService.activeOrders.unshift(this.tempService.newOrder);
		this.currentOrder 				= Object.assign(this.tempService.activeOrders);
		// this.tempService.resetNewOrder();
		this.goto('orderdetails', item);
	}


	/* goto(action: any = null) {
		let sendData : any = {};
		if(action == 'pickup') {
			sendData = {backto: 'activeorderspage', pagetitle: "Pharmacy Location", pageaction: "pickup", order: this.tempService.newOrder, orderid: 0};
		}
		else if(action == 'orderdetails') {
			sendData = {backto: 'activeorderspage', pagetitle: "Active Orders", pageaction: "orderdetails", order: this.tempService.newOrder, orderid: 0};
			this.navCtrl.push(OrderDetailsPage, sendData);
		}	
	} */
	ionViewDidLoad() {
		console.log('ionViewDidLoad NewOrdersPage');
	}

}
