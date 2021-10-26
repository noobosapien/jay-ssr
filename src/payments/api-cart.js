const subTotal = async (items, signal) => {
    try{
        const bod = {items};
        let response = await fetch('/subTotal',
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

const getUserCart = async(user, signal) => {
    try{
        if(user.user.token){

            let response = await fetch('/_cart',
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

const putUserCart = async(user, cart, signal) => {
    try{
        if(user.user.token){

            let response = await fetch('/_cart',
            {
                method: 'PUT',
                signal,
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.user.token}`
                },
                body: JSON.stringify(cart)
            });
            return await response.json();
        }
        
    }catch(e){
        console.log(e);
    }
}

export {subTotal, getUserCart, putUserCart}