const data = require('../seeders/raw.json')

let result = []

data.map(item => {
    let object = {
        name: item.name,
        popularity: item.pop,
        family: item.family
    }

    result.push(object)
})

console.log(result)
module.exports = result