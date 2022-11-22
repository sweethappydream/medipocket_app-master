import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AlertController, ToastController } from 'ionic-angular';
import { AppSettings } from '../../app/settings';
import { mobiscroll } from '@mobiscroll/angular';
import { TempStorageProvider } from '../temp-storage/temp-storage';
import 'rxjs/add/operator/map';
import * as moment from 'moment';


/*
  Generated class for the DeliveryServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DeliveryServiceProvider {
	contentHeader 								: Headers = new Headers({"Content-Type": "application/json"});
	http_headers 								: any;
	options 									: any;
	authToken 									: any;
	listdata 									: any;
    httpurl                                     : any = AppSettings.API_ENDPOINT;
    localurl                                    : any = AppSettings.localurl;
    nodeserverurl                               : any = AppSettings.nodeserverurl;
    liveurl2                                    : any = AppSettings.liveurl2;
	constructor(public tempStorage: TempStorageProvider, public http: Http, private alertCtrl: AlertController, private toastCtrl: ToastController) {
		this.http_headers 						= new Headers();
		this.http_headers.append("Accept", 'application/json');
	    this.http_headers.append('Content-Type', 'application/json' );
        this.http_headers.append("X-Amz-Date", "");
        this.http_headers.append("X-Api-Key", true);
        this.http_headers.append("X-Amz-Security-Token", "");
		this.options 							= new RequestOptions({ headers: this.http_headers });
		this.setHeaders();
		console.log('Hello DeliveryServiceProvider Provider');
	}
	setHeaders(token = null) {
    	this.authToken 						= token;
    	if(this.http_headers.get('Authorization'))
		{
			this.http_headers.delete('Authorization');
		}
	    if(token)
	    {
	    	this.http_headers.append('Authorization', 'Bearer ' + token);
	    }
	    else
	    {
            this.http_headers.append('Authorization', '');
	    	/* this.storage.get('id_token').then((token) => {
				this.http_headers.append('Authorization', 'Bearer ' + token);
		    }); */
	    } 
    }

    async profileInfo(type: any, id: any) {
        let options                         = new RequestOptions({ headers: this.http_headers });
        this.listdata                       = {};
        return await new Promise(resolve => {
            this.http.get(this.httpurl + 'profile/' + type + '/?id=' + id, options)
            .map(res => res.json())
            .subscribe(data => {
                //console.log("test");
                //console.log(data);
                let resultData                   : any;
                    resultData                   = data;
                if(resultData.status == "error")
                {
                    
                }
                else{
                    
                }
              //  console.log(resultData);
                resolve(resultData);
                }, error => {
 
                if(error.status == 'error') 
                {
                    resolve(0);
                }else{
                    resolve(JSON.parse(error._body));
                }
                console.log(error);// Error getting the data
              });
        });
    }

    async getCountryText(params) {
        let options                         = new RequestOptions({ headers: this.http_headers });
        this.listdata                       = {};
        return await new Promise(resolve => {
            this.http.get(this.nodeserverurl + 'countrytext/' + params.country, options)
            .map(res => res.json())
            .subscribe(data => {
                let resultData                   : any;
                    resultData                   = data;
                if(resultData.status == "error")
                {
                    
                }
                else{
                    
                }
                resolve(resultData);
                }, error => {
 
                if(error.status == 'error') 
                {
                    resolve(0);
                }
                console.log(error);// Error getting the data
              });
        });
    }

    async getStateText(params) {
        let options                         = new RequestOptions({ headers: this.http_headers });
        this.listdata                       = {};
        return await new Promise(resolve => {
            this.http.get(this.nodeserverurl + 'statetext/' + params.country + '/' + params.state, options)
            .map(res => res.json())
            .subscribe(data => {
                let resultData                   : any;
                    resultData                   = data;
                if(resultData.status == "error")
                {
                    
                }
                else{
                    
                }
                resolve(resultData);
                }, error => {
 
                if(error.status == 'error') 
                {
                    resolve(0);
                }
                console.log(error);// Error getting the data
              });
        });
    }

    async getCityText(params) {
        let options                         = new RequestOptions({ headers: this.http_headers });
        this.listdata                       = {};
        return await new Promise(resolve => {
            this.http.get(this.nodeserverurl + 'citytext/' + params.country + '/' + params.state + '/' + params.city, options)
            .map(res => res.json())
            .subscribe(data => {
                let resultData                   : any;
                    resultData                   = data;
                if(resultData.status == "error")
                {
                    
                }
                else{
                    
                }
                resolve(resultData);
                }, error => {
 
                if(error.status == 'error') 
                {
                    resolve(0);
                }
                console.log(error);// Error getting the data
              });
        });
    }

    async updateProfileInfo(updateObj: any, id: any) {
        let options                         = new RequestOptions({ headers: this.http_headers });
        this.listdata                       = {};
        return await new Promise(resolve => {
            this.http.post(this.httpurl + 'users/'+ id, updateObj, options)
            .map(res => res.json())
            .subscribe(data => {
                //console.log("test");
                //console.log(data);
                let resultData                   : any;
                    resultData                   = data;
                if(resultData.status == "error")
                {
                    
                }
                else{
                    
                }
              //  console.log(resultData);
                resolve(resultData);
                }, error => {
 
                if(error.status == 'error') 
                {
                    resolve(0);
                }else{
                    resolve(JSON.parse(error._body));
                }
                console.log(error);// Error getting the data
              });
        });
    }

    async createProfile(createObj: any) {
        let options                         = new RequestOptions({ headers: this.http_headers });
        this.listdata                       = {};
        return await new Promise(resolve => {
            this.http.post(this.httpurl + 'users/', createObj, options)
            .map(res => res.json())
            .subscribe(data => {
                //console.log("test");
                //console.log(data);
                let resultData                   : any;
                    resultData                   = data;
                if(resultData.status == "error")
                {
                    
                }
                else{
                    
                }
              //  console.log(resultData);
                resolve(resultData);
                }, error => {
 
                if(error.status == 'error') 
                {
                    resolve(0);
                }else{
                    resolve(JSON.parse(error._body));
                }
                console.log(error);// Error getting the data
              });
        });
    }


    async login(params) {
        let options                         = new RequestOptions({ headers: this.http_headers });
        this.listdata                       = {};
        return await new Promise(resolve => {
            this.http.post(this.httpurl + 'auth/', params, options)
            .map(res => res.json())
            .subscribe(data => {
                let resultData                   : any;
                    resultData                   = data;
                if(resultData.status == "error")
                {
                    
                }
                else{
                    
                }
                resolve(resultData);
                }, error => {
 
                if(error.status == 'error') 
                {
                    
                }
                resolve(JSON.parse(error._body));
                //console.log(error);// Error getting the data
              });
        });
    }

    async registerGetOTP(params) {
        let options                         = new RequestOptions({ headers: this.http_headers });
        this.listdata                       = {};
        return await new Promise(resolve => {
            this.http.post(this.httpurl + 'sms/', params, options)
            .map(res => res.json())
            .subscribe(data => {
                let resultData                   : any;
                    resultData                   = data;
                if(resultData.status == "error")
                {
                    
                }
                else{
                    
                }
                resolve(resultData);
                }, error => {
 
                if(error.status == 'error') 
                {
                    
                }
                resolve(JSON.parse(error._body));
                //console.log(error);// Error getting the data
              });
        });
    }

    async registerVerifyOTP(params) {
        let options                         = new RequestOptions({ headers: this.http_headers });
        this.listdata                       = {};
        return await new Promise(resolve => {
            this.http.post(this.httpurl + 'verify-otp/', params, options)
            .map(res => res.json())
            .subscribe(data => {
                let resultData                   : any;
                    resultData                   = data;
                if(resultData.status == "error")
                {
                    
                }
                else{
                    
                }
                resolve(resultData);
                }, error => {
 
                if(error.status == 'error') 
                {
                    
                }
                resolve(JSON.parse(error._body));
                //console.log(error);// Error getting the data
              });
        });
    }
    
    async getEmailOTP(params) {
        let options                         = new RequestOptions({ headers: this.http_headers });
        this.listdata                       = {};
        return await new Promise(resolve => {
          //  this.http.post(this.localurl + 'getotp/', params, options)
          this.http.post(this.httpurl + 'email/', params, options)
            .map(res => res.json())
            .subscribe(data => {
                let resultData                   : any;
                    resultData                   = data;
                if(resultData.status == "error")
                {
                    
                }
                else{
                    
                }
                resolve(resultData);
                }, error => {
 
                if(error.status == 'error') 
                {
                    
                }
                resolve(JSON.parse(error._body));
                //console.log(error);// Error getting the data
              });
        });
    }

    async generatePassword(params) {
        let options                         = new RequestOptions({ headers: this.http_headers });
        this.listdata                       = {};
        return await new Promise(resolve => {
            this.http.post(this.localurl + 'generatepassword/', params, options)
            .map(res => res.json())
            .subscribe(data => {
                let resultData                   : any;
                    resultData                   = data;
                if(resultData.status == "error")
                {
                    
                }
                else{
                    
                }
                resolve(resultData);
                }, error => {
 
                if(error.status == 'error') 
                {
                    
                }
                resolve(JSON.parse(error._body));
                //console.log(error);// Error getting the data
              });
        });
    }

    async verifyOTP(params) {
        let options                         = new RequestOptions({ headers: this.http_headers });
        this.listdata                       = {};
        return await new Promise(resolve => {
            this.http.post(this.httpurl + 'verify-otp/', params, options)
            .map(res => res.json())
            .subscribe(data => {
                let resultData                   : any;
                    resultData                   = data;
                if(resultData.status == "error")
                {
                    
                }
                else{
                    
                }
                resolve(resultData);
                }, error => {
 
                if(error.status == 'error') 
                {
                    
                }
                resolve(JSON.parse(error._body));
                //console.log(error);// Error getting the data
              });
        });
    }

    async doctorProfile(params) {
        let options                         = new RequestOptions({ headers: this.http_headers });
        this.listdata                       = {};
        return await new Promise(resolve => {
            this.http.post(this.localurl + 'doctorprofile/', params, options)
            .map(res => res.json())
            .subscribe(data => {
                let resultData                   : any;
                    resultData                   = data;
                if(resultData.status == "error")
                {
                    
                }
                else{
                    
                }
                resolve(resultData);
                }, error => {
 
                if(error.status == 'error') 
                {
                    
                }
                resolve(JSON.parse(error._body));
                //console.log(error);// Error getting the data
              });
        });
    }

    public confirm(text: string) {
        return new Promise(
            (resolve) => {
                this.alertCtrl.create({
                    message: text,
                    buttons: [
                        {
                            text: "No",
                            role: 'cancel',
                            handler: () => {
                                resolve(false);
                            }
                        },
                        {
                            text: "Yes",
                            handler: () => {
                                resolve(true);
                            }
                        }
                    ]
                }).present();
            }
        );
    }

    public mobiconfirm(text, title = '', yes = "Yes", no = "No") {
        return new Promise(
            (resolve) => {
                mobiscroll.confirm({
                    title: title,
                    message: text,
                    okText: yes,
                    cancelText: no,
                    callback: function (res) {
                        if(res) { 
                            resolve(true);                
                        }
                        else {
                            resolve(false);
                        }
                        /* mobiscroll.toast({
                            message: res ? 'Getting membership details' : 'Placing non membership order',
                            duration: 1000
                        }); */
                    }
                });
            }
        );
    }

    async checkUserCart(filterObj: any) {
        let options                         = new RequestOptions({ headers: this.http_headers });
        this.listdata                       = {};
        return await new Promise(resolve => {
            this.http.post(this.httpurl + 'check-user-cart', filterObj, options)
            .map(res => res.json())
            .subscribe(data => {
                //console.log("test");
                //console.log(data);
                let resultData                   : any;
                    resultData                   = data;
                if(resultData.status == "error")
                {
                    
                }
                else{
                    
                }
              //  console.log(resultData);
                resolve(resultData);
                }, error => {
 
                if(error.status == 'error') 
                {
                    resolve(0);
                }else{
                    resolve(JSON.parse(error._body));
                }
                console.log(error);// Error getting the data
              });
        });
    }

    async createOrder(addObj: any, updateId = '') {
        let options                         = new RequestOptions({ headers: this.http_headers });
        this.listdata                       = {};
        return await new Promise(resolve => {
            this.http.post(this.httpurl + 'orders/' + updateId, addObj, options)
            .map(res => res.json())
            .subscribe(data => {
                //console.log("test");
                //console.log(data);
                let resultData                   : any;
                    resultData                   = data;
                if(resultData.status == "error")
                {
                    
                }
                else{
                    
                }
              //  console.log(resultData);
                resolve(resultData);
                }, error => {
 
                if(error.status == 'error') 
                {
                    resolve(0);
                }else{
                    resolve(error._body);
                }
                console.log(error);// Error getting the data
              });
        });
    }
    
    parseUTCTime(utcTimeStamp, holder=false){
        if(holder){
        }
         if(utcTimeStamp && utcTimeStamp > 0){
            return moment(utcTimeStamp, "X").format('MMMM Do, YYYY h:mm A');
         }else{
             return utcTimeStamp;
         }
     }

    public mobiToast(text: string, color: string) {
        return new Promise(
            (resolve) => {
                mobiscroll.toast({
                    message: text,
                    duration: 3000,
                    color: color,
                    display: 'bottom',
                    callback: function () {
                        console.log("mobitoast");
                        resolve(true); 
                    }
                });
            }
        );
        
    }

    public showToast(text: string) {
        this.toastCtrl.create({ 
            message: text,
            duration: 5000,
            position: 'bottom',
            dismissOnPageChange: true
        }).present();
    }

}
