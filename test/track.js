const axios = require('axios')
const input = 'bruno mars'

let name = ''

if(input.includes(' ')) {
    let splitted = input.split(' ')

    for(let i=0; i < splitted.length - 1; i++) {
        name = name + `${splitted[i]}%20`
    }

    name = name + splitted[splitted.length - 1]
} else {
    name = input
}

const url = `https://api.spotify.com/v1/search?q=${name}&type=artist`
const access_token = 'BQDLtTucURXNcIzThk_ptZLyjy3BCryn3wpoHO3HqnoVRDqXFNLZZKuaYtT5R3RnlS4Sptwyj82ffae0IVS-bwV4DFIcPFV3xuPmJRsJsNHqPo5MyKozmsCBnMOxd0Xz99H2g_qMlBhYI457Uxxk1iAmk_UxGahW4NrnWsLO9g6PiRbxCJR3OuVtVQuPtf7yHd9NRrCJSOw2CjzVy_VdTY6KNQIfNkikswJQQnElPsM8CGRsQM6vK-ilv7yYVtRw2MrzEjzfRG9BIvhB09XnI8sa2OGlzRVk2wberXyQjWhi'

axios.get(url, {
    headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`
    }
})
    .then(({ data }) => console.log(data.artists.items))
    .catch(err => console.log(err))