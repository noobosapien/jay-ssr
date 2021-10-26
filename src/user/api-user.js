
const read = async (user, signal) => {
    try{

        if(user.user.token){
            let response = await fetch('/api/profile/', {
                method: 'GET',
                signal: signal,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user.user.token
                }
            });
            return await response.json();
        }
    }catch(e){
        console.log(e);
    }
}

const update = async (user, obj, signal) => {
    try{
        if(user.user.token){
            let response = await fetch('/api/profile/', {
                method: 'PUT',
                signal: signal,
                headers: {
                    'Accept': 'applocation/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user.user.token
                },
                body: JSON.stringify(obj)
            });
    
            return await response.json();
        }
        
    }catch(e){
        console.log(e);
    }
}

const remove = async (params, credentials) => {
    try{
        let response = await fetch('/api/users/' + params.userId, {
            method: 'DELETE',
            headers: {
                'Accept': 'applocation/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        });

        return await response.json();
    }catch(e){
        console.log(e);
    }
}

const getOrders = async (user, signal) => {
    try{

        if(user.user.token){
            let response = await fetch('/api/getOrders/', {
                method: 'GET',
                signal: signal,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user.user.token
                }
            });
            return await response.json();
        }
    }catch(e){
        console.log(e);
    }
}

const getOrderDetails = async (user, orderID, signal) => {
    try{

        if(user.user.token){
            let response = await fetch(`/api/getOrderDetails?_id=${orderID}`, {
                method: 'GET',
                signal: signal,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user.user.token
                }
            });
            return await response.json();
        }
    }catch(e){
        console.log(e);
    }
}

const getIsAdmin = async (user, signal) => {
    try{

        if(user.user.token){
            let response = await fetch(`/api/isAdmin`, {
                method: 'GET',
                signal: signal,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user.user.token
                }
            });
            return await response.json();
        }
    }catch(e){
        console.log(e);
    }
}

export {read, update, remove, getOrders, getOrderDetails, getIsAdmin};