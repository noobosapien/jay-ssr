import { getUserCart, putUserCart } from "./api-cart";

const cartHelper = {
    getCart(){
        if(typeof window == "undefined")
            return null;
    
        if(localStorage.getItem('cart')){
            return JSON.parse(localStorage.getItem('cart'));
        }
        else
            return null;
    },

    async saveCart(cart, cb) {
        if(typeof window !== "undefined"){
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        if(cb)
            cb();
    },

    async getCartFromUser(user, cart, setCart, cb) {

        if(user && user.user){
            const abortController = new AbortController();
            const signal = abortController.signal;

            var newCart = [...cart];
            const userCart = await getUserCart(user, signal);

            if(userCart instanceof Array){
                /* eslint-disable */
                for(var i = 0; i < userCart.length; i++){
                    const filter = newCart.filter((item)=>{
                        return item._id === userCart[i]._id; 
                    });
                    if(filter.length === 0){
                        newCart.push(userCart[i]);
                    }
                }
                /* eslint-enable */
                
            }

            console.log("cart helper 53:", newCart, cart);
            this.saveCart(newCart);
            setCart(newCart);
        }
    },

    async saveCartFromUser(user, cart, cb) {
        if(user && user.user){
            const abortController = new AbortController();
            const signal = abortController.signal;

            const result = await putUserCart(user, cart, signal);
            return result;
        }
    }
}

export default cartHelper;