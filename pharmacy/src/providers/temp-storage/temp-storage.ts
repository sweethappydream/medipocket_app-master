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
	pharmacyInfo : any = {};
	newOrder 							: any;
	activeOrders						: any;
	pastOrders 							: any;
	constructor(public http: Http) {
		console.log('Hello TempStorageProvider Provider');
		this.authsession 				= {userdata: null};

		this.pharmacyInfo.pharmacy_name = "PHARMACY Name";
        this.pharmacyInfo.pharmacy_address = "No XX Xth street";
        this.pharmacyInfo.pharmacy_country = "US";
        this.pharmacyInfo.pharmacy_state = "VA";
        this.pharmacyInfo.pharmacy_city = "Richmond";
		this.pharmacyInfo.pharmacy_zip = "XXXX";

		this.activeOrders				= [];
		this.pastOrders					= [];
		this.resetNewOrder();
		
	}
	resetNewOrder() {
		this.newOrder 					= {};
		let patient 					: any = [];
			patient.push({
								name: "Bob Rumohr", 
								address: "440 North Euclid Street,Anaheim CA 92801", 
								coords: {lat: "33.836954", long: "-117.941454"},
								verify: {
									pilot: "MA-46675"
								},
								drugs: [{
									name: "Tylenol",
									dosage: "tablet",
									qty: 40,
									strength: "300-30 mg",
									selected: false
								},
								{
									name: "Amoxillin",
									dosage: "tablet",
									qty: 20,
									strength: "160 mg",
									selected: false
								},
								{
									name: "Tylenol Extra strength",
									dosage: "tablet",
									qty: 10,
									strength: "300 mg",
									selected: false
								}],
								prescriptions: [{
									name: "Prescription1.doc"
								},
								{
									name: "Prescription2.doc"
								}]
							});
			patient.push({
								name: "Russell panter", 
								address: "7901 Watt Avenue,Antelope CA 95843", 
								coords: {lat: "38.712346", long: "-121.392048"},
								verify: {
									pilot: "MA-78675"
								},
								drugs: [{
									name: "Tylenol",
									dosage: "tablet",
									qty: 40,
									strength: "300-30 mg",
									selected: false
								},
								{
									name: "Amoxillin",
									dosage: "tablet",
									qty: 20,
									strength: "160 mg",
									selected: false
								},
								{
									name: "Tylenol Extra strength",
									dosage: "tablet",
									qty: 10,
									strength: "300 mg",
									selected: false
								}],
								prescriptions: [{
									name: "Prescription1.doc"
								},
								{
									name: "Prescription2.doc"
								}]
							});
			patient.push({
								name: "Kate williamson", 
								address: "20251 Hwy 18,Apple Valley CA 92307", 
								coords: {lat: "34.526579", long: "-117.221709"},
								verify: {
									pilot: "MA-54654"
								},
								drugs: [{
									name: "Tylenol",
									dosage: "tablet",
									qty: 40,
									strength: "300-30 mg",
									selected: false
								},
								{
									name: "Amoxillin",
									dosage: "tablet",
									qty: 20,
									strength: "160 mg",
									selected: false
								},
								{
									name: "Tylenol Extra strength",
									dosage: "tablet",
									qty: 10,
									strength: "300 mg",
									selected: false
								}],
								prescriptions: [{
									name: "Prescription1.doc"
								},
								{
									name: "Prescription2.doc"
								}]
							});
			patient.push({
								name: "George billy", 
								address: "13487 Camino Canada,El Cajon CA 92021", 
								coords: {lat: "32.825293", long: "-116.901472"},
								verify: {
									pilot: "MA-12345"
								},
								drugs: [{
									name: "Tylenol",
									dosage: "tablet",
									qty: 40,
									strength: "300-30 mg",
									selected: false
								},
								{
									name: "Amoxillin",
									dosage: "tablet",
									qty: 20,
									strength: "160 mg",
									selected: false
								},
								{
									name: "Tylenol Extra strength",
									dosage: "tablet",
									qty: 10,
									strength: "300 mg",
									selected: false
								}],
								prescriptions: [{
									name: "Prescription1.doc"
								},
								{
									name: "Prescription2.doc"
								}]
							});
			patient.push({
								name: "Michael gill", 
								address: "300 Chadbourne Road,Fairfield CA 94534", 
								coords: {lat: "38.237322", long: "-122.083758"},
								verify: {
									pilot: "MA-12345"
								},
								drugs: [{
									name: "Tylenol",
									dosage: "tablet",
									qty: 40,
									strength: "300-30 mg"
								},
								{
									name: "Amoxillin",
									dosage: "tablet",
									qty: 20,
									strength: "160 mg"
								},
								{
									name: "Tylenol Extra strength",
									dosage: "tablet",
									qty: 10,
									strength: "300 mg"
								}],
								prescriptions: [{
									name: "Prescription1.doc"
								},
								{
									name: "Prescription2.doc"
								}]
							});
		let pilot 					: any = [];
			pilot.push({
								name: "John dee", 
								identity: {name: "driver license", id: "WX43LP"}, 
								coords: {lat: "32.869556", long: "-117.230638"},
							});
			pilot.push({
								name: "Shaun Ruve", 
								identity: {name: "driver license", id: "XUV123"},
								coords: {lat: "33.952390", long: "-116.527182"},
							});
			pilot.push({
								name: "Joseph doe", 
								identity: {name: "driver license", id: "ACD467"},
								coords: {lat: "33.797455", long: "-116.397236"},
							});
			pilot.push({
								name: "Fernando Louie", 
								identity: {name: "driver license", id: "NGX505"},
								coords: {lat: "33.802836", long: "-116.458647"},
							});
		let order_id 					: any = Math.floor(100000 + Math.random() * 900000);
		let pickup_verify 				: any = Math.floor(100000 + Math.random() * 900000);
		let delivery_verify 			: any = Math.floor(100000 + Math.random() * 900000);
		let currPatient 				: any = patient[Math.floor(Math.random()*patient.length)];
		let currPilot					: any = pilot[Math.floor(Math.random()*pilot.length)];
			
		this.newOrder 					= {
											id: order_id, 
											patient_name: currPatient.name, 
											status: "init", 
											drugs: currPatient.drugs,
											pilot: currPilot, 
											delivery: currPatient,
											verify: {
												pilot: "MD-" + pickup_verify
											},
											prescriptions: currPatient.prescriptions,
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
