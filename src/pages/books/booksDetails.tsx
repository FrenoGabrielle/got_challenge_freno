import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {request, IBooks, ICharacters, queryString, navigation} from "../../utils/request";
import book1 from "../../images/books/book1.jpg";

import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Card,
    ListItem,
    Typography
} from "@material-ui/core";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {Backdrop, CircularProgress, Grid, Link, List, ListItemText} from "@mui/material";
import Moment from 'react-moment';
import NavigationBar from "../../navigation/navbar";

//by default, book fields are unknown
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

//by default a character is empty
const defaultCharacters: ICharacters[] = [];

const BooksDetails = () => {

    //navbar
    const {brand, links} = navigation;

    //to get params receive from Books.tsx
    let selectedBook = useLocation();
    let bookToDisplay: IBooks;

    //to send the selected character to the details page
    let {characterId} = useParams();
    let navigate = useNavigate();

    //useState
    const [book, setBook]: [IBooks, (book: IBooks) => void] = useState(defaultBook);
    const [loading, setLoading]: [boolean, (loading: boolean) => void] = useState<boolean>(false);
    const [characters, setCharacters]: [ICharacters[], (character: ICharacters[]) => void] = useState(defaultCharacters);
    const [povCharacters, setPovCharacters]: [ICharacters[], (povCharacter: ICharacters[]) => void] = useState(defaultCharacters);
    const [open, setOpen] = React.useState(true);

    //get the book we received from Book.tsx
    let getBook = async () => {

        bookToDisplay = selectedBook.state as IBooks;
        setBook(bookToDisplay);

        //call some function to get all data
        const timer = setTimeout(() => {
            getCharacters(bookToDisplay.characters);
            getPovCharacters(bookToDisplay.povCharacters, "pov");
        }, 2000);
        return () => clearTimeout(timer);
    }

    //get all Characters we need to display in details
    //param : urls = string[] => array with characters urls
    let getCharacters = async (urls: string[]) => {

        let allCharacters = [];

        //Because of the number of character, we only get 10 characters
        let length = 0;

        if (urls.length > 11) {
            length = 10;
        } else {
            length = urls.length;
        }

        for (let i = 0; i < length; i++) {
            let c = await request(
                //https://www.anapioficeandfire.com/api/characters/12
                urls[i],
                'GET',
                null
            );
            //put result in array
            allCharacters.push(c);
        }
        setCharacters(allCharacters);
    }

    //get all POV Characters we need to display in details
    //param : urls = string[] => array with characters urls
    //param : charactersType = string => type of character we want
    let getPovCharacters = async (urls: string[], charactersType: string) => {

        let allPovCharacters = [];

        //Because of the number of character, we only get 10 characters
        let length = 0;

        if (urls.length > 11) {
            length = 10;
        } else {
            length = urls.length;
        }

        for (let i = 0; i < length; i++) {
            //https://www.anapioficeandfire.com/api/characters/12
            let c = await request(
                urls[i],
                'GET',
                null
            );
            //put result in array
            allPovCharacters.push(c);

        }
        setPovCharacters(allPovCharacters);
    }

    //function to go to character's details
    //param : type = ICharacter => the selected book
    let seeDetails = async (character: ICharacters) => {
        //get the id to get the correct url
        characterId = await queryString(character.url);
        //move to the details page & send the selected character
        navigate(`../characters/${characterId}`, {state: character});
    }

    useEffect(() => {
        async function fetchData() {
            await getBook();
        }

        fetchData();
        //timer to get data
        const timer = setTimeout(() => {
            setLoading(true);
            setOpen(false);
        }, 4000);
        return () => clearTimeout(timer);

    }, [])

    return (
        <div className="div_details">
            <NavigationBar brand={brand} links={links}/>
            {loading ?
                <>
                    <Card className="card_info">
                        <div className="presentation_div">
                            <div className="box_info">
                                <Box sx={{flexGrow: 1}}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} className="book_infos"
                                              style={{textAlign: 'center', fontSize: '24px', marginBottom: '20px'}}>
                                            <b>{book.name}</b>
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <b>Author : </b> {book.authors}
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <b>Publisher : </b>{book.publisher}
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <b>Number of page : </b>{book.numberOfPages}
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <b>ISBN : </b>{book.isbn}
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <b>Release date : </b>
                                            <Moment format=' DD/MM/YYYY'>{book.released}</Moment>
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <b>Countries : </b>{book.country}
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <b>Media type : </b>{book.mediaType}
                                        </Grid>
                                        <Grid item xs={6} className="book_infos"></Grid>
                                    </Grid>
                                </Box>
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
                                                            <Link onClick={() => seeDetails(c)}>{c.name}</Link>
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
                                                {povCharacters.map((p) => (
                                                    <ListItem>
                                                        <ListItemText>
                                                            <Link onClick={() => seeDetails(p)}>{p.name}</Link>
                                                        </ListItemText>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </AccordionDetails>
                                    </Accordion>
                                </div>
                            </div>
                            <div>
                                <img src={book1} alt="book1" style={{width: '100%', height: '500px'}}/>
                            </div>
                        </div>

                    </Card>
                </>
                :

                <Backdrop
                    sx={{color: '#D8B600', zIndex: (theme) => theme.zIndex.drawer + 1}}
                    open={open}>
                    <CircularProgress color="inherit"/>
                </Backdrop>
            }

        </div>

    )
}
export default BooksDetails;
