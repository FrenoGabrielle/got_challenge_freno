import React from 'react';

export let users = {
    user: [
        {username: 'test', password: '1234', isConnected: false},
        {username: 'Paul', password: '1234', isConnected: false},
        {username: 'Bernard', password: '1234', isConnected: false},
        {username: 'Laurent', password: '1234', isConnected: false},

    ]
};


export let userContext = React.createContext(users);

