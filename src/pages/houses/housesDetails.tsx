import React, {useEffect, useState} from 'react';
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom';
import request from "../../utils/request";
import endpoints from "../../utils/endpoints.json";
import Button from "@material-ui/core/Button";
import {Accordion, AccordionDetails, AccordionSummary, Box, Card, ListItem, Typography} from "@material-ui/core";
import {Grid, List, ListItemText} from "@mui/material";
import stark from "../../images/houses/stark.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


interface IHouse {
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


const defaultHouse: IHouse = {
    url: 'Unknown',
    name: 'Unknown',
    region: 'Unknown',
    coatOfArms: 'Unknown',
    words: 'Unknown',
    titles: [],
    seats: [],
    currentLord: 'Unknown',
    heir: 'Unknown',
    overlord: 'Unknown',
    founded: 'Unknown',
    founder: 'Unknown',
    diedOut: 'Unknown',
    ancestralWeapons: [],
    cadetBranches: [],
    swornMembers: []
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

const HousesDetails = () => {


    let {houseId} = useParams();
    let selectedBook = useLocation();
    let test: IHouse;
    let navigate = useNavigate();

    const [house, setHouse]: [IHouse, (book: IHouse) => void] = useState(defaultHouse);
    const [loading, setLoading]: [boolean, (loading: boolean) => void] = useState<boolean>(false);
    const [lord, setLord]: [ICharacters[], (resources: ICharacters[]) => void] = useState(defaultCharacters);
    const [heir, setHeir]: [ICharacters[], (resources: ICharacters[]) => void] = useState(defaultCharacters);
    const [overlord, setOverlord]: [ICharacters[], (resources: ICharacters[]) => void] = useState(defaultCharacters);
    const [swornMembers, setSwornMembers]: [ICharacters[], (resources: ICharacters[]) => void] = useState(defaultCharacters);
    const [cadetBranches, setCadetBranches]: [IHouse[], (resources: IHouse[]) => void] = useState([defaultHouse]);


    let getCharacters = async (url: string, characterType: string) => {
        let c = await request(
            url,
            'GET',
            null
        );

        switch (characterType) {
            case "lord": {
                setLord(c.name);
                break;
            }
            case "heir": {
                setHeir(c.name);
                break;
            }
            case "overlord": {
                setOverlord(c.name);
                break;
            }
            default: {
                setOverlord(c.name);
                break;
            }
        }

    }

    let getSwornMembers = async (urls: string[]) => {
        let swornM = [];
        for (let i = 0; i < urls.length; i++) {
            let c = await request(
                urls[i],
                'GET',
                null
            );

            swornM.push(c.name);
            swornM.sort((a, b) => {
                return a.localeCompare(b);
            });


        }

        setSwornMembers(swornM);

    }

    let getCadetBranches = async (urls: string[]) => {

        let cadetB = [];
        for (let i = 0; i < urls.length; i++) {
            let c = await request(
                urls[i],
                'GET',
                null
            );
            if (c === undefined) {
                cadetB.push(defaultHouse);
            } else {
                cadetB.push(c.name);
            }
        }
        setCadetBranches(cadetB);

    }


    let getHouse = async () => {

        test = selectedBook.state as IHouse;

        setHouse(test);
        console.log(test);

        console.log(test.name);

        const timer = setTimeout(() => {
            getCharacters(test.currentLord, "lord");
            getCharacters(test.heir, "heir");
            getCharacters(test.overlord, "overlord");
            getSwornMembers(test.swornMembers);
            getCadetBranches(test.cadetBranches);
        }, 2000);
        return () => clearTimeout(timer);

    }


    useEffect(() => {
        getHouse();

        const timer = setTimeout(() => {
            setLoading(true);

        }, 5000);
        return () => clearTimeout(timer);

    }, []);


    return (
        <div>
            {loading ?
                <>
                    <Card className="card_info">
                        <div className="presentation_div">
                            <div className="box_info">
                                <Box sx={{flexGrow: 1}}>
                                    <Grid container spacing={7}>
                                        <Grid item xs={12} className="book_infos"
                                              style={{textAlign: 'center', fontSize: '24px', marginBottom: '20px'}}>
                                            <p>{house.name}</p>
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <p>Region : {house.region}</p>
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <p>Titles : {house.titles}</p>
                                        </Grid>
                                        <Grid item xs={12} className="book_infos">
                                            <p>Coat of Arm : {house.coatOfArms}</p>
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <p>Words : {house.words}</p>
                                        </Grid>

                                        <Grid item xs={6} className="book_infos">
                                            <p>Seats : {house.seats}</p>
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <p>Current Lord : {lord}</p>
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <p>Heir : {heir}</p>
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <p>Overlord : {overlord}</p>
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <p>Founded : {house.founded}</p>
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <p>Died out : {house.diedOut}</p>
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <p>Ancestral Weapons : {house.ancestralWeapons}</p>
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <p>Cadet branches : {house.cadetBranches}</p>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </div>
                            <div>
                                <img src={stark} alt="book1" style={{width: '100%', height: '400px'}}/>
                            </div>
                        </div>
                        <div className="accordion_div">
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon/>}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header">
                                    <Typography>Cadet branches</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <List>
                                        {cadetBranches.map((c) => (
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
                                    <Typography>Sworn Members</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <List>
                                        {swornMembers.map((c) => (
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

export default HousesDetails;
