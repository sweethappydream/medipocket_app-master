import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { DeliveryServiceProvider } from '../../../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../../../providers/temp-storage/temp-storage';
import { OrderStatusPage } from '../../order-status/order-status';
import { AppSettings } from '../../../app/settings';
import { mobiscroll, MbscRangeOptions, MbscListviewOptions } from '@mobiscroll/angular';
import { OrderDetailsPage } from '../order-details/order-details';
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
		this.filteredData = [];
		
		this.showTemplate 						= "list";
		//this.currentOrder 			= this.tempStorage.newOrder;
		this.user_id =  this.tempStorage.authsession.userdata.user_id;
		this.showspinner = false;
	//	this.filter();
	}

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
        let filterObj :any = {};
		filterObj.is_cart  = false;
		filterObj.user_id  = this.user_id;
		filterObj.fromApp  = "pharmacy";
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

	switchTemplate(action: any = null) {
		this.showTemplate						= action;
	}
	openOrder(index: any) {
		this.navCtrl.push(OrderStatusPage, {order: this.tempStorage.activeOrders[index], orderindex: index, ordertype: 'active'});
		// this.switchTemplate("confirmation");
	}

	orderDetails(item: any) {
		let sendData : any;
		sendData = {backto: 'activeorderspage', pagetitle: "Active Orders", pageaction: "pickup", order: item, orderid: 0};
		this.navCtrl.push(OrderDetailsPage, sendData);
	}
}
