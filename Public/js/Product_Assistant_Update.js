
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
        // console.log(1)
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






let Imagesaaaaa = [];


function DeleteImage(n, i) {
    if (n) {
        Imagesaaaaa.push(n);
        
        let III = document.getElementById(`III`);
        let INLEN = III.getElementsByTagName("img").length - 1;
        // if (INLEN <= 1) {
        //     INLEN = 1;
        // }
        let Z = `<button onclick="Add_Image(${INLEN});" id="Add_Image" type="button">Image</button>`
        document.getElementById("Add_ImageDiv").innerHTML = Z;
        document.getElementById(`DivImage${i}`).remove();
        return;
    };
    Message("Unauthorized access.", "Warning");
}

let Videosaaaa = [];
function DeleteVideos(n, i) {
    if (n) {
        Videosaaaa.push(n);
        
        let III = document.getElementById(`III`);
        let INLEN = III.getElementsByTagName("iframe").length - 1;

        let Z = `<button onclick="Add_Video(${INLEN});" id="Add_Video" type="button">Video</button>`;
        document.getElementById("Add_VideoDiv").innerHTML = Z;
        document.getElementById(`DivVideo${i}`).remove();
        return;
    };
    Message("Unauthorized access.", "Warning");
}

if(Videosaaaa.length > 0){
    Videosaaaa = Videosaaaa.toString();

}





















function FinalSubmitBtn(n){


    document.getElementById("Loading").style.display = "flex";
    document.getElementById("FinalSubmitBtn").disabled = true;
    if(!n){
        document.getElementById("Loading").style.display = "none";
        document.getElementById("FinalSubmitBtn").disabled = false;
        Message("Unauthorized access.", "Warning");
        return;
    };
    let Categories = document.getElementById("Categories").value;
    if(Categories == ""){
        document.getElementById("Loading").style.display = "none";
        document.getElementById("FinalSubmitBtn").disabled = false;
        Message("Please select a category.", "Warning");
        return;
    };
    let Gender = document.getElementById("Gender").value;
    if(Gender == ""){
        document.getElementById("Loading").style.display = "none";
        document.getElementById("FinalSubmitBtn").disabled = false;
        Message("Please select a Gender.", "Warning");
        return;
    };
    let Age_Group = document.getElementById("Age_Group").value;
    if(Age_Group == ""){
        document.getElementById("Loading").style.display = "none";
        document.getElementById("FinalSubmitBtn").disabled = false;
        Message("Please select a age group.", "Warning");
        return;
    };
    let Occasion = document.getElementById("Occasion").value;
    if(Occasion == ""){
        document.getElementById("Loading").style.display = "none";
        document.getElementById("FinalSubmitBtn").disabled = false;
        Message("Please select a Occasion.", "Warning");
        return;
    };
    let Title = document.getElementById("Title").value;
    if(Title == "" || Title.length < 5){
        document.getElementById("Loading").style.display = "none";
        document.getElementById("FinalSubmitBtn").disabled = false;
        Message("Please enter a suitable title.", "Warning");
        return;
    };
    let Description = document.getElementById("Description").value;
    if(Description == "" || Description.length < 10){
        document.getElementById("Loading").style.display = "none";
        document.getElementById("FinalSubmitBtn").disabled = false;
        Message("Please enter a suitable description.", "Warning");
        return;
    };
    let MRP = document.getElementById("MRP").value;
    if(MRP == ""){
        document.getElementById("Loading").style.display = "none";
        document.getElementById("FinalSubmitBtn").disabled = false;
        Message("Please enter a MRP.", "Warning");
        return;
    };
    let Seller_Selling_Price = document.getElementById("Seller_Selling_Price").value;
    if(Seller_Selling_Price == ""){
        document.getElementById("Loading").style.display = "none";
        document.getElementById("FinalSubmitBtn").disabled = false;
        Message("Please enter the selling prize.", "Warning");
        return;
    };
    let Keywords = document.getElementById("Keywords").value;
    if(Keywords == ""){
        document.getElementById("Loading").style.display = "none";
        document.getElementById("FinalSubmitBtn").disabled = false;
        Message("Please enter the selling prize.", "Warning");
        return;
    };
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
    let Quantity = document.getElementById("Quantity").value;
    try {
        if(Quantity == "" || Number(Quantity) < 1){
            document.getElementById("Loading").style.display = "none";
            document.getElementById("FinalSubmitBtn").disabled = false;
            Message("Please enter a valid Quantity.", "Warning");
            return;
        }
        Quantity = Number(Quantity);
    } catch (error) {
        document.getElementById("Loading").style.display = "none";
        document.getElementById("FinalSubmitBtn").disabled = false;
        Message("Please enter a valid Quantity.", "Warning");
        return;
        
    }
    
    



    let One = 1;
    let III = document.getElementById(`III`);
    let INLEN = III.getElementsByTagName("img").length+1;
    let x = INLEN;
    let Image_IDs = [];
    const maxSize = 1 * 1024 * 1024;
    
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
    
    III = document.getElementById(`III`);
    INLEN = III.getElementsByTagName("iframe").length + 1;
    x = INLEN;
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
    console.log(Video_IDs);
    
    if (One != 1) {
        return;
    }

    let zz = TableInput();
    // console.log(zz);
    if(!zz){
        
        document.getElementById("Loading").style.display = "none";
        document.getElementById("FinalSubmitBtn").disabled = false;
        Message("Please enter all the key values of the table.", "Warning");
        return;
    };
    
    
    let Send = {
        ID: n,
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
        Quantity: Quantity,
        Table: zz,
        Video_IDs: Video_IDs,
        Videosaaaa: Videosaaaa,
        Imagesaaaaa: Imagesaaaaa,
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
    fetch("/products_assistant/update",{
        method: "POST",
        body: formData
    }).then(res=>{
        if(res.status == 200){
            return res.json();
        }else if(res.status == 307){
            Message("Unauthorized access.", "Warning");
            setTimeout(() => {
                location.reload();
            }, 1000);
        }else{
            return res.json().then(Error_Data => {
                const error = new Error(Error_Data.Message);
                error.Message = Error_Data.Message;
                throw error;
            });
        }
    }).then(data=>{
        document.getElementById("Loading").style.display = "none";
        document.getElementById("FinalSubmitBtn").disabled = false;
        Message(data.Message, "Success");
        location.reload();
    }).catch(error=>{
        document.getElementById("Loading").style.display = "none";
        document.getElementById("FinalSubmitBtn").disabled = false;
        if(error.Message){
            Message(error.Message, "Warning");
        }else{
            Message("An error occurred.", "Warning");
        };
    });


















}




