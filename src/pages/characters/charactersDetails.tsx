import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {request, ICharacters, IBooks, IHouses, queryString, navigation} from "../../utils/request";
import {Accordion, AccordionDetails, AccordionSummary, Box, Card, ListItem, Typography} from "@material-ui/core";
import {Backdrop, CircularProgress, Grid, Link, List, ListItemText} from "@mui/material";
import jon from "../../images/characters/jon_snow.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NavigationBar from "../../navigation/navbar";

//by default, character fields are unknown
const defaultCharacter: ICharacters = {
    url: 'Unknown',
    name: 'Unknown',
    gender: 'Unknown',
    culture: 'Unknown',
    born: 'Unknown',
    died: 'Unknown',
    titles: [],
    aliases: [],
    father: 'Unknown',
    mother: 'Unknown',
    spouse: 'Unknown',
    allegiances: [],
    books: [],
    povBooks: [],
    tvSeries: [],
    playedBy: []
};

//by default a house is empty
const defaultHouses: IHouses[] = [];

//by default a book is empty
const defaultBooks: IBooks[] = [];

//by default a characters is empty
const defaultCharacters: ICharacters[] = [];


const CharactersDetails = () => {

    //navbar
    const {brand, links} = navigation;

    //to get params receive from Characters.tsx
    let selectedCharacter = useLocation();
    let characterToDisplay: ICharacters;

    //to send the selected house/book to the details page
    let {id} = useParams();
    let navigate = useNavigate();

    //useState
    const [character, setCharacter]: [ICharacters, (character: ICharacters) => void] = useState(defaultCharacter);
    const [spouse, setSpouse]: [ICharacters, (character: ICharacters) => void] = useState(defaultCharacter);
    const [mother, setMother]: [ICharacters, (character: ICharacters) => void] = useState(defaultCharacter);
    const [father, setFather]: [ICharacters, (character: ICharacters) => void] = useState(defaultCharacter);
    const [loading, setLoading]: [boolean, (loading: boolean) => void] = useState<boolean>(false);
    const [books, setBooks]: [IBooks[], (resources: IBooks[]) => void] = useState(defaultBooks);
    const [povCharacters, setPovCharacters]: [ICharacters[], (povCharacter: ICharacters[]) => void] = useState(defaultCharacters);
    const [houses, setHouses]: [IHouses[], (resources: IHouses[]) => void] = useState(defaultHouses);
    const [open, setOpen] = React.useState(true);


    //get the character we received from characters.tsx
    let getCharacter = async () => {

        characterToDisplay = selectedCharacter.state as ICharacters;
        setCharacter(characterToDisplay);

        //call some function to get all data
        const timer = setTimeout(() => {
            getCharacters(characterToDisplay.spouse, 'spouse');
            getCharacters(characterToDisplay.mother, 'mother');
            getCharacters(characterToDisplay.father, 'father');
            getBooks(characterToDisplay.books);
            getPovCharacters(characterToDisplay.povBooks);
            getHouses(characterToDisplay.allegiances);
        }, 2000);
        return () => clearTimeout(timer);
    }

    //get all Houses we need to display in details
    //param : url = string => character url
    let getHouses = async (url: string[]) => {
        let allHouses = [];

        for (let i = 0; i < url.length; i++) {
            //https://www.anapioficeandfire.com/api/house/12
            let c = await request(
                url[i],
                'GET',
                null
            );
            allHouses.push(c);
        }
        setHouses(allHouses);
    }

    //get all Books we need to display in details
    //param : urls = string[] => book url
    let getBooks = async (urls: string[]) => {
        let allBooks = [];

        for (let i = 0; i < urls.length; i++) {
            let c = await request(
                urls[i],
                'GET',
                null
            );
            //put result in array
            allBooks.push(c);
        }
        setBooks(allBooks);
    }

    //get all POV Characters we need to display in details
    //param : urls = string[] => array with POV characters urls
    let getPovCharacters = async (urls: string[]) => {

        let allPov = [];

        if (urls != []) {
            for (let i = 0; i < urls.length; i++) {
                let c = await request(
                    urls[i],
                    'GET',
                    null
                );
                //put result in array
                allPov.push(c);
            }
            setPovCharacters(allPov);
        }
    }

    //get all Characters we need to display in details
    //param : url = string => character url
    //param : charactersType = string => type of character we want
    let getCharacters = async (url: string, charactersType: string) => {

        let c = await request(
            url,
            'GET',
            null
        );

        //actions in function of the character type
        switch (charactersType) {
            case "spouse" : {
                if (c === undefined) {
                    setSpouse(defaultCharacter);
                } else {
                    setSpouse(c);
                }
                break;
            }
            case "mother" : {
                if (c === undefined) {
                    setMother(defaultCharacter);
                } else {
                    setMother(c);
                }
                break;
            }
            case "father" : {
                if (c === undefined) {
                    setFather(defaultCharacter);
                } else {
                    setFather(c);
                }
                break;
            }
        }
    }

    //function to go to book's details
    //param : type = IBooks => the selected book
    let seeDetailsBook = async (book: IBooks) => {
        //get the id to get the correct url
        id = await queryString(book.url);
        //move to the details page & send the selected character
        navigate(`../books/${id}`, {state: book});
    }


    //function to go to House's details
    //param : type = IHouse => the selected house
    let seeDetailsHouse = async (house: IHouses) => {
        //get the id to get the correct url
        id = await queryString(house.url);
        //move to the details page & send the selected character
        navigate(`../houses/${id}`, {state: house});

    }


    useEffect(() => {
        async function fetchData() {
            await getCharacter();
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
                            <div className="box_info" >
                                <Box sx={{flexGrow: 1}}>
                                    <Grid container spacing={1} style={{height:'fit-content'}}>
                                        <Grid item xs={12} className="book_infos"
                                              style={{textAlign: 'center', fontSize: '24px', marginBottom: '20px'}}>
                                           <b>{character.name}</b>
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <b>Gender : </b>{character.gender}
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <b>Culture : </b>{character.culture}
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <b>Born : </b>{character.born}
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <b>Death : </b>{character.died}
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <b>Father : </b>{father.name}
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <b>Mother : </b>{mother.name}
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <b>Spouse : </b>{spouse.name}
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <b>Played by : </b>{character.playedBy}
                                        </Grid>
                                        <Grid item xs={6} className="book_infos" style={{height:'fit-content'}}>
                                            <b>Aliases :</b>
                                            <ul>
                                                {character.aliases.map((x) => (
                                                    <li>{x}</li>
                                                ))}
                                            </ul>
                                        </Grid>
                                        <Grid item xs={6} className="book_infos" style={{height:'fit-content'}}>
                                            <b>Series apparitions : </b>
                                            <ul>
                                                {character.tvSeries.map((x) => (
                                                    <li>{x}</li>
                                                ))}
                                            </ul>
                                        </Grid>
                                        <Grid item xs={6} className="book_infos" style={{height:'fit-content'}}>
                                            <b>Titles : </b>
                                            <ul>
                                                {character.titles.map((x) => (
                                                    <li>{x}</li>
                                                ))}
                                            </ul>
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
                                            <Typography>Character appears in book</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <List>
                                                {books.map((c) => (
                                                    <ListItem>
                                                        <ListItemText>
                                                            <Link onClick={() => seeDetailsBook(c)}>{c.name}</Link>
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
                                                    <ListItem>{c.name}</ListItem>
                                                ))}
                                            </List>
                                        </AccordionDetails>
                                    </Accordion>
                                    <Accordion>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon/>}
                                            aria-controls="panel2a-content"
                                            id="panel2a-header">
                                            <Typography>Allegiances</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <List>
                                                {houses.map((c) => (
                                                    <ListItem>
                                                        <Link onClick={() => seeDetailsHouse(c)}>{c.name}</Link>
                                                    </ListItem>
                                                ))}
                                            </List>
                                        </AccordionDetails>
                                    </Accordion>
                                </div>
                            </div>
                            <div>
                                <img src={jon} alt="jon" style={{width: '100%', height: '650px'}}/>
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
export default CharactersDetails;
