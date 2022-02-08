import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Route, BrowserRouter as Router, Link, Routes} from 'react-router-dom';
import * as ReactDOM from 'react-dom';
import Home from "./pages/home";
import Login from "./pages/login/login";
import Books from "./pages/books/books";
import BooksDetails from "./pages/books/booksDetails";
import Characters from "./pages/characters/characters";
import CharactersDetails from "./pages/characters/charactersDetails";
import Houses from "./pages/houses/houses";
import HousesDetails from "./pages/houses/housesDetails";
import Register from "./pages/login/register";
import Navigationbar from "./navigation/navbar";


function App() {

    const navigation = {
        brand: {name: 'GOT', to: '/home'},
        links: [
            {name: 'Books', to: '/books'},
            {name: 'Characters', to: '/characters'},
            {name: 'Houses', to: '/houses'},
            {name: 'Logout', to: '/'},
        ]
    };

    const {brand, links} = navigation;

    return (
        <div className="App">
            {
                window.location.pathname != '/' && window.location.pathname != '/register' && <Navigationbar brand={brand} links={links}/>
            }
            <div>
                <Routes>
                    <Route path='/' element={<Login/>}/>
                    <Route path='/register' element={<Register/>}/>

                    <Route path='/home' element={<Home/>}/>
                    <Route path='/books' element={<Books/>}/>
                    <Route path='books/:bookId' element={<BooksDetails/>}/>
                    <Route path='/characters' element={<Characters/>}/>
                    <Route path='characters/:characterId' element={<CharactersDetails/>}/>
                    <Route path='/houses' element={<Houses/>}/>
                    <Route path='houses/:houseId' element={<HousesDetails/>}/>


                </Routes>
            </div>
        </div>
    );
}

export default App;
