import React, {useEffect, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import book from '../images/home/book.jpg';
import house from '../images/home/houses.jpg';
import character from '../images/home/characters.jpg';
import {Card, CardActionArea, CardContent, CardMedia, Typography} from "@material-ui/core";
import '../App.css';


const Home = () => {
    let navigate = useNavigate();

    return (
        <div className="home_cards">
            <Card className="home_card">
                <CardActionArea onClick={()=> navigate('/books')}>
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
                <CardActionArea onClick={()=> navigate('/characters')}>
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
                <CardActionArea onClick={()=> navigate('/houses')}>
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


    )
}
export default Home;


