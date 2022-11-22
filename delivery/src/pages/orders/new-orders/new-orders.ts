import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { DeliveryServiceProvider } from '../../../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../../../providers/temp-storage/temp-storage';
import { AppSettings } from '../../../app/settings';
import { MapLocationPage } from '../../../pages/map-location/map-location';
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
    
    showOrderView(item){
        let orderDetailModal = this.modalCtrl.create(MapLocationPage, {orderDetail: item, fromPage: 'orderList'});
        orderDetailModal.onDidDismiss(data => {
           // console.log('page > modal dismissed > data > ', data);
            if(data){
            }                
        });
        orderDetailModal.present();
	}
	
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

	rejectOrder() {
		console.log("test");
		let log 			: any = {status: "rejected", datetime: moment().format('X')};
		this.tempService.newOrder.status = "rejected";
		this.tempService.newOrder.log.unshift(log);
		this.tempService.pastOrders.unshift(this.tempService.newOrder);
		this.currentOrder 				= Object.assign(this.tempService.activeOrders);
		this.tempService.resetNewOrder();
		this.navCtrl.setRoot(PastOrdersPage);
		// this.switchTemplate("list");
	}

	goto(action: any = null, item : any = {}) {
		console.log(action);
		if(action == 'pickup') {
			let sendData : any = {};
			if (item.rxPickup !== undefined && item.rx && item.rx.length > 0 && item.rxPickup.status != "picked") {

				console.log("rx pickup");

				sendData = { backto: 'default', pagetitle: "Rx Pickup Location", pageaction: "rx-pickup", orderDetail: item };

			} else {

				console.log("else up");
				sendData = { backto: 'default', pagetitle: "Pharmacy Location", pageaction: "pickup", orderDetail: item };
				

			}
			  this.navCtrl.push(MapLocationPage, sendData);			
		}
	}
	ionViewDidLoad() {
		console.log('ionViewDidLoad NewOrdersPage');
	}
	ionViewDidEnter() {
		console.log("enter");
		this.filter();
        
    }

}
