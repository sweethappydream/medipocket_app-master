import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, Navbar, Platform } from 'ionic-angular';
import { mobiscroll, MbscPopupOptions } from '@mobiscroll/angular';
import { DeliveryServiceProvider } from '../../providers/delivery-service/delivery-service';
import { TempStorageProvider } from '../../providers/temp-storage/temp-storage';
import { ActiveOrdersPage } from '../../pages/orders/active-orders/active-orders';
import { NewOrdersPage } from '../../pages/orders/new-orders/new-orders';
import { OrderVerifyPage } from '../../pages/orders/order-verify/order-verify';
import { Geolocation } from '@ionic-native/geolocation';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

import * as moment from 'moment';


/**
 * Generated class for the MapLocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;
@Component({
	selector: 'page-map-location',
	templateUrl: 'map-location.html',
})
export class MapLocationPage {
	pageTitle: any;
	pageAction: any;
    @ViewChild(Navbar) navBar: Navbar;
	@ViewChild('map') mapElement: ElementRef;
    @ViewChild('directionsPanel') directionsPanel: ElementRef;
    map: any;
    directionService: any;
    distanceMatrixService: any;
    directionsDisplay : any;
    displayWalkSpinner: any;
    loggedData : any = "";
    currentLatLng : any;
    currentLocation: any;
    loadWalkSpinner: any;
    idleLatLng: any;
    traveltime: any = null;
    startMarker: any;
    stopMarker: any;
    displayData: any;
    backto: any;
    currentOrder: any;
    currentOrderId: any;
    user_id: any;
    isLoading: any;
    getDistanceMatrix : any;
    patientInfo : any;
    settings: MbscPopupOptions = {
        display: 'center',
        buttons: [
            {
                text: 'Close',
                handler: 'cancel'
            },
            {
                text: 'Pick up & Leave',
                handler: 'set'
            }
        ],
        onSet: (event, inst) => {
            // Your custom event handler goes here
            this.markAsPicked();
           
        },
        onClose: (event, inst) => {
            // Your custom event handler goes here
        }
    };
	constructor(public launchNavigator: LaunchNavigator, public platform: Platform, public tempService: TempStorageProvider, public viewCtrl: ViewController, public deliveryService: DeliveryServiceProvider, public ngzone: NgZone, public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public geolocation: Geolocation) {
        this.user_id =  this.tempService.authsession.userdata.user_id;
        this.pageTitle							= this.navParams.get('pagetitle');
		this.pageAction 						= this.navParams.get('pageaction');
        this.backto                             = this.navParams.get('backto');
        this.isLoading                          = false;
        this.patientInfo                    = {};
        this.currentOrder                       = this.navParams.get('orderDetail');
        
        if (this.currentOrder.rxPickup == undefined){
            this.currentOrder.rxPickup = {
                address : {}
            };
            
        }else{
            if (this.currentOrder.rxPickup.address == undefined) {
                this.currentOrder.rxPickup.address = {};
            }
        }

        this.getDistanceMatrix                      = {};
        if(this.currentOrder !== undefined && this.currentOrder !== null){
           this.currentOrderId                     = this.currentOrder._id   ;
        }
       // console.log(this.navParams);
       // console.log(this.currentOrder);
       if(this.pageAction == 'pickup'){



       } else if (this.pageAction == 'rx-pickup') {
            console.log(this.settings);
           if (this.tempService.patientInfo == undefined || this.tempService.patientInfo.name == undefined) {
               this.getPatientInfo();
           } else {

               this.patientInfo = this.tempService.patientInfo;

           }

           console.log(this.patientInfo);

       }else{
       // this.getPatientInfo();
       
       //console.log(this.patientInfo);
           if (this.tempService.patientInfo == undefined || this.tempService.patientInfo.name == undefined){
                this.getPatientInfo();
          }else{

            this.patientInfo = this.tempService.patientInfo;

          }
       }
       
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad MapLocationPage');
        this.displayData                         = false;
        if(this.backto == 'activeorderspage') {
            this.navBar.backButtonClick = () => {
              // you can set a full custom history here if you want 
                // if(this.backto == 'activeorderspage') {
                    let pages = [
                      {
                        page: ActiveOrdersPage
                      }
                    ];
                // }
                
                this.navCtrl.setPages(pages);
            }
        }else{

        }
		this.loadMap();
    }
    
    getPatientInfo(){

		this.deliveryService.profileInfo("patient", this.currentOrder.user_id).then((result:any)=>{

				console.log(result);
				if(result.data !== undefined){
				this.patientInfo = result.data;
				console.log(this.patientInfo);
				console.log(result.data);
				this.tempService.patientInfo = this.patientInfo
				}else{
					this.patientInfo = {};
				this.tempService.patientInfo = this.patientInfo
				}

		});

}
	loadMap(){

        console.log("map called");
       this.isLoading = true;

        this.geolocation.getCurrentPosition().then((position) => {

            console.log(position.coords.latitude, position.coords.longitude);
            let latitude = 13.10386;
            let longitude = 80.20000;

             this.currentLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            
            
            if(this.pageAction == 'pickup') {
                //this.currentLatLng    = new google.maps.LatLng(34.102707, -117.907921);
                latitude         = this.currentOrder.pharmacy.lat;
                longitude        = this.currentOrder.pharmacy.lng;
            } else if (this.pageAction == 'rx-pickup') {
                //this.currentLatLng = new google.maps.LatLng(34.102707, -117.907921);
                latitude = this.currentOrder.rxPickup.address.latitude;
                longitude = this.currentOrder.rxPickup.address.longitude;
            }
            else{
                // becsue it is delivery , still i can show from current address
               // this.currentLatLng    = new google.maps.LatLng(this.currentOrder.pharmacy.lat, this.currentOrder.pharmacy.lng);
                latitude         = this.currentOrder.deliveryInfo.address.latitude;
                longitude        = this.currentOrder.deliveryInfo.address.longitude;
                //this.getPatientInfo(); // called in other place
            }
           // this.idleLatLng = new google.maps.LatLng(latitude, longitude);
           this.idleLatLng = [latitude, longitude];
           let  idleLatLng  = new google.maps.LatLng(this.idleLatLng[0], this.idleLatLng[1]);
             let mapOptions = {
                center: this.currentLatLng,
                zoom: 17,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true,
                tilt: 30,
                compass: true,
                myLocationButton: true,
              }

            this.directionService = new google.maps.DirectionsService;
            this.directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
            this.distanceMatrixService = new google.maps.DistanceMatrixService();

            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

            this.stopMarker = new google.maps.Marker({
                  position: idleLatLng,
                  map: this.map,
                  icon: '././assets/imgs/current-location-blue.png'
            });

            google.maps.event.addListener(this.map, 'dragend', () => {
                console.log("teete");
                this.loadWalkSpinner = true;
            })

            // google.maps.event.addListener(this.map, 'idle', () => {
                var geocoder = new google.maps.Geocoder;
                let newlatlng = this.map.getCenter();
                this.displayWalkSpinner = true;
                geocoder.geocode({'location': newlatlng}, (results, status) => {
                    if (status === 'OK') {
                        if (results[0]) {
                            this.ngzone.run(() => {
                                this.directionsDisplay.setMap(this.map);
                                this.directionsDisplay.setPanel(this.directionsPanel.nativeElement);

                                this.calculateDuration(this.currentLatLng, idleLatLng);
                                this.directionService.route({
                                  origin: this.currentLatLng,
                                  destination: idleLatLng,
                                  optimizeWaypoints: false,
                                  avoidTolls: true,
                                  travelMode: 'DRIVING'
                                }, (response, status) => {
                                    this.ngzone.run(() => {
                                        this.displayData                 = true;
                                        console.log(response);
                                        if (status === 'OK') {
                                            this.directionsDisplay.setDirections(response);
                                            this.directionsDisplay.setOptions({
                                                polylineOptions: {
                                                            strokeWeight: 4,
                                                            strokeOpacity: 1,
                                                            strokeColor:  '#00d6ba'
                                                        }
                                                });
                                            this.startMarker = new google.maps.Marker({
                                                  position: this.currentLatLng,
                                                  map: this.map,
                                                  icon: '././assets/imgs/current-location-blue.png'
                                            });
                                             this.isLoading = false;
                                            // this.currentLocation.distance = response.routes[0].legs[0].distance;
                                            // this.currentLocation.duration = response.routes[0].legs[0].duration;
                                        } else {
                                            this.deliveryService.mobiToast('Directions request failed due to ' + status, 'danger');
                                            console.log('Directions request failed due to ' + status);
                                            this.isLoading = false;
                                        }
                                        this.displayWalkSpinner = false;
                                    });
                                }); 
                            }); 
                            
                        } else {
                            console.log('No results found');
                        }
                    } else {
                        console.log('Geocoder failed due to: ' + status);
                    }
                });

                setTimeout(() => {
                    // this.watchPosition();
                },4000);
                // parkingMarker.setPosition(newlatlng);
                console.log(newlatlng.lat());
                console.log(newlatlng.lng());
            // });


            /* let circle = new google.maps.Circle({
              map: this.map,
                strokeColor: '#1976D2',
                strokeOpacity: 0.3,
                strokeWeight: 1,
                fillColor: '#03A9F4',
                fillOpacity: 0.2,
                radius: 200
            });
            circle.bindTo('center', this.startMarker, 'position'); */
     
        }, (err) => {
                  console.log(err);
        });

    }

    watchPosition() {
        console.log("teststts");
           let  idleLatLng  = new google.maps.LatLng(this.idleLatLng[0], this.idleLatLng[1]);
        this.geolocation.getCurrentPosition().then((position) => {
            let currentLatLng : any 
            currentLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            // currentLatLng = new google.maps.LatLng(13.1193746, 80.1507648);
            var geocoder = new google.maps.Geocoder;
                let newlatlng = this.map.getCenter();
                //newlatlng = currentLatLng = new google.maps.LatLng(13.1193746, 80.1507648);
            newlatlng     = currentLatLng;
                this.displayWalkSpinner = true;
                geocoder.geocode({'location': newlatlng}, (results, status) => {
                    if (status === 'OK') {
                        if (results[0]) {
                            this.ngzone.run(() => {
                                this.directionsDisplay.setMap(this.map);
                                this.directionsDisplay.setPanel(this.directionsPanel.nativeElement);

                                this.calculateDuration(newlatlng, idleLatLng);
                                this.directionService.route({
                                  origin: newlatlng,
                                  destination: idleLatLng,
                                  optimizeWaypoints: false,
                                  avoidTolls: true,
                                  travelMode: 'DRIVING'
                                }, (response, status) => {
                                    this.ngzone.run(() => {
                                        console.log(response);
                                        if (status === 'OK') {
                                            this.directionsDisplay.setDirections(response);
                                            this.startMarker.setPosition(newlatlng);
                                            // this.currentLocation.distance = response.routes[0].legs[0].distance;
                                            // this.currentLocation.duration = response.routes[0].legs[0].duration;
                                        } else {
                                            console.log('Directions request failed due to ' + status);
                                        }
                                        this.displayWalkSpinner = false;
                                    });
                                }); 
                            }); 
                            
                        } else {
                            console.log('No results found');
                        }
                    } else {
                        console.log('Geocoder failed due to: ' + status);
                    }
                });
        }, (err) => {
                  console.log(err);
        });
    }

    markAsPicked() {
        //rxPickup.status = picked
        // console.log(this.idleLatLng);
        // if(1==1){
        //    return false;
        // }

        let item = this.currentOrder;
        let orderData: any = {};
        orderData.activities = item.activities;

        if (orderData.activities === undefined || orderData.activities == null || orderData.activities == "") {

            orderData.activities = [];

        }

        orderData.activities.push(
            { msg: "Rx picked from location", created_at: moment().format("X"), by: this.user_id }
        );

        orderData.rxPickup     = item.rxPickup;
        orderData.rxPickup.status = "picked";
         

        this.deliveryService.mobiToast("Accepting, please wait ...", "success");
        // console.log(mobiToester);
        this.deliveryService.createOrder(orderData, item._id).then((result) => {
            // this.submitted = false;   
            this.currentOrder.activities = orderData.activities; // update local variabl
            //  this.openNavigator();
            this.currentOrder.rxPickup.status = "picked"
            this.navCtrl.setRoot(ActiveOrdersPage);

        })

    }

    accept(){
       // console.log(this.idleLatLng);
       // if(1==1){
        //    return false;
       // }

        this.deliveryService.mobiconfirm("Do you want to accept this order?").then(value => {
            if (value) {
                
                let item = this.currentOrder;
                let orderData: any = {};
                orderData.activities = item.activities;

                if (orderData.activities === undefined || orderData.activities == null || orderData.activities == "") {

                    orderData.activities = [];

                }

                orderData.activities.push(
                    { msg: "Pickup accepted", created_at: moment().format("X"), by: this.user_id }
                );
                orderData.order_status = 'pickup-accepted';
                orderData.picked_by = this.user_id;

                let mobiToester = this.deliveryService.mobiToast("Accepting, please wait ...", "success");
                // console.log(mobiToester);
                this.deliveryService.createOrder(orderData, item._id).then((result) => {
                    // this.submitted = false;   
                    this.currentOrder.activities = orderData.activities; // update local variabl
                    this.currentOrder.picked_by = this.user_id;// // update local variabl
                    this.currentOrder.order_status = orderData.order_status;// // update local variabl


                    // sending user notificaiton start
                    if (this.pageAction == 'rx-pickup'){
                    console.log(this.patientInfo);
                    let postData: any = {};
                    postData.msg = "Medipocket driver is arriving to pick Rx.";
                    postData.action = "rx-pickup";
                    postData.purpose = "notify";
                    postData.to = this.patientInfo.phone; //this.profileInfo.phone,
                    postData.user_id = this.user_id,
                        // this.deliveryService.mobiToast('Sending OTP, Please wait...', 'success');
                        this.deliveryService.registerGetOTP(postData).then((result) => {


                        });
                    }    
                        // sending user notification
                        
                    this.openNavigator();

                })  

            }else{

            }
        });

        

    }

    openNavigator(){

        if (this.platform.is('cordova')) {   

            if(this.platform.is('ios')){

            }else{

            }
             
            var app;
             this.launchNavigator.isAppAvailable(this.launchNavigator.APP.GOOGLE_MAPS).then(success =>{
                 
                 app = this.launchNavigator.APP.GOOGLE_MAPS;

                 let options: LaunchNavigatorOptions = {
                    // start: 'London, ON',
                     app: app
                 };

                // if(isAvailable){
                //     app = launchnavigator.APP.GOOGLE_MAPS;
                // }else{
                 //    console.warn("Google Maps not available - falling back to user selection");
                 //    app = launchnavigator.APP.USER_SELECT;
                // }  
                 this.launchNavigator.navigate(this.idleLatLng, options)
                     .then(
                         success => console.log('Launched navigator'),
                         error => console.log('Error launching navigator', error)
                     );
                 },
                 error =>{
                     
                     if(this.platform.is('ios')){
                        app = this.launchNavigator.APP.APPLE_MAPS;
                     }else{
                         app = this.launchNavigator.APP.USER_SELECT;
                     }

                     let options: LaunchNavigatorOptions = {
                       //  start: 'London, ON',
                         app: app
                     };
                     this.launchNavigator.navigate(this.idleLatLng, options)
                     .then(
                         success => console.log('Launched navigator'),
                         error => console.log('Error launching navigator', error)
                     );
                 }
             );       
         } 

    }

    reject(){

        this.deliveryService.mobiconfirm("Do you want to cancel this order?").then(value => {
            if (value) {

                let item = this.currentOrder;
                let orderData: any = {};
                orderData.activities = item.activities;

                if (orderData.activities === undefined || orderData.activities == null || orderData.activities == "") {

                    orderData.activities = [];

                }

                orderData.activities.push(
                    { msg: "Pickup rejected", created_at: moment().format("X"), by: this.user_id }
                );
                orderData.order_status = 'pickup-rejected';
                orderData.picked_by = '';

                let mobiToester = this.deliveryService.mobiToast("Accepting, please wait ...", "danger");
                //  console.log(mobiToester);
                this.deliveryService.createOrder(orderData, item._id).then((result) => {
                    // this.submitted = false;   
                    this.navCtrl.setRoot(NewOrdersPage);

                })  

                
            } else {

            }
        });

        
    }

    calculateDuration(origin: any = null, destination: any = null, returnValue = false) {
        return new Promise((resolve, reject)=>{
        return  this.distanceMatrixService.getDistanceMatrix({
            origins: [origin],
            destinations: [destination],
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.IMPERIAL,
            avoidHighways: true,
            avoidTolls: true,
          }, (result) => {

             if (returnValue){
                 console.log(result);
                 return resolve(result);
             }else{
                if (result != undefined && result.rows !== undefined && result.rows[0] != undefined && result.rows[0].elements != undefined && result.rows[0].elements[0] != undefined && result.rows[0].elements[0].duration != undefined){
                
                    this.traveltime             = result.rows[0].elements[0].duration.text + " away ("+result.rows[0].elements[0].distance.text+")";
                    this.getDistanceMatrix      = {distance: result.rows[0].elements[0].distance.value, timeSec: result.rows[0].elements[0].duration.value}
                }
                return 0;
            }
              //console.log(result.rows[0].elements[0]);
          });

       });
    }
  /*rows: Array(1)
0:
elements: Array(1)
0: {status: "ZERO_RESULTS"}*/

  

    getCurrentLocation(){
       // return new Promise((resolve, reject)=>{
           return this.geolocation.getCurrentPosition().then((position) => {
                let currentLatLng: any;
                let destination: any;

               return [position.coords.latitude, position.coords.longitude];
            });
       // });
    }

    checkLocationRestriction(toLatLng){
         //let toLatLng = [this.currentOrder.pharmacy.lat, this.currentOrder.pharmacy.lng];
        return this.getCurrentLocation()
            .then(
                currLocation => {
                    console.log(currLocation);
                    let currentLatLng = new google.maps.LatLng(currLocation[0], currLocation[1]);
                    //let currentLatLng = new google.maps.LatLng(34.102707, -117.907921);
                    let destination = new google.maps.LatLng(toLatLng[0], toLatLng[1]);
                    return this.calculateDuration(currentLatLng, destination, true)
                        .then(
                            (distanceMetric: any) => {
                                let metricResult = distanceMetric.rows[0].elements[0];
                                console.log(metricResult);
                                if (metricResult.status === 'OK') {

                                    if (metricResult.distance.value <= 3) {

                                        return {
                                            status: true, value: metricResult.distance.value
                                        };
                                      //  let sendData: any = { pageaction: this.pageAction, orderDetail: /// this.currentOrder, orderid: this.currentOrderId };
                                      //  this.navCtrl.push(OrderVerifyPage, sendData);

                                    } else {

                                        return {
                                            status: false, value: metricResult.distance.value
                                        };
                                        //this.deliveryService.mobiToast("Please get in to Pharmacy ... debug:" + metricResult.distance.value, "danger");
                                    }

                                }else{
                                    return {
                                        status: false, value: false
                                    };
                                }
                           //     console.log(distanceMetric);

                            }
                        )

                }
            )
    }

    goto(action: any = null) {
        console.log(this.pageAction);
        console.log(this.currentOrder);
         
        //this.currentOrder.pharmacy.lat
        //this.currentOrder.pharmacy.lng
        //this.checkLocationRestriction([this.currentOrder.pharmacy.lat, this.currentOrder.pharmacy.lng]);
        if(action == "rx"){



        }else{
            // picking from pharmcy 
            // check restriction 
            let toLatLng = [this.currentOrder.pharmacy.lat, this.currentOrder.pharmacy.lng];
            if (this.pageAction == "pickup"){
                 toLatLng = [this.currentOrder.pharmacy.lat, this.currentOrder.pharmacy.lng];
            }else{
                toLatLng = [this.currentOrder.deliveryInfo.address.latitude, this.currentOrder.deliveryInfo.address.longitude];
            }
            
            this.checkLocationRestriction(toLatLng).then(result=>{

               if(result.status){
                   let sendData: any = { pageaction: this.pageAction, orderDetail: this.currentOrder, orderid: this.currentOrderId };
                   this.navCtrl.push(OrderVerifyPage, sendData);
               }else{
                
                   if (!result.status && !result.value){
                       this.deliveryService.mobiToast("Unable to get distance : google", "danger");
                   }else{
                       this.deliveryService.mobiToast("Please get in to Pharmacy ... debug:" + result.value, "danger");
                   }
                

                setTimeout(() => {
                    let sendData: any = { pageaction: this.pageAction, orderDetail: this.currentOrder, orderid: this.currentOrderId };
                    this.navCtrl.push(OrderVerifyPage, sendData); 
                }, 3000);

               }

                /**/

            });
        }
        
    }
    ionViewDidEnter() {
        console.log("enter");
        console.log(this.pageAction);
      //  this.loadMap();
    }

    dismiss() {
    	let postData : any = {};
		this.viewCtrl.dismiss(postData);
	}

}
