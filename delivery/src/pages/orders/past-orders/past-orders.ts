import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DeliveryServiceProvider } from '../../../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../../../providers/temp-storage/temp-storage';
import { AppSettings } from '../../../app/settings';
import { ActiveOrderDetailsPage } from '../active-order-details/active-order-details';
import { mobiscroll, MbscRangeOptions, MbscListviewOptions } from '@mobiscroll/angular';
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
		
		// this.getPastOrders();
		this.showspinner = false;
		this.filteredData = [];
		//this.filter();
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
					now.getDate() - (7 - now.getDay()), 0, 0, 0, 0
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
	
/*	getPastOrders() {
		let postData                     	   : any;
			postData						   = {};
			postData.user_id 				   = this.user_id;
            postData.user_type                 = AppSettings.usertype;
         	this.deliveryService.getPastOrders(postData).then((result) => { 
	            let resultData                  : any;
	                resultData                  = result;
	            if(typeof resultData !== "undefined" )
	            {
	                this.pastorders = resultData.outdata;
	            }else{
					
				}
			},
			(error)=>{
				console.log(error);
			}); 
	}*/
	acceptOrder(item:any){

	}
	openOrder(index: any) {
		this.navCtrl.push(ActiveOrderDetailsPage, {order: this.tempStorage.pastOrders[index], orderindex: index, ordertype: "past"});
		// this.switchTemplate("confirmation");
	}

}
