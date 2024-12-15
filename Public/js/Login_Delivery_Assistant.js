
const Valid_Email = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
};
const Valid_Password = (password) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
};
function ShowClick(n) {
    let Create_Password = document.getElementById("Create_Password");
    if (n == 1) {
        Create_Password.type = "text";
        document.getElementById("ShowPassword").innerHTML =  `<span class="material-symbols-outlined" id="ShowClick" onclick="ShowClick(2);">visibility</span>`;
    }else{ 
        document.getElementById("ShowPassword").innerHTML =  `<span class="material-symbols-outlined" id="ShowClick" onclick="ShowClick(1);">visibility_off</span>`;
        Create_Password.type = "password";
    }
}

async function Login() {
    document.getElementById("Next_Btn").disabled = true;
    
    if (!Valid_Email(document.getElementById("Email").value)) {
        document.getElementById("Next_Btn").disabled = false;
        Message("Enter correct email","Warning");
    }else if (!Valid_Password(document.getElementById("Create_Password").value)) {
        document.getElementById("Next_Btn").disabled = false;
        Message("Password must be 8 character, numbers, alphabets and symbols.","Warning");
    }else {
        document.getElementById("Loading").style.display = "flex";
        await fetch("/delivery/login",{
            method:"POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                Email:document.getElementById("Email").value,
                Password:document.getElementById("Create_Password").value,
            })
        }).then(res=>{
            document.getElementById("Loading").style.display = "none";
            document.getElementById("Next_Btn").disabled = false;
            if (res.ok) {
                return res.json();
            }else{
                return res.json().then(err=>{
                    let error = new Error(err.Message || "Something went wrong");
                    error.Message = err.Message;
                    throw error;
                })
            };
        }).then(data=>{
            Message(data.Message,"Success");
            setTimeout(() => {
                window.location.href = "/delivery/login/otp";
            }, 1000);
        
        }).catch(err=>{
            Message(err.Message,"Warning");
        });
    };
}