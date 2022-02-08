import React, {useEffect, useState} from 'react';
import {Link, useLocation, useParams} from 'react-router-dom';
import request from "../../utils/request";
import endpoints from "../../utils/endpoints.json";
import Button from "@material-ui/core/Button";
import {Accordion, AccordionDetails, AccordionSummary, Box, Card, ListItem, Typography} from "@material-ui/core";
import {Grid, List, ListItemText} from "@mui/material";
import jon from "../../images/characters/jon_snow.jpg";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


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
    spouse: string;
    allegiances: string[];
    books: string[];
    povBooks: string[];
    tvSeries: string[];
    playedBy: string[];


}


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

interface IHouses {
    url: string;
    name: string;
    region: string;
    coatOfArms: string;
    words: string;
    titles: string[];
    seats: string[];
    currentLord: string;
    heir: string;
    overlord: string;
    founded: string;
    founder: string;
    diedOut: string;
    ancestralWeapons: string[];
    cadetBranches: string[];
    swornMembers: string[];

}

const defaultHouses: IHouses[] = [];

const defaultBooks: IBooks[] = [];

const defaultCharacters: ICharacters[] = [];

const CharactersDetails = () => {

    let {characterID} = useParams();
    let selectedBook = useLocation();

    const [character, setCharacter]: [ICharacters, (character: ICharacters) => void] = useState(defaultCharacter);
    const [spouse, setSpouse]: [ICharacters, (character: ICharacters) => void] = useState(defaultCharacter);
    const [mother, setMother]: [ICharacters, (character: ICharacters) => void] = useState(defaultCharacter);
    const [father, setFather]: [ICharacters, (character: ICharacters) => void] = useState(defaultCharacter);
    const [loading, setLoading]: [boolean, (loading: boolean) => void] = useState<boolean>(false);
    const [books, setBooks]: [IBooks[], (resources: IBooks[]) => void] = useState(defaultBooks);
    const [povCharacters, setPovCharacters]: [ICharacters[], (povCharacter: ICharacters[]) => void] = useState(defaultCharacters);
    const [houses, setHouses]: [IHouses[], (resources: IHouses[]) => void] = useState(defaultHouses);
    const [titles, setTitles] = useState('');

    let test: ICharacters;

    let getCharacter = async () => {
        test = selectedBook.state as ICharacters;

        setCharacter(test);

        const timer = setTimeout(() => {
            getCharacters(test.spouse, [], "spouse");
            getBooks(test.books);
            getCharacters('', test.povBooks, "pov");
            getHouses(test.allegiances);
        }, 5000);
        return () => clearTimeout(timer);
    }

    let getHouses = async (url: string[]) => {
        let allHouses = [];

        for (let i = 0; i < url.length; i++) {
            let c = await request(
                url[i],
                'GET',
                null
            );

            allHouses.push(c.name);
            allHouses.sort((a, b) => {
                return a.localeCompare(b);
            });


        }
        setHouses(allHouses);

    }


    let getBooks = async (url: string[]) => {
        let allBooks = [];


        for (let i = 0; i < url.length; i++) {
            let c = await request(
                url[i],
                'GET',
                null
            );

            allBooks.push(c.name);
            allBooks.sort((a, b) => {
                return a.localeCompare(b);
            });


        }
        setBooks(allBooks);
        console.log(allBooks);


    }

    let getCharacters = async (url: string, urls: string[], charactersType: string) => {

        let c = await request(
            url,
            'GET',
            null
        );

        switch (charactersType) {
            case "spouse" : {
                setSpouse(c);
                console.log(c);
                break;
            }
            case "mother" : {
                setMother(c);
                break;
            }
            case "father" : {
                setFather(c);
                break;
            }
            case "pov": {
                //setPovCharacters(c);
                break;
            }
        }

        console.log(spouse);
    }


    useEffect(() => {
        getCharacter();


        const timer = setTimeout(() => {
            setLoading(true);

        }, 2000);
        return () => clearTimeout(timer);

    }, [])


    return (
        <div>
            {loading ?
                <>
                    <Card className="card_info">
                        <div className="presentation_div">
                            <div className="box_info" style={{height: '500px'}}>
                                <Box sx={{flexGrow: 1}}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} className="book_infos"
                                              style={{textAlign: 'center', fontSize: '24px', marginBottom: '20px'}}>
                                            <p>{character.name}</p>
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <p>Gender : {character.gender}</p>
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <p>Culture : {character.culture}</p>
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <p>Born : {character.born}</p>
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <p>Death : {character.died}</p>
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <p>Father : {father.name}</p>
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <p>Mother : {mother.name}</p>
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <p>Spouse : {spouse.name}</p>
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <p>Played by : {character.playedBy}</p>
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <p>Titles : </p>
                                            <ul>
                                                {character.titles.map((x) => (
                                                    <li>{x}</li>
                                                ))}
                                            </ul>
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <p>Aliases : </p>
                                            <ul>
                                                {character.aliases.map((x) => (
                                                    <li>{x}</li>
                                                ))}
                                            </ul>
                                        </Grid>
                                        <Grid item xs={6} className="book_infos" style={{marginTop: '30px'}}>
                                            <p>Series apparitions : </p>
                                            <ul>
                                                {character.tvSeries.map((x) => (
                                                    <li>{x}</li>
                                                ))}
                                            </ul>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </div>
                            <div>
                                <img src={jon} alt="jon" style={{width: '100%', height: '400px'}}/>
                            </div>
                        </div>
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
                                                <ListItemText>{c}</ListItemText>
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
export default CharactersDetails;
