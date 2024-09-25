const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as arguemnt')
    process.exit(1)
}

const password = process.argv[2]

const url = 
`mongodb+srv://lwyers2:${password}@cluster0.9u16o.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note = new Note({
    content: 'HTML is easy',
    important: true
})


Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})


// note.save().then(result => {
//     console.log('note saved!')
//     mongoose.connection.close()
// })