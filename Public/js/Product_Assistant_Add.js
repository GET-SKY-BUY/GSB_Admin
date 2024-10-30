

function Search_Seller(){
    let Type = document.getElementById("Type").value;
    if (Type == "") {
        Message("Search type can not be empty", "Warning");
        return;
    }
    let Value = document.getElementById("Value").value;
    if (Value == "") {
        Message("Input field can not be empty", "Warning");
        return;
    }
    let Search_Seller = document.getElementById("Search_Seller");
    Search_Seller.disabled = true;
    let Loading = document.getElementById("Loading");
    Loading.style.display = "flex";
    
    document.getElementById("MainAddProduct").style.display = "none";
    fetch("/products_assistant/search/seller", {
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ Type: Type, Value: Value }), 
        method: "POST"
    }).then(res => {
        
        Loading.style.display = "none";
        
        Search_Seller.disabled = false;
        if (res.status == 200) {
            return res.json();
        }else {
            return res.json().then(Error_Data => {
                const error = new Error(Error_Data.Message);
                error.Message = Error_Data.Message;
                throw error;
            });
        };
    }).then(data=>{
        Message(data.Message, "Success");
        let ID = document.getElementById("ID");
        ID.innerHTML = "<b>ID: </b>" + data.ID;
        let Name = document.getElementById("Name");
        Name.innerHTML = "<b>Name: </b>" + data.Name;
        let Store = document.getElementById("Store");
        Store.innerHTML = "<b>Mobile Number: </b>" + data.Mobile_Number;
        let Email = document.getElementById("Email");
        Email.innerHTML = "<b>Email: </b>" + data.Email;
        let Mobile = document.getElementById("Mobile");
        Mobile.innerHTML = "<b>Store name: </b>" + data.Store_Name;
        document.getElementById("UL").style.display = "block";
        document.getElementById("MainAddProduct").style.display = "block";
        
        document.getElementById("FinalDiv").innerHTML= `<button onclick="FinalSubmitBtn(${data.ID});" id="FinalSubmitBtn" type="button">Add the product</button>`;
    }).catch(error=>{
        if(error.Message){
            Message(error.Message, "Warning");
        }else{
            Message("An error occurred.", "Warning");
        };
    });
};



































function AddMore(n){
    document.getElementById("Btnnnnnn").innerHTML = `<button id="AddMore" onclick="AddMore(${n+1});" type="button">Add More</button>`;

    let NewElement = document.createElement("div");
    NewElement.className = "Table_Main_Box";
    // <div class="Table_Main_Box">
    NewElement.innerHTML = `
            <div class="Div_Input2">
                <input class="InputText2" id="Key${n+1}" title="Key" type="text" placeholder=" ">
                <label class="Div_Input_Label2" for="Key${n+1}">Key</label>
            </div>
            <div class="Div_Input2">
                <input class="InputText2" id="Value${n+1}" title="Value" type="text" placeholder=" ">
                <label class="Div_Input_Label2" for="Value${n+1}">Value</label>
            </div>
            `;
            // </div>

    let Table = document.getElementById("Table");
    Table.appendChild(NewElement);
};




function TableInput() {
    const jsonResult = [];
    let index = 0;
    while (document.getElementById(`Key${index}`) && document.getElementById(`Value${index}`)) {
        const key = document.getElementById(`Key${index}`).value;
        const Value = document.getElementById(`Value${index}`).value;
        if (key == "" || key.length < 2 ) {
            Message("Input fields can not be empty", "Warning");
            return null;
        }
        let New = [
            key,
            Value
        ];
        jsonResult.push(New);
        index++;
    };
    return jsonResult;
};

function Var() {
    const jsonResult = [];
    let index = 0;
    while (document.getElementById(`V_Type${index}`) && document.getElementById(`V_Qty${index}`)) {
        const key = document.getElementById(`V_Type${index}`).value;
        const Value = document.getElementById(`V_Qty${index}`).value;
        if (key == "") {
            Message("Input fields can not be empty", "Warning");
            return null;
        };
        let New = {
            Type: key,
            Quantity: Value
        };
        jsonResult.push(New);
        index++;
    };
    return jsonResult;
}








document.getElementById("Cancel").addEventListener("click", () => {
    document.getElementById("CenterBox1111").style.display = "none";
});

function Add_Image_Video_Btn() {
    document.getElementById("CenterBox1111").style.display = "flex";
        
}





