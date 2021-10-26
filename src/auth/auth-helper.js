// import { signout } from "./api-auth";


const auth = {
    authenticate(jwt, cb){
        if(typeof window !== "undefined"){
            localStorage.setItem('jwt', JSON.stringify(jwt));
        }
        if(cb)
            cb();
    },

    isAuthenticated(){
        if(typeof window == "undefined")
            return null;
        
        if(localStorage.getItem('jwt')){
            return JSON.parse(localStorage.getItem('jwt'));
        }
        else
            return null;
    },

    async clearJWT(cb){
        if(typeof window !== "undefined")
            localStorage.removeItem('jwt');
        
        // if(cb)
        //     cb();

        //if cookies are used
        // await signout();
        // document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00 UTC; path=/;";
    },

    updateUser(user, cb){
        if(typeof window != "undefined"){
            if(localStorage.getItem('jwt')){
                let auth = JSON.parse(localStorage.getItem('jwt'));
                auth.user = user;
                localStorage.setItem('jwt', JSON.stringify(auth));
                if(cb)
                    cb();
            }
        }
    }
}


export default auth;