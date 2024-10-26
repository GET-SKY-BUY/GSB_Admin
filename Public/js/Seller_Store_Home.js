

async function ActiveNow(DayActive){
    try{
        const res = await fetch("/Sellers_store/active", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Active: DayActive
            })
        });
        if(!res.ok){
            Message(await res.json().Message, "Warning");
        };
        const data = await res.json();
        Message(data.Message, "Success");
        setTimeout(() => {
            location.reload();
        }, 1000);
    }catch(error){
        Message("Something error happened", "Error");
    };
};