function Add_Image(n) {
    document.getElementById("CenterBox1111").style.display = "none";
    if(n >= 7){
        Message("You can only add 7 images.", "Warning");
        return;
    };
    document.getElementById("Add_ImageDiv").innerHTML = `<button onclick="Add_Image(${n+1});" id="Add_Image" type="button">Image</button>`;
    let Images_Video = document.getElementById("Images_Video");
    let New = document.createElement("div");
    New.className = "Div_Input";
    New.innerHTML = `
        <input class="InputText" id="Image${n+1}" title="Image" type="file" placeholder=" " style="cursor: pointer;"  accept="image/*">
        <label class="Div_Input_Label" for="Image${n+1}">Image</label>
    `;
    Images_Video.appendChild(New);
    
    
};
function Add_Video(n) {
    document.getElementById("CenterBox1111").style.display = "none";
    if(n >= 3){
        Message("You can only add 3 videos.", "Warning");
        return;
    };
    document.getElementById("Add_VideoDiv").innerHTML = `<button onclick="Add_Video(${n+1});" id="Add_Video" type="button">Video</button>`;
    let Images_Video = document.getElementById("Images_Video");
    let New = document.createElement("div");
    New.className = "Div_Input";
    New.innerHTML = `
        <input class="InputText" id="Video${n+1}" title="Video Link" type="url" placeholder=" " style="cursor: pointer;" autocomplete="off">
        <label class="Div_Input_Label" for="Video${n+1}">Video Link</label>
    `;
    Images_Video.appendChild(New);
};



function CheckURL(videoUrl) {
    const videoIdMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^&\n]{11})/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;
    if (!videoId) {
        return null;
    }
    return videoUrl;
}



