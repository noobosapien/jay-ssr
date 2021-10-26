

const getSearch = async(input, signal) => {
    try{
        let response = await fetch('/search/' + input,
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

const registerUser = async (user, signal) => {
    try{
        let response = await fetch('/api/users',
        {
            method: 'POST',
            signal,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
    
        return await response.json();
    }catch(e){

    }
}

const getLatest = async(signal) => {
    try{
        let response = await fetch('/latestProd',
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

const getHottest = async(signal) => {
    try{
        let response = await fetch('/hotProd',
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

const getMostBrought = async(signal) => {
    try{
        let response = await fetch('/mostBroughtProd',
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

export {
    getSearch,
    registerUser,
    getLatest,
    getHottest,
    getMostBrought
}