import React, {useEffect, useState} from 'react';
import endpoints from "../../utils/endpoints.json";
import {request, queryString, IBooks, navigation} from "../../utils/request";
import {useNavigate, useParams} from "react-router-dom";
import book1 from "../../images/books/book1.jpg";
import NavigationBar from "../../navigation/navbar";
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    TextField,
    Typography,
    Button,
    InputLabel, Select, MenuItem, FormControl
} from "@mui/material";


//by default a book is empty
const defaultBooks: IBooks[] = [];


const Books = () => {

    //navbar
    const {brand, links} = navigation;

    //to send the selected book to the details page
    let {bookId} = useParams();
    let navigate = useNavigate();

    //useState
    const [books, setBooks]: [IBooks[], (resources: IBooks[]) => void] = useState(defaultBooks);
    const [bookName, setBookName] = useState('');

    //get all books
    let getBooks = async () => {
        let b = await request(
            //https://www.anapioficeandfire.com/api/books?pageSize=20
            `${endpoints.baseURL}${endpoints.books}?pageSize=20`,
            'GET',
            null
        );
        setBooks(b);
    }

    //function to see details of the selected character
    //param : type = IBooks => the selected book
    let seeDetails = async (book: IBooks) => {
        //get the id to get the correct url
        bookId = await queryString(book.url);
        //move to the details page & send the selected character
        navigate(`./${bookId}`, {state: book});
    }

    //function to filter books
    //filter by name either by release date
    let filterBooks = async () => {

        let filteredBooks = [];
        //if user enters a name
        //return one book that has the same name that the input
        if (bookName !== undefined) {
            let c = await request(
                //https://www.anapioficeandfire.com/api/book?name=A Game of Thrones
                `${endpoints.baseURL}${endpoints.books}?name=${bookName}`,
                'GET',
                null
            );
            //put result in array
            filteredBooks.push(c);
        }

        setBooks(filteredBooks[0]);
    }



    //function that reinitialize all the filters
    let resetFilters = () => {
        setBookName('');
    }

    //function to submit the search
    const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
        // Preventing the page from reloading
        event.preventDefault();
        filterBooks();
    }

    useEffect(() => {
        async function fetchData() {
            await getBooks();
        }


        fetchData();
    }, [])

    return (
        <div className="content_bg">
            <NavigationBar brand={brand} links={links}/>
            <div className="form_bg">
                <h1>Books</h1>
                <form onSubmit={submitForm}>
                    <div className="books_form">
                        <div className="books_filter">
                            <TextField id="filled-basic"
                                       color="error"
                                       label="Book's name"
                                       type="text"
                                       variant="filled"
                                       placeholder="A Game of Thrones"
                                       style={{width: '100%'}}
                                       onChange={(e) => setBookName(e.target.value)}/>
                        </div>
                        <div className="books_filter_buttons">
                            <Button variant="contained" type="submit" color="success"
                                    style={{width: '30%', marginRight: '50px'}}>Search</Button>
                            <Button variant="outlined" color="primary" onClick={resetFilters} style={{width: '30%'}}>Reset filters</Button>
                        </div>
                    </div>
                </form>
            </div>
            <div className="book_cards">
                <Grid container spacing={3}>
                    {books.map((b) => (
                            <Grid item xs={12} sm={4}>
                                <Card className="book_card">
                                    <CardActionArea onClick={() => seeDetails(b)}>
                                        <CardMedia
                                            component="img"
                                            height="400"
                                            image={book1}
                                            alt="book1"

                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {b.name}
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

    )
}
export default Books;
