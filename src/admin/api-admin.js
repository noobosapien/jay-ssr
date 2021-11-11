const getShops = async(user, signal) => {
    try{
        if(user.user.token){

            let response = await fetch('/admin/shops',
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

const getCategories = async(user, shop, signal) => {
    try{
        if(user.user.token){

            // let response = await fetch(`/admin/categories?shop=${shop}`,
            let response = await fetch(`/admin/categories/${shop}`,
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

const addCategory = async(user, category, shop, signal) => {
    try{
        let response = await fetch(`/admin/categories/${shop}`, {
            method: 'POST',
            signal,
            headers: {
                'Accept': 'applocation/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.user.token}`
            },
            body: JSON.stringify({
                name: category,
                shop
            })
        });

        return await response.json();
    }catch(e){
        console.log(e);
    }
}

const removeCategory = async(user, category, signal) => {
    try{
        let response = await fetch(`admin/categories/${category}`, {
            method: 'DELETE',
            signal,
            headers: {
                'Accept': 'applocation/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.user.token}`
            },
            body: JSON.stringify({
                _id: category
            })
        });

        return await response.json();
    }catch(e){
        console.log(e);
    }
}

const getMinorCategories = async(user, category, signal) => {
    try{
        if(!category){
            return [];
        }

        if(user.user.token){

            let response = await fetch(`/admin/minCategories/${category}`,
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

const removeMinorCategory  = async (user, minorCategory, signal) => {
    try{
        let response = await fetch(`/admin/minCategories/${minorCategory}`, {
            method: 'DELETE',
            signal,
            headers: {
                'Accept': 'applocation/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.user.token}`
            },
            body: JSON.stringify({
                _id: minorCategory
            })
        });

        return await response.json();
    }catch(e){
        console.log(e);
    }
}

const addMinorCategory = async(user, minCategory, category, signal) => {
    try{
        if(!category){
            return {message: "No category"};
        }

        let response = await fetch(`/admin/minCategories/${category}`, {
            method: 'POST',
            signal,
            headers: {
                'Accept': 'applocation/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.user.token}`
            },
            body: JSON.stringify({
                name: minCategory,
                category
            })
        });

        return await response.json();
    }catch(e){
        console.log(e);
    }
}

const getProducts = async(user, minCategory, signal) => {
    try{
        if(!minCategory){
            return [];
        }

        if(user.user.token){

            let response = await fetch(`/admin/products/${minCategory}`,
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

const getProduct = async(user, prod, signal) => {
    try{
        if(!prod){
            return {};
        }

        if(user.user.token){

            let response = await fetch(`/admin/product/${prod}`,
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

const addProduct = async(user, product, signal) => {
    try{
        if(!product){
            return {message: "no product"};
        }

        if(user.user.token){

            let response = await fetch(`/admin/products/${product.minorCat}`,
            {
                method: 'POST',
                signal,
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.user.token}`
                },
                body: JSON.stringify(product)
            });
        
            return await response.json();
        }
    }catch(e){
        console.log(e);
    }
}

const removeProduct = async (user, product, signal) => {
    try{
        let response = await fetch(`/admin/products/${product}`, {
            method: 'DELETE',
            signal,
            headers: {
                'Accept': 'applocation/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.user.token}`
            },
            body: JSON.stringify({
                _id: product
            })
        });

        return await response.json();
    }catch(e){
        console.log(e);
    }
}

const getMinorCatNames = async (user, minCategory, signal) => {
    try{
        if(!minCategory){
            return {minorCatNames: []};
        }

        if(user.user.token){

            let response = await fetch(`/admin/getminorcats/${minCategory}`,
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

const getMinorCatNamewithID = async (user, minCategoryID, signal) => {
    try{
        if(!minCategoryID){
            return {minorCatName: null};
        }

        if(user.user.token){

            let response = await fetch(`/admin/getmincatname/${minCategoryID}`,
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

const getDownloadURL = async (user, signal) => {
    try{
        if(user.user.token){

            let response = await fetch(`/admin/pdownload`,
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

const savePDFFromURL = async (file, url, signal) => {
    try{
        
        let response = await fetch(`${url}`,
        {
            method: 'PUT',
            signal,
            headers: {
                'Content-Type' : 'application/pdf',
            },
            body: file
        });
    
        return await response;
        
    }catch(e){
        console.log(e);
    }
}

const getImageURL = async (user, signal) => {
    try{
        if(user.user.token){

            let response = await fetch(`/admin/pimage`,
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

const saveImageFromURL = async (image, url, signal) => {
    try{
        let response = await fetch(`${url}`,
        {
            method: 'PUT',
            signal,
            headers: {
                'Content-Type' : 'image/png',
            },
            body: image
        });
    
        return await response;
    }catch(e){
        console.log(e);
    }
}

const updateProduct = async (user, product, signal) => {
    try{
        if(user.user.token && product){
            let response = await fetch(`/admin/products/${product.minCategory}`,
            {
                method: 'PUT',
                signal,
                headers: {

                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.user.token}`
                },
                body: product
            });
        
            return await response.json();
        }
    }catch(e){
        console.log(e);
    }
}

const getNewOrders = async (user, signal) => {
    try{
        if(user.user.token){

            let response = await fetch(`/admin/neworders`,
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

const setOrderToShipping = async (user, order, signal) => {
    try{
        if(user.user.token){
            let response = await fetch(`/admin/neworders`,
            {
                method: 'PUT',
                signal,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.user.token}`
                },
                body: JSON.stringify(order)
            });
        
            return await response.json();
        }
    }catch(e){
        console.log(e);
    }
}

const getAllUsers = async (user, signal) => {
    try{
        if(user.user.token){

            let response = await fetch(`/admin/allUsers`,
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

const getUserInfo = async (user, customer, signal) => {
    try{
        if(user.user.token){

            let response = await fetch(`/admin/userInfo/${customer}`,
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

const isAdmin = async (user, signal) => {
    try{
        if(user.user.token){

            let response = await fetch(`/admin/isAdmin`,
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

export {
    getShops,
    getCategories,
    addCategory,
    getMinorCategories,
    addMinorCategory,
    getProducts,
    getProduct,
    addProduct,
    getMinorCatNames,
    getMinorCatNamewithID,
    updateProduct,
    getDownloadURL,
    savePDFFromURL,
    getImageURL,
    saveImageFromURL,
    removeCategory,
    removeMinorCategory,
    removeProduct,
    getNewOrders,
    setOrderToShipping,
    getAllUsers,
    getUserInfo,
    isAdmin
}