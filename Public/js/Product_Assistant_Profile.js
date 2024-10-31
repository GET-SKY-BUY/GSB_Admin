
document.getElementById('ChangeBTn0').style.backgroundColor = "rgba(255, 255, 255, 0.747)";

const List = ["My_profile","My_work", "Edit_profile"]
function display(v) {
    let a = 0;
    List.forEach(element => {
        
        let b = `ChangeBTn${a}`;
        if (v == element) {
            document.getElementById(b).style.backgroundColor = "rgba(255, 255, 255, 0.747)";
            let g = document.getElementById(element);
            g.style.display = "block";
            
        }else{
            document.getElementById(element).style.display = "none";
            document.getElementById(b).style.backgroundColor = "rgba(231, 231, 231, 0.714)";
        }
        a++;
    });
}


async function Change_Password(params) {
    document.getElementById('Change_Password').disabled = true;
    document.getElementById("Loading").style.display = "flex";

    if(!confirm("Are you sure you want to change your password?")){
        return;
    };
    let a = document.getElementById('Old_Password').value;
    let b = document.getElementById('New_Password').value;
    let c = document.getElementById('Confirm_Password').value;
    if (a == "" || b == "" || c == "") {
        document.getElementById('Change_Password').disabled = false;
        alert("Please Fill All Fields");
    }else{
        if (b != c) {
            document.getElementById('Change_Password').disabled = false;
            alert("New and confirm password Not Matched");
        }else{
            await fetch("/products_assistant/change_password",{
                body: JSON.stringify({Old:a,New:c}),
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                }
            }).then(res=>{
                document.getElementById("Loading").style.display = "none";
                document.getElementById('Change_Password').disabled = false;
                if(res.ok){
                    return res.json();
                } else {
                    return res.json().then(data=>{
                        let E = new Error(data.Message);
                        E.Message = data.Message;
                        throw E;
                    });
                };
            }).then(data=>{

                alert(data.Message);
               
            }).catch(e=>{
                if(e.Message){
                    alert(e.Message);
                } else {
                    alert("An Error Occured");
                };
            });
        };
    };
};