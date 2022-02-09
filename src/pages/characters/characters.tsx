import React, {useEffect, useState} from 'react';
import endpoints from "../../utils/endpoints.json";
import {request, queryString, ICharacters, navigation} from "../../utils/request";
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    TextField,
    Typography,
    Button,
    FormControl, InputLabel, Select, MenuItem, RadioGroup, FormControlLabel, Radio, Stack, Pagination
} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import jon from "../../images/characters/jon_snow.png";
import NavigationBar from "../../navigation/navbar";


//by default a character is empty
const defaultCharacters: ICharacters[] = [];


const Characters = () => {

    //navbar
    const {brand, links} = navigation;

    //to send the selected character to the details page
    let {characterId} = useParams();
    let navigate = useNavigate();

    //useState
    const [characters, setCharacter]: [ICharacters[], (resources: ICharacters[]) => void] = useState(defaultCharacters);
    const [page, setPage] = React.useState(1);
    const [totalPage, setTotalPage] = React.useState(45);
    const [characterName, setCharacterName] = useState('');
    const [gender, setGender] = useState('');
    const [isDead, setIsDead] = useState('');


    //get all Characters
    //Because of the number of character, we split it in pages & load only characters of the current page
    //param : type = number => current page
    let getCharacters = async (page: number) => {
        let c = await request(
            //https://www.anapioficeandfire.com/api/characters?page=1&pageSize=48
            `${endpoints.baseURL}${endpoints.characters}?page=${page}&pageSize=48`,
            'GET',
            null
        );
        setCharacter(c);
    }

    //function to see details of the selected character
    //param : type = ICharacter => the selected character
    let seeDetails = async (character: ICharacters) => {
        //get the id to get the correct url
        characterId = await queryString(character.url);
        //move to the details page & send the selected character
        navigate(`./${characterId}`, {state: character});
    }
    //function to filter characters
    //filter by name either by gender either by alive or dead
    let filterCharacters = async () => {

        let filteredCharacters = [];
        //if user enters a name
        //return one character that has the same name that the input
        if (characterName !== '') {
            let c = await request(
                //https://www.anapioficeandfire.com/api/character?name=Jon Snow
                `${endpoints.baseURL}${endpoints.characters}?name=${characterName}`,
                'GET',
                null
            );
            //put result in array
            filteredCharacters.push(c);
        }

        //if user selects a gender
        //return 50 first character that have the same gender that the input
        if (gender !== '') {
            let c = await request(
                //https://www.anapioficeandfire.com/api/character?gender=Male
                `${endpoints.baseURL}${endpoints.characters}?gender=${gender}&pageSize=50`,
                'GET',
                null
            );
            //put result in array
            filteredCharacters.push(c);
        }

        //if user selects dead or alive
        //return 50 first character that corresponds to the input
        if (isDead !== '') {
            if (isDead === 'dead') {
                let c = await request(
                    //https://www.anapioficeandfire.com/api/character?isAlive=false
                    `${endpoints.baseURL}${endpoints.characters}?isAlive=false&pageSize=50`,
                    'GET',
                    null
                );
                //put result in array
                filteredCharacters.push(c);
            } else {
                let c = await request(
                    //https://www.anapioficeandfire.com/api/character?isAlive=true
                    `${endpoints.baseURL}${endpoints.characters}?isAlive=true&pageSize=50`,
                    'GET',
                    null
                );
                //put result in array
                filteredCharacters.push(c);
            }

        }

        //adjust the number of needed page to present results
        //number of result / number of result per page
        //take the higher integer
        let newTotalPage = Math.ceil(filteredCharacters[0].length / 48);
        setTotalPage(newTotalPage);

        setCharacter(filteredCharacters[0]);
    }

    //function that reinitialize all the filters
    let resetFilters = () => {
        setCharacterName('');
        setGender('');
        setIsDead('');
        setTotalPage(45);

    }

    //function that handle the page change
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        console.log(value);
    };


    useEffect(() => {
        async function fetchData() {
            await getCharacters(page);
        }

        fetchData();
    }, [page])

    //function to submit the search
    const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
        // Preventing the page from reloading
        event.preventDefault();
        filterCharacters();
    }

    return (
        <div className="content_bg">
            <NavigationBar brand={brand} links={links}/>
            <div className="form_bg">
                <h1>Characters</h1>
                <form onSubmit={submitForm}>
                    <div className="books_form">
                        <div className="books_filter" style={{width: '70%'}}>
                            <TextField id="filled-basic"
                                       color="error"
                                       label="Character's name"
                                       type="text"
                                       variant="filled"
                                       placeholder="Jon Snow"
                                       style={{width: '45%'}}
                                       onChange={(e) => setCharacterName(e.target.value)}/>
                            <FormControl variant="filled">
                                <InputLabel id="selectGenderLabel" color="error">Gender</InputLabel>
                                <Select
                                    color="error"
                                    style={{width: '120px'}}
                                    labelId="selectGenderLabel"
                                    id="selectGender"
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    label="Gender">
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={'Male'}>Male</MenuItem>
                                    <MenuItem value={'Female'}>Female</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl>
                                <RadioGroup
                                    row
                                    name="selectDeadOrNot"
                                    value={isDead}
                                    onChange={(e) => setIsDead(e.target.value)}>
                                    <FormControlLabel value="alive" control={<Radio/>} label="Alive"/>
                                    <FormControlLabel value="dead" control={<Radio/>} label="Dead"/>
                                </RadioGroup>
                            </FormControl>
                        </div>
                        <div className="books_filter_buttons">
                            <Button variant="contained" type="submit" color="success"
                                    style={{width: '30%', marginRight: '50px'}}>Search</Button>
                            <Button variant="outlined" color="primary" onClick={resetFilters} style={{width: '30%'}}>Reset
                                filters</Button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="book_cards">
                <Grid container spacing={3}>
                    {characters.map((b) => (
                            <Grid item xs={12} sm={3}>
                                <Card className="book_card">
                                    <CardActionArea onClick={() => seeDetails(b)}>
                                        <CardMedia
                                            component="img"
                                            height="400"
                                            image={jon}
                                            alt="jon snow"
                                        />
                                        <CardContent>
                                            {b.name === '' ?
                                                <Typography gutterBottom variant="h5" component="div">
                                                    Unknown Name
                                                </Typography>
                                                :
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {b.name}
                                                </Typography>
                                            }
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        )
                    )}
                </Grid>
            </div>
            <div>
                <Stack spacing={2} className="pagination">
                    <Pagination count={totalPage} page={page} onChange={handleChange}
                                style={{height: '40px', margin: 'auto'}}/>
                </Stack>
            </div>
        </div>

    )
}
export default Characters;
