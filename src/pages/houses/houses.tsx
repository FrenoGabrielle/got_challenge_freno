import React, {useEffect, useState} from 'react';
import endpoints from "../../utils/endpoints.json";
import {request, queryString, IHouses, navigation} from "../../utils/request";
import {useNavigate, useParams} from "react-router-dom";
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
import stark from "../../images/houses/stark.png";
import NavigationBar from "../../navigation/navbar";


//by default a house is empty
const defaultHouses: IHouses[] = [];

const Houses = () => {

    //navbar
    const {brand, links} = navigation;

    //to send the selected house to the details page
    let {houseId} = useParams();
    let navigate = useNavigate();

    //useState
    const [houses, setHouses]: [IHouses[], (resources: IHouses[]) => void] = useState(defaultHouses);
    const [totalPage, setTotalPage] = React.useState(10);
    const [page, setPage] = React.useState(1);
    const [region, setRegion] = useState<String>('');
    const [houseName, setHouseName] = useState('');


    //get all Houses
    //Because of the number of house, we split it in pages & load only houses of the current page
    //param : type = number => current page
    let getHouses = async (page: number) => {
        let h = await request(
            //https://www.anapioficeandfire.com/api/houses?page=1&pageSize=48
            `${endpoints.baseURL}${endpoints.houses}?page=${page}&pageSize=48`,
            'GET',
            null
        );
        setHouses(h);
    }

    //function to see details of the selected house
    //param : type = IHouses => the selected house
    let seeDetails = async (house: IHouses) => {
        //get the id to get the correct url
        houseId = await queryString(house.url);
        //move to the details page & send the selected house
        navigate(`./${houseId}`, {state: house});
    }

    //function to filter houses
    //filter by name either by region
    let filterHouses = async () => {

        let filteredHouses = [];
        //if user enters a name
        //return one house that has the same name that the input
        if (houseName !== '') {
            let c = await request(
                //https://www.anapioficeandfire.com/api/houses?name=House Algood
                `${endpoints.baseURL}${endpoints.houses}?name=${houseName}`,
                'GET',
                null
            );
            //put result in array
            filteredHouses.push(c);
        }

        //if user chooses a region
        //return 50 first houses that have the same region that the input
        if (region !== '') {
            let c = await request(
                //https://www.anapioficeandfire.com/api/houses?region=The North
                `${endpoints.baseURL}${endpoints.houses}?region=${region}&pageSize=50`,
                'GET',
                null
            );
            //put results in array
            filteredHouses.push(c);
        }

        //adjust the number of needed page to present results
        //number of result / number of result per page
        //take the higher integer
        let newTotalPage = Math.ceil(filteredHouses[0].length / 48);
        setTotalPage(newTotalPage);

        setHouses(filteredHouses[0]);
    }

    //function that reinitialize all the filters
    let resetFilters = () => {
        setHouseName('');
        setRegion('');
    }

    //function that handle the page change
    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    //useEffect to get data
    //refresh each time we change page
    useEffect(() => {
        async function fetchData() {
            await getHouses(page);
        }

        fetchData();
    }, [page])


    //function to submit the search
    const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
        //Preventing the page from reloading
        event.preventDefault();
        //filter function
        filterHouses();

    }

    return (
        <div className="content_bg">
            <NavigationBar brand={brand} links={links}/>
            <div className="form_bg">
                <h1>Houses</h1>
                <div>
                    <form onSubmit={submitForm}>
                        <div className="books_form">
                            <div className="books_filter" style={{width: '35%'}}>
                                <TextField id="filled-basic"
                                           color="error"
                                           label="House's name"
                                           type="text"
                                           variant="filled"
                                           placeholder="House Amber"
                                           style={{width: '45%'}}
                                           onChange={(e) => setHouseName(e.target.value)}/>
                                <FormControl variant="filled">
                                    <InputLabel color="error" id="selectRegionLabel">Region</InputLabel>
                                    <Select
                                        color="error"
                                        style={{width: '200px'}}
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
                                <Button variant="contained" type="submit" color="success"
                                        style={{width: '30%', marginRight: '50px'}}>Search</Button>
                                <Button variant="outlined" color="primary" onClick={resetFilters} style={{width: '30%'}}>Reset
                                    filters</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div>
                <div className="book_cards">
                    <Grid container spacing={3}>
                        {houses.map((h) => (
                                <Grid item xs={12} sm={3}>
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
