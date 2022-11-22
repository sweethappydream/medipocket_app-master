import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppSettings } from '../../app/settings';
import * as moment from 'moment';

/*
  Generated class for the TempStorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TempStorageProvider {
	profile 							: any;
	membershipsetting 					: any = AppSettings.membership;
	user_id 							: any = AppSettings.userid;
	authsession 						: any;
	newRequests 						: any;
	pastRequests 						: any;
	doctor								: any;
	constructor(public http: Http) {
		console.log('Hello TempStorageProvider Provider');
		this.authsession 				= {userdata: null};
		this.pastRequests				= [];
		this.doctor 					= {
			name 						: "Dr. Sara Jones",
			hospital 					: "Global hospital"
		}
		this.resetNewRequest()
	}

	resetNewRequest() {
		this.newRequests				= [];
		let patient 					: any = [];
			patient.push({
								name: "Bob Rumohr", 
								drugs: [],
								reason: "Need antibiotic",
								pharmacy: "CVS Pharmacy"
							});
			patient.push({
								name: "Russell panter", 
								drugs: [],
								reason: "Need antibiotic",
								pharmacy: "ABC Pharmacy"
							});
			patient.push({
								name: "Kate williamson", 
								drugs: [],
								reason: "Need antibiotic",
								pharmacy: "XYZ Pharmacy"
							});
			patient.push({
								name: "Kate williamson", 
								drugs: [],
								reason: "Need antibiotic",
								pharmacy: "NGC Pharmacy"
							});
			patient.push({
								name: "Michael gill", 
								drugs: [],
								reason: "Need antibiotic",
								pharmacy: "Rado Pharmacy"
							});

			let order_id 					: any = Math.floor(100000 + Math.random() * 900000);
			let currPatient 				: any = patient[Math.floor(Math.random()*patient.length)];
				
			this.newRequests 				= [];

			for(let x = 0; x <= 5; x++) {
				let item : any = {
									id: Math.floor(100000 + Math.random() * 900000), 
									patient: patient[Math.floor(Math.random()*patient.length)],
									timestamp: moment().format('X'), 
									status: "init",
									log: []
								}
				this.newRequests.push(item);
			}
	}
	setAuthSession(userdata: any = null) {
		this.authsession				= {userdata: userdata}
	}
	clearAuthSession() {
		this.authsession				= {userdata: null};
	}
	clearSession() {
		
	}

}
