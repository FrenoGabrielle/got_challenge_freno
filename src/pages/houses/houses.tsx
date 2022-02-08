import React, {useEffect, useState} from 'react';
import endpoints from "../../utils/endpoints.json";
import request from "../../utils/request";
import Button from "@material-ui/core/Button";
import {useNavigate, useParams} from "react-router-dom";
import {useForm} from "react-hook-form";
import {Card, CardActionArea, CardContent, CardMedia, Grid, MenuItem, TextField, Typography} from "@material-ui/core";
import stark from "../../images/houses/stark.png";
import {FormControl, FormControlLabel, InputLabel, Pagination, Radio, RadioGroup, Select, Stack} from "@mui/material";


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

type FormData = {
    region: string;
    name: string;
};


const Houses = () => {

    const [houses, setHouses]: [IHouses[], (resources: IHouses[]) => void] = useState(defaultHouses);
    const [allHouses, setAllHouses]: [IHouses[], (resources: IHouses[]) => void] = useState(defaultHouses);
    const [loading, setLoading]: [boolean, (loading: boolean) => void] = useState<boolean>(true);
    const [error, setError]: [string, (error: string) => void] = useState('All');
    const [totalPage, setTotalPage] = React.useState(10);
    const [page, setPage] = React.useState(1);
    const [region, setRegion] = useState<String>('');
    const [term, setTerm] = useState('');


    let getHouses = async (page: number) => {
        let h = await request(
            `${endpoints.baseURL}${endpoints.houses}?page=${page}&pageSize=48`,
            'GET',
            null
        );

            setAllHouses(h);
            setHouses(h);


    }

    let {HouseId} = useParams();
    let navigate = useNavigate();

    //function that get book's id from the url
    let parseQueryString = (queryString: string): any => {
        let queries = queryString.split("/");
        let key = queries[queries.length - 1];
        return key;
    }

    let seeDetails = (house: IHouses) => {
        HouseId = parseQueryString(house.url);
        navigate(`./${HouseId}`, {state: house});

    }

    let filterHouses = async () => {
        let filteredHouses = [];
        if (term !== '') {
            console.log('term');
            let c = await request(
                `${endpoints.baseURL}${endpoints.houses}?name=${term}`,
                'GET',
                null
            );
            console.log(c);
            filteredHouses.push(c);

        }
        if (region !== '') {
            console.log('region');
            console.log(region);
            let c = await request(
                `${endpoints.baseURL}${endpoints.houses}?region=${region}&pageSize=50`,
                'GET',
                null
            );
            console.log(c);
            filteredHouses.push(c);
        }

        let newTotalPage = Math.ceil(filteredHouses[0].length/48);
        setTotalPage(newTotalPage);

        setHouses(filteredHouses[0]);
    }

    let resetFilters = () => {
        window.location.reload();
    }

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        console.log(value);
    };

    useEffect(() => {
        async function fetchData() {
            await getHouses(page);
        }

        fetchData();
    }, [page])



    const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
        // Preventing the page from reloading
        event.preventDefault();
        filterHouses();

    }

    return (
        <div>
            <p>Houses</p>
            <div>
                <form onSubmit={submitForm}>
                    <div className="books_form">
                        <div className="books_filter">
                            <TextField id="filled-basic"
                                       label="House's name"
                                       type="text"
                                       variant="filled"
                                       placeholder="House Amber"
                                       style={{width: '45%'}}
                                       onChange={(e) => setTerm(e.target.value)}/>
                            <FormControl variant="filled">
                                <InputLabel id="selectRegionLabel">Region</InputLabel>
                                <Select
                                    labelId="selectRegionLabel"
                                    id="selectRegion"
                                    value={region}
                                    onChange={(e) => setRegion(e.target.value)}
                                    label="Gender">
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={'The Westerlands'}>The Westerlands</MenuItem>
                                    <MenuItem value={'Dorne'}>Dorne</MenuItem>
                                    <MenuItem value={'The North'}>The North</MenuItem>
                                    <MenuItem value={'The Reach'}>The Reach</MenuItem>
                                    <MenuItem value={'The Vale'}>The Vale</MenuItem>
                                    <MenuItem value={'The Riverlands'}>The Riverlands</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                        <div className="books_filter_buttons">
                            <Button variant="contained" type="submit"
                                    style={{width: '30%', marginRight: '50px'}}>Search</Button>
                            <Button variant="outlined" onClick={resetFilters} style={{width: '30%'}}>Reset filters</Button>
                        </div>
                    </div>
                </form>
            </div>
            <div>
                <div className="book_cards">
                    <Grid container spacing={3}>
                        {houses.map((h) => (
                                <Grid item xs={12} sm={4}>
                                    <Card className="book_card">
                                        <CardActionArea onClick={() => seeDetails(h)}>
                                            <CardMedia
                                                component="img"
                                                height="400"
                                                image={stark}
                                                alt="book1"
                                            />
                                            <CardContent>
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {h.name}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </Card>
                                </Grid>
                            )
                        )}
                    </Grid>
                </div>
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
export default Houses;
