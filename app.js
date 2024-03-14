const express = require('express')
const app = express()

const fs = require('fs')

app.set('view engine', 'pug')
app.use('/static', express.static('public'))
app.use(express.urlencoded({ extended: false}))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/create', (req, res) => {
    res.render('create')
})

app.post('/create', (req, res) => {
    const title = req.body.title
    const description = req.body.description

    if(title.trim() === '' && description.trim() === '') {
        res.render('create', { error: true })
    } 
    else {
        fs.readFile('./data/event.json', (err, data) =>{
            if (err) throw err

            const event = JSON.parse(data)

            event.push({
                id: id (),
                title:title,
                description: description,
            })

            fs.writeFile('./data/event.json', JSON.stringify(event), err => {
                if (err) throw err

                res.render('create', { success:true })
            })
        })
    }

    
})



app.get('/event', (req, res)=>{

    fs.readFile('./data/event.json', (err, data) => {
        if (err) throw err

        const events = JSON.parse(data)
        res.render('event', { events: events})
    })
    
})


app.get('/archive', (req, res)=>{

    fs.readFile('./data/event.json', (err, data) => {
        if (err) throw err

        const events = JSON.parse(data)
        res.render('archive', { events: events})
    })
    
})

app.get('/event/:id', (req, res) => {
    const id = req.params.id
    fs.readFile('./data/event.json', (err, data) => {
        if (err) throw err

        const events = JSON.parse(data)
        const event = events.filter(event => event.id == id)[0]

        res.render('detail', { event: event })
    })
    
})

app.get('/event/:id/delete', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/event.json', (err, data) => {
        if (err) throw err

        const events = JSON.parse(data)
        const event = events.filter(event => event.id != id)

        fs.writeFile('./data/event.json', JSON.stringify(event), (err) => {
            if (err) throw err

            res.render('event', {events: event, deleted: true })
        })

        
    })
})

app.get('/api1/v1/event', (req, res) => {
    fs.readFile('./data/event.json', (err, data) => {
        if (err) throw err

        const events = JSON.parse(data)

        res.json(events)
    })
    
})

app.listen(5050, err => {
    if (err) console.log(err)
    console.log('Server is running')
})

function id () {
    return '_' + Math.random().toString(36).substr(2, 9);
}