function FinalSubmitBtn(n){
    // let Images_Video = document.getElementById("Images_Video");
    
    document.getElementById("Loading").style.display = "flex";
    document.getElementById("FinalSubmitBtn").disabled = true;



    
    if(!n){
        document.getElementById("Loading").style.display = "none";
        document.getElementById("FinalSubmitBtn").disabled = false;
        Message("Unauthorized access.", "Warning");
        return;
    }
    
    let Categories = document.getElementById("Categories").value;
    if(Categories == ""){
        document.getElementById("Loading").style.display = "none";
        document.getElementById("FinalSubmitBtn").disabled = false;
        Message("Please select a category.", "Warning");
        return;
    }
    
    
    let Gender = document.getElementById("Gender").value;
    if(Gender == ""){
        document.getElementById("Loading").style.display = "none";
        document.getElementById("FinalSubmitBtn").disabled = false;
        Message("Please select a Gender.", "Warning");
        return;
    }
    let Age_Group = document.getElementById("Age_Group").value;
    if(Age_Group == ""){
        document.getElementById("Loading").style.display = "none";
        document.getElementById("FinalSubmitBtn").disabled = false;
        Message("Please select a age group.", "Warning");
        return;
    }
    
    
    let Occasion = document.getElementById("Occasion").value;
    if(Occasion == ""){
        document.getElementById("Loading").style.display = "none";
        document.getElementById("FinalSubmitBtn").disabled = false;
        Message("Please select a Occasion.", "Warning");
        return;
    }
    
    let Title = document.getElementById("Title").value;
    if(Title == "" || Title.length < 5){
        document.getElementById("Loading").style.display = "none";
        document.getElementById("FinalSubmitBtn").disabled = false;
        Message("Please enter a suitable title.", "Warning");
        return;
    }
    
    let Description = document.getElementById("Description").value;
    if(Description == "" || Description.length < 10){
        document.getElementById("Loading").style.display = "none";
        document.getElementById("FinalSubmitBtn").disabled = false;
        Message("Please enter a suitable description.", "Warning");
        return;
    }
    
    
    
    let MRP = document.getElementById("MRP").value;
    if(MRP == ""){
        document.getElementById("Loading").style.display = "none";
        document.getElementById("FinalSubmitBtn").disabled = false;
        Message("Please enter a MRP.", "Warning");
        return;
    }
    
    
    
    
    let Seller_Selling_Price = document.getElementById("Seller_Selling_Price").value;
    if(Seller_Selling_Price == ""){
        document.getElementById("Loading").style.display = "none";
        document.getElementById("FinalSubmitBtn").disabled = false;
        Message("Please enter the selling prize.", "Warning");
        return;
    }
    
    
    
    let Keywords = document.getElementById("Keywords").value;
    if(Keywords == ""){
        document.getElementById("Loading").style.display = "none";
        document.getElementById("FinalSubmitBtn").disabled = false;
        Message("Please enter the selling prize.", "Warning");
        return;
    }
    try{
        Keywords = Keywords.split(", ");
    }catch{
        document.getElementById("Loading").style.display = "none";
        document.getElementById("FinalSubmitBtn").disabled = false;
        Message("Please enter valid keywords.", "Warning");
        return;
    };
    
    let Brand = document.getElementById("Brand").value;
    if(Brand == ""){
        document.getElementById("Loading").style.display = "none";
        document.getElementById("FinalSubmitBtn").disabled = false;
        Message("Please enter a valid Brand.", "Warning");
        return;
    }
    
    
    



    let One = 1;
    let x = 1;
    let Image_IDs = [];
    const maxSize = 3 * 1024 * 1024; 
    while(document.getElementById(`Image${x}`)){
        if(document.getElementById(`Image${x}`).files[0]){
            if(document.getElementById(`Image${x}`).files[0].size > maxSize){
                Message("Image size is too large. (Max: 1MB)", "Warning");
                document.getElementById("Loading").style.display = "none";
                document.getElementById("FinalSubmitBtn").disabled = false;
                One = 2;
                break;
            }
            Image_IDs.push(`Image${x}`);
        }else{
            document.getElementById("Loading").style.display = "none";
            document.getElementById("FinalSubmitBtn").disabled = false;
            Message("Please select an image.", "Warning");
            One = 2;
            break;
        }
        x++;
    };
    if (One != 1) {
        return;
    }
    let Video_IDs = [];
    x = 1;
    while(document.getElementById(`Video${x}`)){
        let URL =  document.getElementById(`Video${x}`).value;
        if(URL != ""){
            if(CheckURL(URL)){
                Video_IDs.push(URL);
            }else{
                document.getElementById("Loading").style.display = "none";
                document.getElementById("FinalSubmitBtn").disabled = false;
                Message("Please enter a valid youtube URL.", "Warning");
                One = 2;
                break;
            };
        }else{
            document.getElementById("Loading").style.display = "none";
            document.getElementById("FinalSubmitBtn").disabled = false;
            Message("Please enter an youtube URL.", "Warning");
            One = 2;
            break;
        }
        x++;
    };
    if (One != 1) {
        return;
    }

    let zz = TableInput();
    if(!zz){
        
        document.getElementById("Loading").style.display = "none";
        document.getElementById("FinalSubmitBtn").disabled = false;
        Message("Please enter all the key values of the table.", "Warning");
        return;
    };
    let zz1 = Var();
    if(!zz1){
        
        document.getElementById("Loading").style.display = "none";
        document.getElementById("FinalSubmitBtn").disabled = false;
        Message("Please enter all the key values of the Varieties.", "Warning");
        return;
    };

    if(document.getElementById("Product_ID").value.length < 5){
        document.getElementById("Loading").style.display = "none";
        document.getElementById("FinalSubmitBtn").disabled = false;
        Message("Please enter a valid Product ID.", "Warning");
        return;
    };
    
    
    let Send = {
        ID: n,
        Product_ID: document.getElementById("Product_ID").value,
        Categories: Categories,
        Age_Group: Age_Group,
        Occasion: Occasion,
        Gender: Gender,
        Description: Description,
        Title: Title,
        MRP: MRP,
        Selling_Price: Seller_Selling_Price,
        Keywords: Keywords,
        Brand: Brand,
        Table: zz,
        Varieties: JSON.stringify({A:zz1}),
        Video_IDs: Video_IDs,
    };
    let formData = new FormData();
    for (let key in Send) {
        if (Send.hasOwnProperty(key)) {
            formData.append(key, Send[key]);
        }
    }
    for (let index = 0; index < Image_IDs.length; index++) {
        const element = Image_IDs[index];
        formData.append(element, document.getElementById(element).files[0]);
    };
    fetch("/products_assistant/add",{
        method: "POST",
        body: formData
    }).then(res=>{
        
        document.getElementById("Loading").style.display = "none";
        document.getElementById("FinalSubmitBtn").disabled = false;
        if(res.status == 200){
            return res.json();
        }
        return res.json().then(Error_Data => {
            const error = new Error(Error_Data.Message);
            error.Message = Error_Data.Message;
            throw error;
        });
    }).then(data=>{
        Message(data.Message, "Success");
    }).catch(error=>{
        if(error.Message){
            Message(error.Message, "Warning");
        }else{
            Message("An error occurred.", "Warning");
        };
    });
};




function V_BTN(n){
    let NewElement = document.createElement("div");
    NewElement.innerHTML = `
        <div class="Div_Input2">
            <input class="InputText2" id="V_Type${n+1}" title="Varities type" type="text" placeholder=" ">
            <label class="Div_Input_Label2" for="V_Type${n+1}">Type</label>
        </div>
        <div class="Div_Input2">
            <input class="InputText2" id="V_Qty${n+1}" title="Quantities" type="number" placeholder=" ">
            <label class="Div_Input_Label2" for="V_Qty${n+1}">Quantity</label>
        </div>
    `;
    document.getElementById("Varities_Box").appendChild(NewElement);
    document.getElementById("Varities_Btn_Box").innerHTML = `
        <button type="button" id="V_BTN" onclick="V_BTN(${n+1});">Add more</button>
    `;
}