import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import book from '../images/home/book.jpg';
import house from '../images/home/houses.jpg';
import character from '../images/home/characters.jpg';
import '../App.css';
import {navigation} from "../utils/request";
import NavigationBar from "../navigation/navbar";
import {Button, Card, CardActionArea, CardContent, CardMedia, TextField, Typography} from "@mui/material";


const Home = () => {

    //navbar
    const {brand, links} = navigation;

    let navigate = useNavigate();

    return (
        <>
            <NavigationBar brand={brand} links={links}/>
            <div>
                <Card className="intro_card">
                    <CardContent>
                        <Typography variant="h4">
                            Game of Thrones
                        </Typography>
                        <Typography variant="body1">
                            Welcome on the application that know - <i>almost</i> - everything about the famous books &
                            serie Game of Thrones !
                            <br/>
                            Feel free to explore, let's begin choosing a category !
                        </Typography>
                    </CardContent>
                </Card>
                <div className="home_cards">
                    <Card className="home_card">
                        <CardActionArea onClick={() => navigate('/books')}>
                            <CardMedia
                                component="img"
                                height="500"
                                image={book}
                                alt="book"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Books
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    <Card className="home_card">
                        <CardActionArea onClick={() => navigate('/characters')}>
                            <CardMedia
                                component="img"
                                height="500"
                                image={character}
                                alt="jon snow"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Characters
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    <Card className="home_card">
                        <CardActionArea onClick={() => navigate('/houses')}>
                            <CardMedia
                                component="img"
                                height="500"
                                image={house}
                                alt="houses"
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Houses
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </div>
            </div>
        </>


    )
}
export default Home;


