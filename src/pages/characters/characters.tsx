import React, {useEffect, useState} from 'react';
import endpoints from "../../utils/endpoints.json";
import request from "../../utils/request";
import Button from "@material-ui/core/Button";
import {useNavigate, useParams} from "react-router-dom";
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormLabel,
    InputLabel,
    Pagination, Radio,
    RadioGroup,
    Select,
    Stack
} from "@mui/material";
import {Card, CardActionArea, CardContent, CardMedia, Grid, MenuItem, TextField, Typography} from "@material-ui/core";
import jon from "../../images/characters/jon_snow.jpg";


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


const Characters = () => {

    const [characters, setCharacter]: [ICharacters[], (resources: ICharacters[]) => void] = useState(defaultCharacters);
    const [loading, setLoading]: [boolean, (loading: boolean) => void] = React.useState<boolean>(true);
    const [error, setError]: [string, (error: string) => void] = React.useState('');
    const [page, setPage] = React.useState(1);
    const [totalPage, setTotalPage] = React.useState(45);
    const [term, setTerm] = useState('');
    const [gender, setGender] = useState('');
    const [isDead, setIsDead] = useState('');
    const [allCharacters, setAllCharacters]: [ICharacters[], (resources: ICharacters[]) => void] = useState(defaultCharacters);

    let getCharacters = async (page: number) => {
        let c = await request(
            `${endpoints.baseURL}${endpoints.characters}?page=${page}&pageSize=48`,
            'GET',
            null
        );

        console.log(c);

        setCharacter(c);

    }



    let {characterId} = useParams();
    let navigate = useNavigate();

    //function that get book's id from the url
    let parseQueryString = (queryString: string): any => {
        let queries = queryString.split("/");
        let key = queries[queries.length - 1];
        return key;
    }

    let seeDetails = (character: ICharacters) => {
        characterId = parseQueryString(character.url);
        navigate(`./${characterId}`, {state: character});

    }

    let filterCharacters = async () => {
        let filteredCharacters = [];
        console.log(allCharacters);
        if (term !== '') {
            console.log('term');
            let c = await request(
                `${endpoints.baseURL}${endpoints.characters}?name=${term}`,
                'GET',
                null
            );
            console.log(c);
            filteredCharacters.push(c);

        }
        if (gender !== '') {
            console.log('gender');
            console.log(gender);
            let c = await request(
                `${endpoints.baseURL}${endpoints.characters}?gender=${gender}&pageSize=50`,
                'GET',
                null
            );
            console.log(c);
            filteredCharacters.push(c);
        }
        if (isDead !== '') {
            if (isDead === 'dead') {
                console.log('dead');
                let c = await request(
                    `${endpoints.baseURL}${endpoints.characters}?isAlive=false&pageSize=50`,
                    'GET',
                    null
                );
                console.log(c);
                filteredCharacters.push(c);
            } else {
                console.log('alive');
                let c = await request(
                    `${endpoints.baseURL}${endpoints.characters}?isAlive=true&pageSize=50`,
                    'GET',
                    null
                );
                console.log(c);
                filteredCharacters.push(c);
            }

        }
        let newTotalPage = Math.ceil(filteredCharacters[0].length/48);
        setTotalPage(newTotalPage);

        setCharacter(filteredCharacters[0]);


    }

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

    let resetFilters = () => {
        window.location.reload();
    }


    const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
        // Preventing the page from reloading
        event.preventDefault();
        filterCharacters();


    }


    return (
        <div>
            <h1>Characters</h1>
            <form onSubmit={submitForm}>
                <div className="books_form">
                    <div className="books_filter">
                        <TextField id="filled-basic"
                                   label="Character's name"
                                   type="text"
                                   variant="filled"
                                   placeholder="Jon Snow"
                                   style={{width: '45%'}}
                                   onChange={(e) => setTerm(e.target.value)}/>
                        <FormControl variant="filled">
                            <InputLabel id="selectGenderLabel">Gender</InputLabel>
                            <Select
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
                                name="selectDeadOrNot"
                                value={isDead}
                                onChange={(e) => setIsDead(e.target.value)}>
                                <FormControlLabel value="alive" control={<Radio/>} label="Alive"/>
                                <FormControlLabel value="dead" control={<Radio/>} label="Dead"/>
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div className="books_filter_buttons">
                        <Button variant="contained" type="submit"
                                style={{width: '30%', marginRight: '50px'}}>Search</Button>
                        <Button variant="outlined" onClick={resetFilters} style={{width: '30%'}}>Reset filters</Button>
                    </div>
                </div>
            </form>
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
                                            alt="book1"
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
