
async function Submit() {
    document.getElementById("Submitbtn").disabled = true;
    const formData = {};
    const elements = document.querySelectorAll('.Tan .InputText');
    elements.forEach(element => {
        const id = element.id;
        const value = element.value.trim();
        formData[id] = value;
    });

    const Sent = {
        Acode: formData.Acode,
        Assistant_Type: formData.Assistant_Type,
        Name: formData.Name,
        Mobile_Number: formData.Mobile_Number,
        WA_Number: formData.WA_Number,
        Email: formData.Email,
        Password: formData.Password,
        Age: formData.AGE,
        Gender: formData.Gender,
        Locality: formData.Locality,
        City_Town: formData.City_Town,
        PIN: formData.PIN,
        District: formData.District,
        State: formData.State,
        Country: formData.Country,
        Bank_Name: formData.Bank_Name,
        Benificiary_Name: formData.Benificiary_Name,
        Account_Number: formData.Account_Number,
        IFSC_Code: formData.IFSC_Code,
        UPI_Number: formData.UPI_Number,
    };


    
    document.getElementById("Loading").style.display = "flex";
    await fetch("/admin/assistant/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(Sent),   
    }).then(res=>{
        document.getElementById("Submitbtn").disabled = false;
        document.getElementById("Loading").style.display = "none";
        if (res.ok) {
            return res.json();
        }else{
            return res.json().then(errData => {
                let err = new Error(errData.Message || "Something went wrong!");
                err.Message =  errData.Message || "Something went wrong!";
                throw err;
            })
        };
    }).then(data=>{
        Message(data.Message,"Success");
        setTimeout(() => {
            location.reload();
        }, 1500);
    }).catch(err=>{
        if (err.Message) {
            Message(err.Message,"Warning");
        }else{
            Message(err.Message,"Warning");
        }
    });


}
