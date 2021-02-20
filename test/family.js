const data = require('../seeders/raw.json')

let raw = []

data.map(item => {
    let fam = item.family

    if (fam.length > 1) {
        fam.map(item2 => {
            raw.push(item2)
        })
    } else {
        raw.push(fam[0])
    }
})

let result = []

raw.map(family => {
    if (result.length === 0) {
        result.push(family)
    } else {
        let flagging = false

        for (let i = 0; i < result.length; i++) {
            if (result[i] === family) {
                flagging = true
            }
        }

        if(flagging === false) {
            result.push(family)
        }
    }
})

console.log(result)