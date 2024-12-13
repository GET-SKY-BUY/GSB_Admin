

async function Select(ID) {
    document.getElementById("Loading").style.display = "flex";
    fetch("/contact_us/select",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ID }),
    }).then(res=>{
        document.getElementById("Loading").style.display = "none";
        if(res.ok){
            return res.json();
        };
        return res.json().then(err=>{
            let error = new Error(err.Message || "Something went wrong");
            error.Message = err.Message;
            throw error;
        })
    }).then(data=>{
        Message(data.Message, "Success");
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }).catch(err=>{
        Message(err.Message, "Warning");
    });
};

async function Update(ID) {
    let Text = document.getElementById("Problem").value;


    if(Text === "" || Text.length < 5){ 
        return Message("Problem must be atleast 5 characters long", "Warning");
    }
    document.getElementById("Loading").style.display = "flex";
    fetch("/contact_us/problem",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ID , Text }),
    }).then(res=>{
        document.getElementById("Loading").style.display = "none";
        if(res.ok){
            return res.json();
        };
        return res.json().then(err=>{
            let error = new Error(err.Message || "Something went wrong");
            error.Message = err.Message;
            throw error;
        })
    }).then(data=>{
        Message(data.Message, "Success");
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }).catch(err=>{
        Message(err.Message, "Warning");
    });
};

async function Close_Ticket(ID) {
    document.getElementById("Loading").style.display = "flex";
    
    fetch("/contact_us/close",{
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ ID }),
    }).then(res=>{
        document.getElementById("Loading").style.display = "none";
        if(res.ok){
            return res.json();
        };
        return res.json().then(err=>{
            let error = new Error(err.Message || "Something went wrong");
            error.Message = err.Message;
            throw error;
        })
    }).then(data=>{
        Message(data.Message, "Success");
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }).catch(err=>{
        Message(err.Message, "Warning");
    });
};

