const axios = require('axios')

const access_token = 'BQBcR3sUV2Q9MeQWj4pEoZNy8LbBXEgOLnm00zjasV9bEOtcq4OQO33ajYYms-4Fgdikuv0i38gDMgSp8ov9YOmS1e_in0Kppt2sglRxDhh2lLEOwiILDi0FCka1tCwt1-UUHTu7Nvu0WjwW1kIuu4HobgmOJ9sXGWmcNl5zlonxWiDn9XLoWzq87rAssAqi2r6SrG2Mcw4oEwDj0s6TCdoQ6kgwU3H6lrKq16QRUsy1vWftlXdJvw8RYJYd_iqEU4NlpT68D3wPrZvMxCClRMEIuC9OaRKt-wK9_lLg3I2M'

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
        "Accept": "application/json",
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

        // console.log(tracks)

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
        // console.log(userID)

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
        // console.log(playlistID)
        let inputURI = encodeURIComponent(tracks[1].uri)

        return axios({
            method: 'post',
            url: addItemPlaylistURL + `${playlistID}/tracks?position=1&uris=${inputURI}`,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            data: {
                "uris": [`${inputURI}`],
                "position": 1
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

