
export const request = async (url: RequestInfo, method = 'GET', value = null) => {
    try {
        let body = null;

        if (value !== null)
            body = JSON.stringify(value);

        let response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }, body: body,
        });

        let data = await response.json();
        return data;

    } catch (e) {
        console.error(e);

    }
}

export const queryString = async function (queryString: string)  {
    let queries = queryString.split("/");
    let key = queries[queries.length - 1];
    return key;
}

export interface IBooks{
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

export interface ICharacters{
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

export interface IHouses {
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

export interface IUser {
    username: string;
    password: string;
    isConnected: boolean;
}

export const navigation = {
    brand: {name: 'Game Of Thrones Challenge', to: '/home'},
    links: [
        {name: 'Books', to: '/books'},
        {name: 'Characters', to: '/characters'},
        {name: 'Houses', to: '/houses'},
        {name: 'Logout', to: '/'},
    ]
};


