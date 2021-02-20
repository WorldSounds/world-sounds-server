let family = require('./family')
let name = require('./name')

// console.log(family, name)
let result = []

// family.map(item => {
//     name.map(item2 => {
//         if (item2.family.length > 0) {
            
//         } else {
//             const fam = item2.family[0]

//             if (result.length > 0) {
//                 let flagging = false

//                 for (let i = 0; i < result.length; i++) {
//                     if (result[i]._id === fam) {
//                         result[i].childern.push(item2.name)
//                     }
//                 }

//                 if (!flagging) {
//                     result.push({
//                         _id: fam,
//                         childern: [item2.name]
//                     })
//                 }
//             } else {
//                 result.push({
//                     _id: fam,
//                     childern: item2.name
//                 })
//             }
//         }
//     })
// })

family.map(famGenre => {
    name.map(genre => {
        genre.family.map(item => {
            let flagging1 = false

            if(item === famGenre) {
                flagging1 = true
            }

            if(flagging1) {
                let flagging2 = false

                if(result.length === 0) {
                    result.push({
                        id: item,
                        childern: [genre.name]
                    })
                } else {
                    for(let i=0; i < result.length; i++) {
                        if(result[i].id === item) {
                            flagging2 = true
                            result[i].childern.push(genre.name)
                            break
                        } 
                    }   

                    if(!flagging2) {
                        result.push({
                            id: item,
                            childern: [genre.name]
                        })
                    }
                }               
            }
        })
    })
})

// let num = 0

// for(let i=0; i < result.length; i++) {
//     num = num + result[i].childern.length
// }

// console.log(num)

