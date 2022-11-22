import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { DeliveryServiceProvider } from '../../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../../providers/temp-storage/temp-storage';
import { AppSettings } from '../../app/settings';
import { RequestDetailsPage } from '../../pages/request-details/request-details';
import { mobiscroll, MbscRangeOptions, MbscListviewOptions } from '@mobiscroll/angular';
import * as moment from 'moment';

/**
 * Generated class for the NewRequestsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

let now = new Date();
@Component({
  selector: 'page-new-requests',
  templateUrl: 'new-requests.html',
})
export class NewRequestsPage {
	user_id 									: any;
	activeorders 									: any;
	pageTitle 									: any;
	showTemplate 								: any;
	orderstatus 								: any;
	filteredData 								: any;
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
	constructor(public modalCtrl: ModalController, public deliveryService: DeliveryServiceProvider, public tempStorage: TempStorageProvider, public navCtrl: NavController, public navParams: NavParams) {
		this.user_id 							= this.tempStorage.authsession.userdata.user_id;
		this.activeorders 						= [];
		this.orderstatus 						= "init";
		this.showspinner = false;
		this.filter();
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
		filterObj.start_time  = Number(moment(start).format('X'));
		filterObj.end_time  = Number(moment(end).format('X'));
		filterObj.limit  = 20;
        filterObj.request_status = "initiated";
		this.filteredData = [];
		this.deliveryService.get_requests(filterObj).then((result: any) => { 

			this.showspinner = false;
			console.log(result);
			if(result !== undefined){
				this.filteredData = result;
			}else{
				this.filteredData = [];
			}
			
		
		});
		console.log(this.filteredData);
    }
    onChange() {
        setTimeout(() => {
            this.filter();
        });
    }
	ionViewDidLoad() {
	console.log('ionViewDidLoad NewRequestsPage');
	}

	ionViewDidEnter() {
		this.activeorders 						= this.tempStorage.newRequests;
		// console.log(this.activeorders);
	}
	openOrder(item: any) {
		/* let rxdetailsModal = this.modalCtrl.create(RequestDetailsPage, {order: this.activeorders[index], index: index});
        rxdetailsModal.onDidDismiss(data => {
            console.log('page > modal dismissed > data > ', data);
            if(data){
            }                
        });
        rxdetailsModal.present(); */

        this.navCtrl.push(RequestDetailsPage, {order: item, action: "new"})
	}

	formatDT(time: any) {
		console.log(time);
		return moment(time, 'X').format('MMM DD, YYYY HH:mm');
	}
	parseUTCTime(utcTimeStamp){
        return this.deliveryService.parseUTCTime(utcTimeStamp);
	}

}
