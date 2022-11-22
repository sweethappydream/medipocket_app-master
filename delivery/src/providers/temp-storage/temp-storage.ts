import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AppSettings } from '../../app/settings';

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
	newOrder 							: any;
	activeOrders						: any;
	pastOrders 							: any;
	patientInfo							: any;
	constructor(public http: Http) {
		console.log('Hello TempStorageProvider Provider');
		this.authsession 				= {userdata: null};
		this.activeOrders				= [];
		this.pastOrders					= [];
		this.patientInfo			   = {};
		this.resetNewOrder();
	}

	resetNewOrder() {
		this.newOrder 					= {};
		let patient 					: any = [];
		this.patientInfo				= {};
			patient.push({
								name: "Bob Rumohr", 
								address: "440 North Euclid Street,Anaheim CA 92801", 
								coords: {lat: "33.836954", long: "-117.941454"},
							});
			patient.push({
								name: "Russell panter", 
								address: "7901 Watt Avenue,Antelope CA 95843", 
								coords: {lat: "38.712346", long: "-121.392048"},
							});
			patient.push({
								name: "Kate williamson", 
								address: "20251 Hwy 18,Apple Valley CA 92307", 
								coords: {lat: "34.526579", long: "-117.221709"},
							});
			patient.push({
								name: "George billy", 
								address: "13487 Camino Canada,El Cajon CA 92021", 
								coords: {lat: "32.825293", long: "-116.901472"},
							});
			patient.push({
								name: "Michael gill", 
								address: "300 Chadbourne Road,Fairfield CA 94534", 
								coords: {lat: "38.237322", long: "-122.083758"},
							});
		let pharmacy 					: any = [];
			pharmacy.push({
								name: "CVS pharmacy", 
								address: "8831 Villa La Jolla Dr, La Jolla, CA 92037, USA", 
								coords: {lat: "32.869556", long: "-117.230638"},
							});
			pharmacy.push({
								name: "Ralphs pharmacy", 
								address: "425 S Sunrise Way Bldg A, Palm Springs, CA 92262, USA", 
								coords: {lat: "33.952390", long: "-116.527182"},
							});
			pharmacy.push({
								name: "Walmart Pharmacy", 
								address: "72314 CA-111, Palm Desert, CA 92260, USA", 
								coords: {lat: "33.797455", long: "-116.397236"},
							});
			pharmacy.push({
								name: "Walgreens Pharmacy", 
								address: "33975 Date Palm Dr, Cathedral City, CA 92234, USA", 
								coords: {lat: "33.802836", long: "-116.458647"},
							});
		let order_id 					: any = Math.floor(100000 + Math.random() * 900000);
		let pickup_verify 				: any = Math.floor(100000 + Math.random() * 900000);
		let delivery_verify 			: any = Math.floor(100000 + Math.random() * 900000);
		let currPatient 				: any = patient[Math.floor(Math.random()*patient.length)];
		let currPharmacy 				: any = pharmacy[Math.floor(Math.random()*pharmacy.length)];
			
		this.newOrder 					= {
											id: order_id, 
											patient_name: currPatient.name, 
											status: "init", 
											pickup: currPharmacy, 
											delivery: currPatient,
											verify: {
												pickup: "MD-" + pickup_verify,
												delivery: "MD-" + delivery_verify
											},
											log: []
										};
	}
	setAuthSession(userdata: any = null) {
		this.authsession				= {userdata: userdata}
	}
	clearAuthSession() {
		this.authsession				= {userdata: null};
	}
	clearSession() {
		
	}

	sliceOrder(index: any = null, order: any = null) {
		if(order == 'active') {
			this.activeOrders.splice(index, 1);
		}
	}



}
