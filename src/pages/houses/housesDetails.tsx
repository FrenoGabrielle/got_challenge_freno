import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {request, IHouses, ICharacters, queryString, navigation} from "../../utils/request";
import {Accordion, AccordionDetails, AccordionSummary, Box, Card, ListItem, Typography} from "@material-ui/core";
import {Backdrop, CircularProgress, Grid, Link, List, ListItemText} from "@mui/material";
import stark from "../../images/houses/stark.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import NavigationBar from "../../navigation/navbar";

//by default, house fields are unknown
const defaultHouse: IHouses = {
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

//by default a character is empty
const defaultCharacters: ICharacters[] = [];

const HousesDetails = () => {

    //navbar
    const {brand, links} = navigation;

    //to get params receive from Houses.tsx
    let selectedHouse = useLocation();
    let houseToDisplay: IHouses;

    //to send the selected house to the character page
    let {id} = useParams();
    let navigate = useNavigate();

    //useState
    const [house, setHouse]: [IHouses, (house: IHouses) => void] = useState(defaultHouse);
    const [loading, setLoading]: [boolean, (loading: boolean) => void] = useState<boolean>(false);
    const [lord, setLord]: [ICharacters[], (resources: ICharacters[]) => void] = useState(defaultCharacters);
    const [heir, setHeir]: [ICharacters[], (resources: ICharacters[]) => void] = useState(defaultCharacters);
    const [overlord, setOverlord]: [ICharacters[], (resources: ICharacters[]) => void] = useState(defaultCharacters);
    const [swornMembers, setSwornMembers]: [ICharacters[], (resources: ICharacters[]) => void] = useState(defaultCharacters);
    const [cadetBranches, setCadetBranches]: [IHouses[], (resources: IHouses[]) => void] = useState([defaultHouse]);
    const [open, setOpen] = React.useState(true);

    //get the house we received from House.tsx
    let getHouse = async () => {

        houseToDisplay = selectedHouse.state as IHouses;

        setHouse(houseToDisplay);

        //call some function to get all data
        const timer = setTimeout(() => {
            getCharacters(houseToDisplay.currentLord, "lord");
            getCharacters(houseToDisplay.heir, "heir");
            getCharacters(houseToDisplay.overlord, "overlord");
            getSwornMembers(houseToDisplay.swornMembers);
            getCadetBranches(houseToDisplay.cadetBranches);
        }, 1000);
        return () => clearTimeout(timer);
    }

    //get all Characters we need to display in details
    //param : url = string => character url
    let getCharacters = async (url: string, characterType: string) => {

        let c = await request(
            //https://www.anapioficeandfire.com/api/characters/12
            url,
            'GET',
            null
        );

        //actions in function of the character type
        switch (characterType) {
            case "lord": {
                if (lord === undefined) {
                    setLord(defaultCharacters);
                } else {
                    setLord(c.name);
                }
                break;
            }
            case "heir": {
                if (heir === undefined) {
                    setHeir(defaultCharacters);
                } else {
                    setHeir(c.name);
                }
                break;
            }
            case "overlord": {
                if (overlord === undefined) {
                    setOverlord(defaultCharacters);
                } else {
                    setOverlord(c.name);
                }
                break;
            }
        }
    }

    //get all sworn Members we need to display in details
    //param : urls = string[] => array with sworn members urls
    let getSwornMembers = async (urls: string[]) => {

        let swornM = [];


        //Because of the number of character, we only get 10 characters
        let length = 0;

        if (urls.length > 11) {
            length = 10;
        } else {
            length = urls.length;
        }

        for (let i = 0; i < length; i++) {
            let c = await request(
                urls[i],
                'GET',
                null
            );
            //put result in array
            swornM.push(c);
        }
        setSwornMembers(swornM);

    }

    //get all cadet branches we need to display in details
    //param : urls = string[] => array with cadet branches urls
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
                //put result in array
                cadetB.push(c);
            }
            console.log(c);
        }

    }


    //function to go to characters's details
    //param : type = ICharacters => the selected character
    let seeDetailsCharacter = async (character: ICharacters) => {
        //get the id to get the correct url
        id = await queryString(character.url);
        //move to the details page & send the selected character
        navigate(`./characters/${id}`, {state: character});

    }

    useEffect(() => {
        async function fetchData() {
            await getHouse();
        }

        fetchData();
        //timer to get data
        const timer = setTimeout(() => {
            setLoading(true);
            setOpen(false);
        }, 2000);
        return () => clearTimeout(timer);

    }, []);


    return (
        <div className="div_details">
            <NavigationBar brand={brand} links={links}/>
            {loading ?
                <>
                    <Card className="card_info">
                        <div className="presentation_div">
                            <div className="box_info">
                                <Box sx={{flexGrow: 1}}>
                                    <Grid container spacing={1} style={{height: 'fit-content'}}>
                                        <Grid item xs={12} className="book_infos"
                                              style={{textAlign: 'center', fontSize: '24px', marginBottom: '20px'}}>
                                            <b>{house.name}</b>
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <b>Region : </b>{house.region}
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <b>Seats : </b>{house.seats}
                                        </Grid>

                                        <Grid item xs={12} className="book_infos">
                                            <b>Coat of Arm : </b>{house.coatOfArms}
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <b>Words : </b>{house.words}
                                        </Grid>

                                        <Grid item xs={6} className="book_infos">
                                            <b>Current Lord : </b>{lord}
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <b>Heir : </b>{heir}
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <b>Overlord : </b>{overlord}
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <b>Founded : </b>{house.founded}
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <b>Died out : </b>{house.diedOut}
                                        </Grid>
                                        <Grid item xs={6} className="book_infos">
                                            <b>Ancestral Weapons : </b>{house.ancestralWeapons}
                                        </Grid>
                                        <Grid item xs={6} className="book_infos" style={{height: 'fit-content'}}>
                                            <b>Titles : </b>
                                            <ul>
                                                {house.titles.map((x) => (
                                                    <li>{x}</li>
                                                ))}
                                            </ul>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </div>
                            <div>
                                <img src={stark} alt="stark" style={{width: '100%', height: '400px'}}/>
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
                                    <Typography>Sworn Members</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <List>
                                        {swornMembers.map((c) => (
                                            <ListItem>
                                                <Link onClick={() => seeDetailsCharacter(c)}>{c.name}</Link>
                                            </ListItem>
                                        ))}
                                    </List>
                                </AccordionDetails>
                            </Accordion>
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

export default HousesDetails;
