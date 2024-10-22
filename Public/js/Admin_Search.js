



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
        Assistant_Type: formData.Assistant_Type,
        Search_Type: formData.Search_Type,
        Email_Mobile_ID: formData.Email_Mobile_ID,
    };


    let data = await API("/admin/search", "POST", Sent);

    if (data == null) {
        document.getElementById("Submitbtn").disabled = false;
        Message("Connection error","Warning");
    }else{
        console.log(data);
        
        if (data.Success == true) {

            Message("Found","Success");
            document.getElementById("Dataaa").innerHTML = data.Data;
            document.getElementById("Email_Mobile_ID").value = data.Searched;
            
        }else{
            document.getElementById("Dataaa").innerHTML = "No user Found";
            document.getElementById("Submitbtn").disabled = false;
            Message("Not Found","Warning");
            
            
        }
    }





}
