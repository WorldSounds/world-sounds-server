const axios = require('axios')

const access_token = 'BQCNKmcBRPgNLtRK-5qqqXrQxiGh1AzBNV1CgSxQ3pdliFYChu3f5ZzdpUFvRotYrZx04ZM5CDT28_Zqc26vHjz9-VSLn3FZsaHlL5fVx8oJwt6Wmh2QPs1nGOtg7qbNdiqWFVB2gX2F0S_BBfFNNn4LLrp978rkoE3i17ziIUzCkeWLvB0E5Y0f8e4Uo2OJtb9DdVjvCj8Ppm4CR1dpydf2NmQaoJ8HkwDfmplylK5F9W1GCBZ651SXDDIR87YMs8XM_9rUzmDe6Hv4GvJMuno1UNTptWEK3FpQMhTJolbk'

const seedURL = 'https://api.spotify.com/v1/recommendations?limit=10&market=ES&seed_genres=rock'
const userURL = 'https://api.spotify.com/v1/me'
const createPlaylistURL = `https://api.spotify.com/v1/users/`
const addItemPlaylistURL = 'https://api.spotify.com/v1/playlists/'

let tracks = []
let userID = null
let playlistID = null

// mendapatkan track berdasarkan 1 genre
axios.get(seedURL, {
    headers: {
        // "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`
    }
})
    .then(({ data }) => {
        data.tracks.map(track => {
            tracks.push({
                id: track.id,
                artists: track.artists,
                name: track.name,
                popularity: track.popularity,
                uri: track.uri
            })
        })
        console.log(tracks[0].artists)
        console.log(tracks)

        return axios.get(userURL, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            }
        })
    })
    .then(({ data }) => {
        userID = data.id
        console.log(userID)
        console.log(data)
        return axios({
            method: 'post',
            url: createPlaylistURL + `${userID}/playlists`,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            data: {
                "name": "Rock Ya!!",
                "description": "Top 10 Rock Songs",
                "public": false
            }
        })
    })
    .then(({ data }) => {
        playlistID = data.id
        console.log(playlistID)
        let inputURI = tracks[1].uri
        console.log(data, inputURI, '<<<<<<<<<<')
        return axios({
            method: 'post',
            url: addItemPlaylistURL + `${playlistID}/tracks?uris=${inputURI}`,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            data: {
                "uris": `${inputURI}`
            }
        })
    })
    .then(({ data }) => {
        console.log(data, '------------ error 403 --------------')
    })
    .catch(function (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        console.log(error.config);
    });

