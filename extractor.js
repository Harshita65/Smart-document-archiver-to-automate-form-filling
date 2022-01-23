var myWidget = cloudinary.createUploadWidget({
  cloudName: 'futurereadytalent', 
  uploadPreset: 'unsigned_uploader'}, (error, result) => { 
    if (!error && result && result.event === "success") { 
      console.log('Done! Here is the image info: ',result.info.secure_url); 
     userAction(result.info.secure_url);
    }
  }
)

document.getElementById("upload_widget").addEventListener("click", function(){
    myWidget.open();
  }, false);
  

const userAction = async (file_to_do) => {
    const response = await fetch('https://textextractorservice.cognitiveservices.azure.com/formrecognizer/v2.1/layout/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key' : '97e1f6031f7443549890b7e750206197'
      },
      body: JSON.stringify({source:file_to_do})
    });
    //const myJson = await response.json(); //extract JSON from the http response
    let location= response.headers.get('Operation-Location');
    // do something with myJson
    if(response.status == 202){
      console.log("Loading....");

      setTimeout(getData(location),5000);
    }
    else{
      console.log("error Occured");
    }
  }

  function getData(location){ 
    console.log("Loaded.")
     fetch(location,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key' : '97e1f6031f7443549890b7e750206197'
    }
  }
    ).then(result =>{
      console.log(location)
      const myData = result.json()
    return myData
  }).then(myjson=>{
    if(myjson["status"]=="running"){
      setTimeout(getData(location),10000);
    }
    else if(myjson["status"] == "succeeded"){
      let id = Math.random().toString(36).slice(5);
      let database_url = "https://prod-09.northcentralus.logic.azure.com:443/workflows/51eba0f8bb8c4806ba21679925302fa7/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=Vdrb2sAmI7fKrJBZ5iMfSY98OqSy1RqfKhbYY5InMXg";
      let data = extract(myjson["analyzeResult"]["readResults"][0]["lines"]);
      console.log(data)
    fetch(database_url,{
      method: "PUT",
      body: JSON.stringify({
        "id" : id,
        "data":data
        }),
      headers:{
        "Content-Type": "application/json"
      }
    }).then(result=>{return result.json()}).then(result=>{
      if(result['status']){
        console.log("Database Updated!");
        t1 = window.setTimeout(function(){ window.location = "/extracted_data.html"; },3000);
      }
      else{
        console.log("Something went wrong!");
      }
    })
    }
    else{
      console.log("Extraction Unsuccessful");

    }
  }).catch(err=>{
    console.log(err);
  });
}
const extract = (arr) => arr.reduce((acc, obj) => acc.concat(obj.text, extract(obj.items || [])), [])

