import { LightningElement, track , api} from 'lwc';
import getRecordData from '@salesforce/apex/fetchThirdPartyData.getRecordData'; 
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class LwcAssessmentMindzvue extends LightningElement {

    //Set this to true to show the loading symbol
    isLoading = false;  
    sendData = false ;
    isTrue = true ;
    @track data = [];
    @track parenttoChild = [];
    @track balanceTotal = 0 ;
    @track totalRowCount = 0;
    @track checkRowCount = 0;
    @track rowIdData = [];
    @track id = 0 ;
    @track bufferData = [];

    connectedCallback() {
        this.isLoading = true;
        getRecordData()
            .then(returnResponse => {
               // console.log('returnResponse----->  '+JSON.stringify(returnResponse));
                this.data =  returnResponse ;  
                this.parenttoChild = this.data ;
               // console.log('returnResponse----->  '+JSON.stringify(this.parenttoChild));
                this.totalRowCount = this.data.length ;
                let len = this.parenttoChild.length
                //this.id = len ;
                this.isLoading = false;  
                this.sendData = true ;   
                this.isTrue = true ;      
            })
            .catch(error => console.log(error))
    }

    handleChildEvent(event){
         this.checkRowCount = event.detail.CheckRowSelected ;
         if(this.checkRowCount > 0){
            this.isTrue = false
         }
         console.log('checkRowCount----->  '+this.checkRowCount);
         this.balanceTotal = event.detail.BalanceTotal ;
         console.log('balanceTotal----->  '+this.balanceTotal);
         this.rowIdData = event.detail.RowId;
         console.log('rowIdData----->  '+this.rowIdData);

    }

    handleAddDebt(event){
        this.isLoading = true ;
        this.sendData = false ;
        // This is done so that while adding a row the id of new row does not match id of previous row
        this.id = this.parenttoChild.length ;
        let acc = {
            id : this.id+1,
            creditorName : '',
            firstName : '',
            lastName : '',
            minPaymentPercentage : '',
            balance : 0
        }
        console.log('length of id ---> '+this.id)

        this.parenttoChild.push(acc);
        //console.log('data re passing on add debt--'+ JSON.stringify(this.data));
        this.parenttoChild = JSON.parse(JSON.stringify(this.parenttoChild));
        this.totalRowCount = this.totalRowCount + 1 ;
        //console.log('parenttoChild re passing on add debt--'+ JSON.stringify(this.parenttoChild));
        this.isLoading = false ;
        this.sendData = true ;

     }
     handleRemoveDebt(event){
        console.log('rowIdData '+this.rowIdData);
        if(this.checkRowCount > 0){
            let newArr = [];
            this.rowIdData.forEach(element => {
                console.log(parseInt(element));
                 newArr = this.parenttoChild.filter(object => {
                    return object.id !== parseInt(element);
                  });
                  //console.log('satyam---'+JSON.stringify(newArr));
                  this.parenttoChild = JSON.parse(JSON.stringify(newArr));
                  this.totalRowCount = this.totalRowCount - 1 ;
              });
            this.showSuccessToast();
           console.log('new dtata after deleted '+JSON.stringify(this.parenttoChild));
        } else {
            this.showErrorToast();
        }
        
     }

     showErrorToast() {
        const evt = new ShowToastEvent({
            title: 'Unexpected Error',
            message: 'Please select any row',
            variant: 'error',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }

    showSuccessToast() {
        const evt = new ShowToastEvent({
            title: 'Deletion Successful',
            message: 'Record has been deleted',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }
     
    patchBufferData(event){
        this.bufferData = event.detail.BufferData ;
        console.log('returned buffer data '+ JSON.stringify(this.bufferData));
        const tempdata = this.parenttoChild ;
        tempdata.forEach(item1 => {
        var itemFromArr2 = this.bufferData.find(item2 => item2.id == item1.id);
        console.log('itemFromArr2 ---> '+JSON.stringify(itemFromArr2)); 
        if(itemFromArr2){
            console.log('item1.creditorName---> '+item1.creditorName); 
            console.log('itemFromArr2.firstName---> '+itemFromArr2.firstName); 
            console.log('itemFromArr2.lastName---> '+itemFromArr2.lastName); 
            console.log('itemFromArr2.minPaymentPercentage---> '+itemFromArr2.minPaymentPercentage); 
            console.log('itemFromArr2.balance---> '+itemFromArr2.balance); 
            if(itemFromArr2.creditorName != undefined){
                item1.creditorName = itemFromArr2.creditorName;
                this.showSuccessUpdateToast();
            } 
            else if (itemFromArr2.firstName != undefined){
                console.log('itemFromArr2.firstName of else if '); 
                item1.firstName = itemFromArr2.firstName;
                this.showSuccessUpdateToast();
            } 
            else if (itemFromArr2.lastName != undefined){
                item1.lastName = itemFromArr2.lastName; 
                this.showSuccessUpdateToast();
            } 
            else if (itemFromArr2.minPaymentPercentage != undefined){
                item1.minPaymentPercentage = itemFromArr2.minPaymentPercentage; 
                this.showSuccessUpdateToast();
            } 
            else if (itemFromArr2.balance != undefined){
                item1.balance = itemFromArr2.balance; 
                this.showSuccessUpdateToast();
            }
        }
     })
     this.parenttoChild = JSON.parse(JSON.stringify(tempdata));
     
     console.log('new datatable data >>>>>> ' + JSON.stringify(this.parenttoChild));

    }
    
    showSuccessUpdateToast() {
        const evt = new ShowToastEvent({
            title: 'Update Successful',
            message: 'Record has been updated successfully',
            variant: 'success',
            mode: 'dismissable'
        });
        this.dispatchEvent(evt);
    }



}