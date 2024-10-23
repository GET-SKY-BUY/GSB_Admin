
const Generate_New_QR = async () =>{
    let Generate_New_QR = document.getElementById("Generate_New_QR");
    Generate_New_QR.disabled = true;
    let box = document.getElementById("box");
    box.style.display = "flex";

}

const Generate_Final_QR = async () =>{
    let Number_of_Pages = document.getElementById("Number_of_Pages");
    Number_of_Pages = Number(Number_of_Pages.value);
    if(Number_of_Pages > 0){
        Message("Please wait, this may take some time", "Success");
        document.getElementById("Loading").style.display = "flex";
        let Generate_Final_QR = document.getElementById("Generate_Final_QR");
        Generate_Final_QR.disabled = true;

        let Generate_New_QR = document.getElementById("Generate_New_QR");
        Generate_New_QR.disabled = true;
        fetch("/admin/qr_codes/generate_codes", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({number:Number_of_Pages})
        }).then(res=>{
            if(res.ok){
                return res.json();
            }else if(res.status == 307){
                Message("Please login again", "Warning");
                setTimeout(() => {
                    window.location.href = "/admin/auth/login";
                }, 1000);
            }else{
                return res.json().then(data=>{
                    let error = new Error(data.Message);
                    error.Message = data.Message;
                    throw error;
                });
            };
        }).then(data=>{
            Message(data.Message,"Success");
            document.getElementById("Loading").style.display = "none";
            Generate_Final_QR.disabled = false;
            Generate_New_QR.disabled = false;
            
            let box = document.getElementById("box");
            box.style.display = "none";
        }).catch(e=>{
            
            document.getElementById("Loading").style.display = "none";
            Generate_Final_QR.disabled = false;
            Generate_New_QR.disabled = false;
            if(e.Message){
                Message(e.Message, "Warning");
            }else{
                Message("Error", "Warning");
            }
        });
    }else{
        Message("Please enter the number of pages", "Warning");
    }


}

const Delete = async() =>{
    let Delete = document.getElementById("Delete");
    Delete.disabled = true;
    Message("Please wait, this may take some time", "Success");
    document.getElementById("Loading").style.display = "flex";
    fetch("/admin/qr_codes/temp", {
        method: "DELETE"
    }).then(res=>{
        if(res.ok){
            return res.json();
        }else if(res.status == 307){
            Message("Please login again", "Warning");
            setTimeout(() => {
                window.location.href = "/admin/auth/login";
            }, 1000);
        }else{
            return res.json().then(data=>{
                let error = new Error(data.Message);
                error.Message = data.Message;
                throw error;
            });
        };
    }).then(data=>{
        Message(data.Message,"Success");
        document.getElementById("Loading").style.display = "none";
        Delete.disabled = false;
    }).catch(e=>{
        document.getElementById("Loading").style.display = "none";
        Delete.disabled = false;
        if(e.Message){
            Message(e.Message, "Warning");
        }else{
            Message("Something error happened.", "Warning");
        }
    });
}

const FinalizeQR = async() =>{
    let FinalizeQR = document.getElementById("FinalizeQR");
    FinalizeQR.disabled = true;
    Message("Please wait, this may take some time", "Success");
    document.getElementById("Loading").style.display = "flex";
    await fetch("/admin/qr_codes/final", {
        method: "PUT"
    }).then(res=>{
        if(res.ok){
            return res.json();
        }else if(res.status == 307){
            Message("Please login again", "Warning");
            setTimeout(() => {
                window.location.href = "/admin/auth/login";
            }, 1000);
        }else{
            return res.json().then(data=>{
                let error = new Error(data.Message);
                error.Message = data.Message;
                throw error;
            });
        };
    }).then(data=>{
        Message(data.Message,"Success");
        document.getElementById("Loading").style.display = "none";
        FinalizeQR.disabled = false;
    }).catch(e=>{
        document.getElementById("Loading").style.display = "none";
        FinalizeQR.disabled = false;
        if(e.Message){
            Message(e.Message, "Warning");
        }else{
            Message("Something error happened.", "Warning");
        }
    }
    )
}


const Search_Generated_QR1 = async() =>{
    // console.log(1);
    let Search_Generated_QR = document.getElementById("Search_Generated_QR");
    Search_Generated_QR.disabled = true;
    document.getElementById("Loading").style.display = "flex";
    
    let Search_QR_CODE = document.getElementById("Search_QR_CODE").value;

    if(Search_QR_CODE.length == 9){
        await fetch("/admin/qr_codes/search", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({QR_CODE:Search_QR_CODE})
        }).then(res=>{
            if(res.ok){
                return res.json();
            }else if(res.status == 307){
                Message("Please login again", "Warning");
                setTimeout(() => {
                    window.location.href = "/admin/auth/login";
                }, 1000);
            }else{
                return res.json().then(data=>{
                    let error = new Error(data.Message);
                    error.Message = data.Message;
                    throw error;
                });
            }
        }).then(data=>{
            document.getElementById("Loading").style.display = "none";
            Search_Generated_QR.disabled = false;
            Search_QR_CODE = "";
            if(data.Message){
                Message(data.Message, "Success");
            }else{
                Message("Error", "Warning");
            };
        }).catch(e=>{
            document.getElementById("Loading").style.display = "none";
            Search_Generated_QR.disabled = false;
            if(e.Message){
                Message(e.Message, "Warning");
            }else{
                Message("Error", "Warning");
            }
        });
    }else{
        Message("Please enter the correct QR code", "Warning");
        document.getElementById("Loading").style.display = "none";
        Search_Generated_QR.disabled = false;
    }
}

const DeleteQR1 = async() =>{
    let DeleteQR = document.getElementById("DeleteQR");
    DeleteQR.disabled = true;
    document.getElementById("Loading").style.display = "flex";
    
    let Delete_QRINput = document.getElementById("Delete_QRINput").value;

    if(Delete_QRINput.length == 9){
        await fetch("/admin/qr_codes/qr-delete", {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({QR_CODE:Delete_QRINput})
        }).then(res=>{
            if(res.ok){
                return res.json();
            }else if(res.status == 307){
                Message("Please login again", "Warning");
                setTimeout(() => {
                    window.location.href = "/admin/auth/login";
                }, 1000);
            }else{
                return res.json().then(data=>{
                    let error = new Error(data.Message);
                    error.Message = data.Message;
                    throw error;
                });
            }
        }).then(data=>{
            document.getElementById("Loading").style.display = "none";
            DeleteQR.disabled = false;
            Search_QR_CODE = "";
            if(data.Message){
                Message(data.Message, "Success");
            }else{
                Message("Error", "Warning");
            };
        }).catch(e=>{
            document.getElementById("Loading").style.display = "none";
            DeleteQR.disabled = false;
            if(e.Message){
                Message(e.Message, "Warning");
            }else{
                Message("Error", "Warning");
            }
        });
    }else{
        Message("Please enter the correct QR code", "Warning");
        document.getElementById("Loading").style.display = "none";
        Search_Generated_QR.disabled = false;
    }
}