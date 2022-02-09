import React from 'react';

export let users = {
    user: [
        {username: 'gaga', password: '1234', isConnected: false},
        {username: 'tata', password: '1234', isConnected: false},
        {username: 'lala', password: '1234', isConnected: false},
        {username: 'jaja', password: '1234', isConnected: false},

    ]
};


export let userContext = React.createContext(users);

