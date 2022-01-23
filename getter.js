const retirveData = ()=>{
    var data =[];
    fetch('https://prod-11.northcentralus.logic.azure.com:443/workflows/0bc8322830eb4a7c899ab404b740399d/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=4eovsQWEW4RNxFR2JXqTLIbtbhNUEvWr-HTRGxTXV9U',{
      method:"GET"
    }).then(result=>{return result.json()}).then(result=>{
        data = result['data'];
        if(data.length>0)
        {for(let i=0;i<data.length;++i){
            let container = document.getElementById("Main");
            let card = document.createElement("div");
            card.setAttribute("class","card");
            let contents = document.createElement("div");
            contents.setAttribute("class","contents");
            data[i]['data'].forEach(element => {
                contents.innerHTML+=element+"<br>";
            });
            card.appendChild(contents);
            container.appendChild(card);
            
        }}
        else{
            document.getElementById("Main").innerHTML="<center>No data found in database</center>";

        }
    })

  }
  