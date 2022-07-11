import { LightningElement ,api , track } from 'lwc';

const columns = [
    { label: 'Credited', fieldName: 'creditorName' , editable : true , hideDefaultActions: true,},
    { label: 'First Name', fieldName: 'firstName' , editable : true,hideDefaultActions: true,},
    { label: 'Last Name', fieldName: 'lastName' , editable : true , hideDefaultActions: true,},
    { label: 'Minimum Pay %', fieldName: 'minPaymentPercentage' , editable : true , hideDefaultActions: true,},
    { label: 'Balance', fieldName: 'balance', type: 'currency'  , editable : true, hideDefaultActions: true,},
];

export default class ChildAssessment extends LightningElement {
   @track dataTabeData = [];
   columns = columns;
   @api balanceTotalChild ;
   @api checkRowCountChild ;
   @api tableRowId = [];
   @api saveDraftValues = [];
   
   // This is used to get the data
   @api get tableData() {
    return this.dataTabeData;
   }
    
   //this is used to set the data from parent as soon as it is available
   set tableData(data) {
   this.dataTabeData = data;
   }

    // This method will handle row selection of dataTable and will send the data to parent compoenent
    checkSelection(event){
       const selectedRows = event.detail.selectedRows;
       console.log("You selected: rows " + JSON.stringify(selectedRows) );
        let sum = 0 ;
        this.tableRowId = [] ; // This is done so that after every selection previous value gets cleared and new value is stored in array.
       // let rd = [];
        selectedRows.forEach(element => {
            sum += parseInt(element.balance);
            this.tableRowId.push(element.id);
          });
       // this.tableRowId = parseInt(rd) ;
        this.balanceTotalChild = sum ;
        this.checkRowCountChild = selectedRows.length ;
        console.log("tableRowId=== " +this.tableRowId);
        const newEve = new CustomEvent('tabledata',{
            detail : {
                BalanceTotal : this.balanceTotalChild ,
                CheckRowSelected : this.checkRowCountChild,
                RowId : this.tableRowId
            }
        });
        this.dispatchEvent(newEve);
     }


    handleSave(event){
    this.saveDraftValues = event.detail.draftValues;
    console.log(JSON.stringify(this.saveDraftValues));

    const newEve = new CustomEvent('savebufferdata',{
        detail : {
            BufferData : this.saveDraftValues
        }
    });
    this.dispatchEvent(newEve);


    this.saveDraftValues = [];

   /*  this.dataTabeData.forEach(item1 => {
        var itemFromArr2 = this.saveDraftValues.find(item2 => item2.id == item1.id);
        console.log('itemFromArr2 ---> '+JSON.stringify(itemFromArr2)); 
        if(itemFromArr2){
            console.log('satyam'); 
            item1.creditorName = itemFromArr2.creditorName;
        }
     })
     console.log('new datatable data >>>>>> ' + this.dataTabeData);*/
     }
}