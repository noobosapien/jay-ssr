
const getComponents = async (shop, signal) => {
    try{
        let response = await fetch('/shop/' + shop,
        {
            method: 'GET',
            signal,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
        });
    
        return await response.json();
    }catch(e){
        console.log(e);
    }
    
}

const getMinorComponents = async (comp, shop, signal) => {
    try{
        let response = await fetch('/shop/' + shop + '/' + comp,
        {
            method: 'GET',
            signal,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
        });
    
        return await response.json();
    }catch(e){
        console.log(e);
    }
}

const getItems = async (minCats, comp, shop, sort, page, signal) => {
    try{
        const bod = {minCats, sort, page};
        // console.log("apiprod 42: ", shop, "     ", comp);
        let response = await fetch('/shop/' + shop + '/' + comp,
        {
            method: 'POST',
            signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bod)
        });

        return response.json();
    }catch(e){
        console.log(e);
    }
}

const getProduct = async (prod, signal) => {
    try{
        let response = await fetch('/product/' + prod,
        {
            method: 'GET',
            signal,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        });

        return response.json();
    }catch(e){
        console.log(e);
    }
}

export {
    getComponents,
    getMinorComponents,
    getItems,
    getProduct
}