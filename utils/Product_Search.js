
const { Products } = require('../Models.js');

module.exports = Product_Search = async (search) => {
    let All_Products = await Products.find();
    let products = [];
    let Count = 0;
    search = search.toLowerCase();
    search = search.split(/\s+/);
    let Search_Length = search.length;
    All_Products.forEach(Product => {
        let Prio = 0;
        if(Product.Verified === "No"){
            return;
        };
        search.forEach(Search_Word => {
            
            if( Product.Title.toLowerCase().includes(Search_Word)){
                Prio += Search_Word.length;
            };
            if ( Product.Brand.toLowerCase().includes(Search_Word)){
                Prio += Search_Word.length;
            };
            if ( Product.Categories.toLowerCase().includes(Search_Word)){
                Prio += Search_Word.length;
            };
            if ( Product.Occasion.toLowerCase().includes(Search_Word)){
                Prio += Search_Word.length;
            };
            if ( Product.Gender.toLowerCase().includes(Search_Word)){
                Prio += Search_Word.length;
            };
            const KEY = Product.Keywords.join(" ");
            if ( KEY.toLowerCase().includes(Search_Word)){
                Prio += Search_Word.length;
            };

            if( Prio != 0 ){
                if( Number(Search_Word) == Number ){
                    if ( Product.Price.MRP <= Number(Search_Word)){
                        Prio += 1;
                    };
                    if( Product.Price.Our_Price <= Number(Search_Word)){
                        Prio += 1;
                    };
                };
                products.push({
                    ID: Product._id,
                    Priority: Prio,
                });
                Count++;
            };
        });
    });
    if( Count == 0){
        return [];
    }else{
        products = products.sort((a, b) => b.Priority - a.Priority).map(product => product.ID);
        return products;
    };
};