import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import request from "../../utils/request";
import book1 from "../../images/books/book1.jpg";

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Card,
    CardContent, ListItem,
    Paper,
    Typography
} from "@material-ui/core";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Grid, Link, List, ListItemText} from "@mui/material";
import {Item} from "framer-motion/types/components/Reorder/Item";

interface IBooks {
    url: string;
    name: string;
    isbn: string;
    authors: string[];
    numberOfPages: number;
    publisher: string;
    country: string;
    mediaType: string;
    released: Date;
    characters: string[];
    povCharacters: string[];

}


const defaultBook: IBooks = {
    url: 'Unknown',
    name: 'Unknown',
    isbn: 'Unknown',
    authors: [],
    numberOfPages: 0,
    publisher: 'Unknown',
    country: 'Unknown',
    mediaType: 'Unknown',
    released: new Date("1900-01-01"),
    characters: [],
    povCharacters: []
};


interface ICharacters {
    url: string;
    name: string;
    gender: string;
    culture: string;
    born: string;
    died: string;
    titles: string[];
    aliases: string[];
    father: string;
    mother: string;
    allegiances: string[];
    books: string[];
    povBooks: string[];
    tvSeries: string[];
    playedBy: string[];
}

const defaultCharacters: ICharacters[] = [];

const BooksDetails = () => {


    let {bookId} = useParams();
    let {characterId} = useParams();

    let selectedBook = useLocation();
    let test: IBooks;
    let navigate = useNavigate();

    const [book, setBook]: [IBooks, (book: IBooks) => void] = useState(defaultBook);
    const [loading, setLoading]: [boolean, (loading: boolean) => void] = useState<boolean>(false);
    const [characters, setCharacters]: [ICharacters[], (character: ICharacters[]) => void] = useState(defaultCharacters);
    const [povCharacters, setPovCharacters]: [ICharacters[], (povCharacter: ICharacters[]) => void] = useState(defaultCharacters);

    let getCharacters = async (urls: string[], charactersType: string) => {
        let allCharacters = [];
        let allPovCharacters = [];

        let length = 0;

        if (urls.length > 31) {
            length = 10;
        } else {
            length = urls.length;
        }

        console.log(length);

        for (let i = 0; i < length; i++) {
            let c = await request(
                urls[i],
                'GET',
                null
            );

            if (charactersType === "pov") {


                setPovCharacters(allPovCharacters);
            } else {
                allCharacters.push(c.name);

            }
            allCharacters.sort((a, b) => {
                return a.localeCompare(b);
            });
            allPovCharacters.sort((a, b) => {
                return a.localeCompare(b);
            });

            setCharacters(allCharacters);
            allPovCharacters.push(c.name);
        }
        console.log(allCharacters);
        console.log(allPovCharacters);
    }



let getBook = async () => {

    test = selectedBook.state as IBooks;

    setBook(test);

    const timer = setTimeout(() => {
        getCharacters(test.characters, "characters");
        getCharacters(test.povCharacters, "pov");

    }, 2000);
    return () => clearTimeout(timer);
}


useEffect(() => {
    getBook();


    const timer = setTimeout(() => {
        setLoading(true);

    }, 5000);
    return () => clearTimeout(timer);

}, [])

    let parseQueryString = (queryString: string): any => {
        let queries = queryString.split("/");
        let key = queries[queries.length - 1];
        return key;
    }

    let seeDetails = (character: ICharacters) => {
        console.log(character);

        characterId = parseQueryString(character.url);
        //navigate(`../characters/${characterId}`, {state: character});

    }


return (
    <div className="div_details">
        {loading ?
            <>
                <Card className="card_info">
                    <div className="presentation_div">
                        <div className="box_info">
                            <Box sx={{flexGrow: 1}}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12} className="book_infos"
                                          style={{textAlign: 'center', fontSize: '24px', marginBottom: '20px'}}>
                                        <p>{book.name}</p>
                                    </Grid>
                                    <Grid item xs={6} className="book_infos">
                                        <p>Author : {book.authors}</p>
                                    </Grid>
                                    <Grid item xs={6} className="book_infos">
                                        <p>Publisher : {book.publisher}</p>
                                    </Grid>
                                    <Grid item xs={6} className="book_infos">
                                        <p>Number of page : {book.numberOfPages}</p>
                                    </Grid>
                                    <Grid item xs={6} className="book_infos">
                                        <p>ISBN : {book.isbn}</p>
                                    </Grid>
                                    <Grid item xs={6} className="book_infos">
                                        <p>Release date : {book.released}</p>
                                    </Grid>
                                    <Grid item xs={6} className="book_infos">
                                        <p>Countries : {book.country}</p>
                                    </Grid>
                                    <Grid item xs={6} className="book_infos">
                                        <p>Media type : {book.mediaType}</p>
                                    </Grid>
                                </Grid>
                            </Box>
                        </div>
                        <div>
                            <img src={book1} alt="book1" style={{width: '100%', height: '400px'}}/>
                        </div>
                    </div>
                    <div className="accordion_div">
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel1a-content"
                                id="panel1a-header">
                                <Typography>Characters</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List>
                                    {characters.map((c) => (
                                        <ListItem>
                                            <ListItemText>
                                                <Link onClick={() => seeDetails(c)}>{c}</Link>
                                            </ListItemText>
                                        </ListItem>
                                    ))}
                                </List>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel2a-content"
                                id="panel2a-header">
                                <Typography>POV Characters</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <List>
                                    {povCharacters.map((c) => (
                                        <ListItem>
                                            <ListItemText>{c}</ListItemText>
                                        </ListItem>
                                    ))}
                                </List>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </Card>
            </>
            :
            <p>Waiting...</p>
        }

    </div>

)
}
export default BooksDetails;
