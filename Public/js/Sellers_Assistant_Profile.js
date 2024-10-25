
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


async function Change_Password() {
    document.getElementById('Change_Password').disabled = true;

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
            try {
                if(!confirm("Are you sure you want to change password?")){
                    document.getElementById('Change_Password').disabled = false;
                    return;
                };
                document.getElementById('Change_Password').disabled = true;
                document.getElementById("Loading").style.display = "flex";
                
                await fetch("/sellers_assistant/change_password",{
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({Old:a,New:c}),
                }).then(res=>{
                    document.getElementById('Change_Password').disabled = false;
                    document.getElementById("Loading").style.display = "none";
                    if(res.ok){
                        return res.json();
                    } else {
                        return res.json().then(err=>{
                            let error = new Error(err.Message);
                            error.Message = err.Message;
                            throw error;
                        });
                    };
                }).then(data => {
                    Message(data.Message, "Success");
                }).catch( E => {
                    if (E.Message) {
                        Message(E.Message, "Error");
                    } else {
                        Message("Some Error Occured", "Error");
                    }
                });
                
            } catch (error) {
                document.getElementById('Change_Password').disabled = false;
                alert("Some Error Occured");
            };
        };
    };
};