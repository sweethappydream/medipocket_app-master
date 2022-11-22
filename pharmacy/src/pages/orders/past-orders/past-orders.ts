import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DeliveryServiceProvider } from '../../../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../../../providers/temp-storage/temp-storage';
import { OrderStatusPage } from '../../order-status/order-status';
import { AppSettings } from '../../../app/settings';
import { mobiscroll, MbscRangeOptions, MbscListviewOptions } from '@mobiscroll/angular';
import { OrderDetailsPage } from '../order-details/order-details';
import * as moment from 'moment';

/**
 * Generated class for the PastOrdersPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

let now = new Date();
@Component({
  selector: 'page-past-orders',
  templateUrl: 'past-orders.html',
})
export class PastOrdersPage {
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
	constructor(public deliveryService: DeliveryServiceProvider, public tempStorage: TempStorageProvider, public navCtrl: NavController, public navParams: NavParams) {
		this.user_id 							= this.tempStorage.authsession.userdata.user_id;
		this.activeorders 						= [];
		this.showTemplate 						= "list";
		//this.currentOrder 			= this.tempStorage.newOrder;
		this.user_id =  this.tempStorage.authsession.userdata.user_id;
		this.showspinner = false;
		this.filteredData = [];
		// this.filter();
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
		filterObj.list_type  = "pastorder";
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
		console.log('ionViewDidLoad PastOrdersPage');
	}

	ionViewDidEnter() {
		console.log("test");
		this.filter();
		// this.activeorders 				= this.tempStorage.activeOrders;
		// this.getActiveOrders();
	}

	orderDetails(item: any) {
		let sendData : any;
		sendData = {backto: 'activeorderspage', pagetitle: "Active Orders", pageaction: "pickup", order: item,  ordertype: "past"};
		this.navCtrl.push(OrderStatusPage, sendData);
	}

}
