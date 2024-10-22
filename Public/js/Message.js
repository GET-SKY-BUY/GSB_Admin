const messageHTML = `
    <div id="Message">
        <div id="TextMessage">
            <span id="MainMsg">Hello</span>
            <span id="Cloose" class="material-symbols-outlined">close</span>
        </div>
    </div>
    <div id="Loading">
        <img src="/verified/files/Images/Loading.gif" alt="Login Gif">
    </div>
`;

const container = document.createElement('div');
container.innerHTML = messageHTML;
document.body.appendChild(container);

document.getElementById("Cloose").addEventListener("click", () => {
    document.getElementById("Message").style.display = "none";
    document.getElementById("MainMsg").innerHTML = "";
});

const style = document.createElement('style');
style.innerHTML = `
    #Loading {
        background-color: rgba(255, 255, 255, 0.384);
        z-index: 100;
        position: fixed;
        top: 0px;
        left: 0px;
        width: 100vw;
        height: 100vh;
        display: none;
        justify-content: center;
        align-items: center;
    }
    #Loading img {
        width: 100px;
    }
    #Message {
        z-index: 1001;
        width: 100vw;
        height: 0px;
        position: absolute;
        top: 0px;
        display: none;
        justify-content: center;
        align-items: center;
    }
    #TextMessage {
        max-width: 95vw;
        box-shadow: 0 0 10px #c0c0c0;
        background-color: #b7ffc4;
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        top: 100px;
    }
    #TextMessage span {
        height: 100%;
        display: inline-block;
        padding: 7px 13px;
    }
    #TextMessage span:nth-child(2),
    #Cloose {
        padding: 7px 6px;
        cursor: pointer;
        user-select: none;
        display: block;
        background-color: #cfcfcf;
        transition: 200ms;
    }
    #TextMessage span:nth-child(2):hover,
    #Cloose:hover {
        color: rgb(75, 75, 75);
        background-color: #f0f0f0;
    }
`;
document.head.appendChild(style);

function Message(n, W) {
    let TextMessage = document.getElementById("TextMessage");
    document.getElementById("Message").style.display = "flex";
    document.getElementById("MainMsg").innerHTML = n;
    if(W=="Warning"){
        TextMessage.style.backgroundColor = "#ffbebe";        
    }else if (W == "Success") {
        TextMessage.style.backgroundColor = "#b7ffc4";
    }else if (W == "Info") {
        TextMessage.style.backgroundColor = "#b7d4ff";
    }else if (W == "Error") {
        TextMessage.style.backgroundColor = "#ffbebe";
    }else{
        TextMessage.style.backgroundColor = "#ffbebe";
    };
};

