import React from 'react';
import { Route, Switch} from 'react-router-dom';
import Home from './core/Home';
import Category from './products/Category';
import ProductPage from './products/ProductPage';
import Header from './core/Menu';
import Footer from './core/Footer';
import About from './misc/about';
import Contact from './misc/contact';

import Account from './user/Account';
import Paperbase from './admin/Paperbase';
import Cart from './payments/Cart';
import Checkout from './payments/Checkout';
import OrderSuccess from './payments/OrderSuccess';

const MainRouter = () => {

    return (
        <>
            <Header/>
            <Switch>
                <Route path="/user/account" component={Account} exact />
                <Route path='/cart' component={Cart} exact />
                <Route path='/checkout' component={Checkout} exact />
                <Route path="/admin" component={Paperbase} exact />
                {/* <Route path="/admin" component={AdminPanel} exact /> */}
                <Route path="/contact" component={Contact} exact />
                <Route path="/about" component={About} exact />
                
                <Route path="/cat/:shop/" component={Category} />
                <Route path="/prod/:prod" component={ProductPage} />
                <Route path="/ordersuccess/:id" component={OrderSuccess} />
                <Route path='/' component={Home} />
            </Switch>
            <Footer/>
        </>
    )
}

export default MainRouter;