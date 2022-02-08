import React, {useEffect, useState} from 'react';
import endpoints from "../../utils/endpoints.json";
import request from "../../utils/request";
import Button from "@material-ui/core/Button";
import {useNavigate, useParams} from "react-router-dom";
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Grid,
    Input,
    Paper,
    styled, TextField,
    Typography
} from "@material-ui/core";
import book1 from "../../images/books/book1.jpg";
import {Item} from "framer-motion/types/components/Reorder/Item";


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

const defaultBooks: IBooks[] = [];


const Books = () => {

    const [books, setBooks]: [IBooks[], (resources: IBooks[]) => void] = useState(defaultBooks);
    const [allBooks, setAllBooks]: [IBooks[], (resources: IBooks[]) => void] = useState(defaultBooks);
    const [loading, setLoading]: [boolean, (loading: boolean) => void] = React.useState<boolean>(true);
    const [error, setError]: [string, (error: string) => void] = React.useState('');

    const [term, setTerm] = useState('');
    const [year, setYear] = useState('');

    let getBooks = async () => {
        let b = await request(
            `${endpoints.baseURL}${endpoints.books}?pageSize=20`,
            'GET',
            null
        );

        if (b && b.length > 0) {
            setBooks(b);
            setAllBooks(b);
        }

    }

    let {bookId} = useParams();
    let navigate = useNavigate();

    //function that get book's id from the url
    let parseQueryString = (queryString: string): any => {
        let queries = queryString.split("/");
        let key = queries[queries.length - 1];
        return key;
    }

    let seeDetails = (book: IBooks) => {
        bookId = parseQueryString(book.url);
        navigate(`./${bookId}`, {state: book});

    }


    useEffect(() => {
        async function fetchData() {
            await getBooks();
        }

        fetchData();
    }, [])

    let filterBooks = () => {
        let filteredBooks = [];
        if (term !== undefined) {
            filteredBooks.push(allBooks.filter(h => String(h.name.toLowerCase()).includes(term.toLowerCase())));
        }
        if (year !== '') {
            filteredBooks.push(allBooks.filter(h => Number(h.released) === Number(year)));
        }

        console.log(filteredBooks[0]);

        setBooks(filteredBooks[0]);
    }

    let resetFilters = () => {
        window.location.reload();
    }


    const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
        // Preventing the page from reloading
        event.preventDefault();
        filterBooks();


    }



    return (
        <div>
            <h1>Books</h1>
            <form onSubmit={submitForm}>
                <div className="books_form">
                    <div className="books_filter">
                        <TextField id="filled-basic"
                                   label="Released date"
                                   type="number"
                                   variant="filled"
                                   placeholder="2000"
                                   style={{width:'45%'}}
                                   onChange={(e) => setYear(e.target.value)}/>
                        <TextField id="filled-basic"
                                   label="Book's name"
                                   type="text"
                                   variant="filled"
                                   placeholder="A Game of Thrones"
                                   style={{width:'45%'}}
                                   onChange={(e) => setTerm(e.target.value)}/>
                    </div>
                    <div className="books_filter_buttons">
                        <Button variant="contained" type="submit" style={{width:'30%', marginRight: '50px'}}>Search</Button>
                        <Button variant="outlined" onClick={resetFilters} style={{width:'30%'}}>Reset filters</Button>
                    </div>
                </div>
            </form>
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
