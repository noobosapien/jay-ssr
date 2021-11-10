
const getUserAddress = async (user, signal) => {
    try{
        if(user.user.token){

            let response = await fetch('/api/userAddress',
            {
                method: 'GET',
                signal,
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.user.token}`
                },
            });
            return await response.json();
        }
        
    }catch(e){
        console.log(e);
    }
}

const getUserBillingAddress = async (user, signal) => {
    try{
        if(user.user.token){

            let response = await fetch('/api/userBillingAddress',
            {
                method: 'GET',
                signal,
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.user.token}`
                },
            });
            return await response.json();
        }
        
    }catch(e){
        console.log(e);
    }
}

const saveDelAddress = async (user, address, signal) => {
    try{
        if(user.user.token){

            let response = await fetch('/api/userAddress',
            {
                method: 'POST',
                signal,
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.user.token}`
                },
                body: JSON.stringify(address)
            });
            return await response.json();
        }
        
    }catch(e){
        console.log(e);
    }
}

const saveBillAddress = async (user, address, signal) => {
    try{
        if(user.user.token){

            let response = await fetch('/api/userBillingAddress',
            {
                method: 'POST',
                signal,
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.user.token}`
                },
                body: JSON.stringify(address)
            });
            return await response.json();
        }
        
    }catch(e){
        console.log(e);
    }
}

const forwardToPay = async (user, items, shipping, signal) =>{
    try{
        if(user.user.token){

            let response = await fetch('/cpi',
            {
                method: 'POST',
                signal,
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.user.token}`
                },
                body: JSON.stringify({items, shippingPrice: shipping})
            });
            return await response.json();
        }
        
    }catch(e){
        console.log(e);
    }
}

const getOrder = async (user, id, signal) => {
    try{
        if(user.user.token){

            let response = await fetch(`/viewOrder?id=${id}`,
            {
                method: 'GET',
                signal,
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.user.token}`
                },
            });

            return await response.json();
        }
        
    }catch(e){
        console.log(e);
    }
}


const getShipping = async (user, postCode, signal) => {
    try{
        if(user.user.token){
            let response = await fetch(`/postcode?pc=${postCode}`,
            {
                method: 'GET',
                signal,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.user.token}`
                },
            });
        
            return await response.json();
        }
        
    }catch(e){
        console.log(e);
    }
}

const getShippingPrice = async (user, postCode, signal) => {
    try{
        if(user.user.token){
            let response = await fetch(`/shippingCost`,
            {
                method: 'GET',
                signal,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.user.token}`
                },
            });
        
            return await response.json();
        }
        
    }catch(e){
        console.log(e);
    }
}

export { getUserAddress, 
    getUserBillingAddress, 
    forwardToPay, 
    saveDelAddress, 
    saveBillAddress, 
    getOrder, 
    getShipping, 
    getShippingPrice }