public class fetchThirdPartyData {
    @AuraEnabled
    public static List<Object> getRecordData(){
        list<Object> results = new list<Object>();
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('https://raw.githubusercontent.com/StrategicFS/Recruitment/master/data.json');
        request.setMethod('GET');
        HttpResponse response = http.send(request);
        if (response.getStatusCode() == 200) {
            // Deserialize the JSON string into collections of primitive data types.
            results =(list<Object>)JSON.deserializeuntyped(response.getBody());
            System.debug('>>>>>'+results);
        }
        return results ;
    } 
    
}