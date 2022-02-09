import React, {useReducer, useEffect, useContext, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {IUser} from "../../utils/request";
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import {userContext} from "../../context/userContext";
import logo_got from "../../images/game-of-thrones-logo.png";
import houses from "../../images/home/houses.jpg";
import {Button, CardMedia, Typography} from "@mui/material";


//state type

type State = {
    username: string
    password: string
    isButtonDisabled: boolean
    isConnected: boolean
    helperText: string
    isError: boolean
};

const initialState: State = {
    username: '',
    password: '',
    isButtonDisabled: true,
    isConnected: false,
    helperText: '',
    isError: false
};

type Action = { type: 'setUsername', payload: string }
    | { type: 'setPassword', payload: string }
    | { type: 'setIsButtonDisabled', payload: boolean }
    | { type: 'loginSuccess', payload: string }
    | { type: 'loginFailed', payload: string }
    | { type: 'setIsConnected', payload: boolean }
    | { type: 'setIsError', payload: boolean };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'setUsername':
            return {
                ...state,
                username: action.payload
            };
        case 'setPassword':
            return {
                ...state,
                password: action.payload
            };
        case 'setIsButtonDisabled':
            return {
                ...state,
                isButtonDisabled: action.payload
            };
        case 'setIsConnected':
            return {
                ...state,
                isConnected: action.payload
            };
        case 'loginSuccess':
            return {
                ...state,
                helperText: action.payload,
                isError: false
            };
        case 'loginFailed':
            return {
                ...state,
                helperText: action.payload,
                isError: true
            };
        case 'setIsError':
            return {
                ...state,
                isError: action.payload
            };
    }
}


const defaultUser: IUser[] = [];

const Register = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    let navigate = useNavigate();

    let {user} = useContext(userContext);
    const [userStorage, setUserStorage] = useState(() => {
        const saved = localStorage.getItem("users");
        let initialValue: any;
        if (saved != null) {
            initialValue = JSON.parse(saved);
        }
        return initialValue || "";
    });


    useEffect(() => {
        if (state.username.trim() && state.password.trim()) {
            dispatch({
                type: 'setIsButtonDisabled',
                payload: false
            });
        } else {
            dispatch({
                type: 'setIsButtonDisabled',
                payload: true
            });
        }

    }, [state.username, state.password]);

    const handleRegister = () => {

        console.log(user);

        let t = {username: state.username, password: state.password, isConnected: true};

        for (let i = 0; i < user.length; i++) {
            if (user[i].username === t.username) {
                dispatch({
                    type: 'loginFailed',
                    payload: 'Incorrect username or password'
                });
                break;
            } else {
                dispatch({
                    type: 'loginSuccess',
                    payload: 'Login Successfully'
                });
                navigate("../home");

            }
        }

        user.push(t);
        localStorage.setItem("users", JSON.stringify(user));
        console.log(user);


    };


    const handleUsernameChange: React.ChangeEventHandler<HTMLInputElement> =
        (event) => {
            dispatch({
                type: 'setUsername',
                payload: event.target.value
            });
        };

    const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> =
        (event) => {
            dispatch({
                type: 'setPassword',
                payload: event.target.value
            });
        }
    return (
        <form className="login_form" noValidate autoComplete="off">
            <Card className='login_container'>
                <div className='login_div'>
                    <CardMedia
                        component="img"
                        height="140"
                        image={logo_got}
                        alt="logo GOT"
                    />
                    <CardContent>
                        <Typography variant="h4" component="div">
                            New ?
                        </Typography>
                        <Typography variant="body2" component="div">
                            Please register !
                        </Typography>
                        <Typography variant="h5" component="div" style={{marginTop: '30px'}}>Register</Typography>
                    </CardContent>
                    <CardContent>
                        <div>
                            <TextField
                                error={state.isError}
                                fullWidth
                                id="username"
                                type="email"
                                label="Username"
                                placeholder="Username"
                                margin="normal"
                                onChange={handleUsernameChange}
                            />
                            <TextField
                                error={state.isError}
                                fullWidth
                                id="password"
                                type="password"
                                label="Password"
                                placeholder="Password"
                                margin="normal"
                                helperText={state.helperText}
                                onChange={handlePasswordChange}
                            />
                        </div>
                    </CardContent>
                    <CardActions>
                        <Button
                            variant="contained"
                            size="large"
                            className="login_buttons"
                            color="success"
                            onClick={handleRegister}
                            disabled={state.isButtonDisabled}>
                            Register
                        </Button>
                    </CardActions>
                    <CardActions>
                        <Button
                            className="login_buttons"
                            variant="outlined"
                            size="large"
                            color="primary"
                            onClick={() => navigate('/')}>
                            Login
                        </Button>
                    </CardActions>
                </div>
                <img src={houses} alt="houses" style={{width: '50%', height: '700px'}}/>
            </Card>

        </form>
    );
}

export default Register;
