 export class CommonLogParams {
    browser : string = '';
    os : string = ''; 

    constructor(){
        this.browser = window.navigator.userAgent;
        this.os = window.navigator.platform;
    }
 }