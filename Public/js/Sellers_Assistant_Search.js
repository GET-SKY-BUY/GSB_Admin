
async function Find() {
    document.getElementById("Dataa").innerHTML = "Loading...";
    document.getElementById("Find").disabled = true;
    const Value = document.getElementById("Value");
    const Type = document.getElementById("Type");
    if (Value.length < 5) {
        Message("Please Enter a Valid Value", "Warning");
        document.getElementById("Dataa").innerHTML = "";
        document.getElementById("Find").disabled = false;
        return;
    }else{
        document.getElementById("Find").disabled = true;
        document.getElementById("Loading").style.display = "flex";
        await fetch("/sellers_assistant/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                Type: Type.value,
                Value: Value.value,
            }),
        }).then(res=>{
            document.getElementById("Loading").style.display = "none";
            document.getElementById("Find").disabled = false;
            if(res.ok){
                return res.json();
            } else {
                return res.json().then(Data=>{
                    let e = new Error(Data.Message);
                    e.Message = Data.Message;
                    throw e;
                });
            };
        }).then(data=>{
            Message(data.Message, "Success");
            document.getElementById("Dataa").innerHTML = data.Sellers;
        }).catch(e=>{
            if(e.Message){
                Message(e.Message, "Warning");
            } else {
                Message("An Error Occured", "Warning");
            };
        });
    };
};


async function Status() {
    document.getElementById("Dataa").innerHTML = "Loading...";
    document.getElementById("Find").disabled = true;
    const Value = document.getElementById("Value");
    const Type = document.getElementById("Type");
    const Status = document.getElementById("Status");
    if (Value.length < 5) {
        Message("Please Enter a Valid Value", "Warning");
        document.getElementById("Dataa").innerHTML = "";
        document.getElementById("Find").disabled = false;
        return;

    }else if (Status.length === ""){
        Message("Please selecte Status yes or no", "Warning");
        document.getElementById("Dataa").innerHTML = "";
        document.getElementById("Find").disabled = false;



    }else{
        
        document.getElementById("Find").disabled = true;
        document.getElementById("Loading").style.display = "flex";
        await fetch("/sellers_assistant/shop/status",{
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                Type: Type.value,
                Value: Value.value,
                Status: Status.value,
            }),

        }).then(res=>{
                
            document.getElementById("Find").disabled = false;
            document.getElementById("Loading").style.display = "none";
            if(res.ok){
                return res.json();
            } else {
                return res.json().then(Data=>{
                    let e = new Error(Data.Message);
                    e.Message = Data.Message;
                    throw e;
                });
            };
        }).then(data=>{
            Message(data.Message, "Success");
            document.getElementById("Dataa").innerHTML = data.Sellers;
        }).catch(e=>{
            if(e.Message){
                Message(e.Message, "Warning");
            } else {
                Message("An Error Occured", "Warning");
            };
        });
    };
};
