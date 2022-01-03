const userAction = async () => {
    const response = await fetch('https://textextractorservice.cognitiveservices.azure.com/formrecognizer/v2.1/layout/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key' : '97e1f6031f7443549890b7e750206197'
      },
      body: JSON.stringify({source:"https://docs.microsoft.com/en-us/azure/applied-ai-services/form-recognizer/media/contoso-invoice.png"})
    });
    //const myJson = await response.json(); //extract JSON from the http response
    let location= response.headers.get('Operation-Location');
    // do something with myJson
    if(response.status == 202){
    await fetch(location,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key' : '97e1f6031f7443549890b7e750206197'
      }
    }
      ).then(res =>{
      return res.json();
    }).then(myjson=>{
      console.log(myjson);
    })
    }
  }