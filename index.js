const { json, response } = require('express');
const express = require('express');
const app = express();
const Moment = require('moment');
app.use(express.json())
const morgan = require('morgan');
// app.use(morgan('tiny'))
//3.7: Phonebook backend step7. Add the morgan middleware to your application for logging. Configure it to log messages to your console based on the tiny configuration.
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :newInput'))
//3.1: Phonebook backend step1
//Implement a Node application that returns a hardcoded list of phonebook entries from the address
let data = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(JSON.stringify(data))
})

//3.2: Phonebook backend step2
//Phonebook has info for 2 people
//Sat Jan 22 2022 22:27:20 GMT+0200 (Eastern European Standard Time)


app.get('/info', (request, response) => {
    const peopleNumber = data.length;
    const a = new Date();
    response.send(`Phonebook has info for ${peopleNumber} people <br/> ${a}`);
})
 
//3.3: Phonebook backend step3. Implement the functionality for displaying the information for a single phonebook entry.

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const id5 = data.find(data => data.id == id)
    if (id5 != undefined) {
        response.json(id5)
      } else {
        response.end('Error')
      }
})

//3.4: Phonebook backend step4. Implement functionality that makes it possible to delete a single phonebook entry by making an HTTP DELETE request to the unique URL of that phonebook entry.
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    data = data.filter(person => person.id !== id)
    response.status(204).end()
})

//3.5: Phonebook backend step5. Expand the backend so that new phonebook entries can be added by making HTTP POST requests to the address http://localhost:3001/api/persons.
app.post('/api/persons', (request, response) => {
    //Generate a new id for the phonebook entry with the Math.random function. Use a big enough range for your random values so that the likelihood of creating duplicate ids is small.  
    function getRandomId(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min) + min);
    }
    let randomId = getRandomId(data.length, (data.length+200));
    const body = request.body;
    console.log(request);
    
    const newPerson = {
        id: randomId,
        name: body.name,
        number: body.number,
    }
//3.6: Phonebook backend step6. Implement error handling for creating new entries. The request is not allowed to succeed, if: (1) The name or number is missing; (2) The name already exists in the phonebook
    if (data.find(c => c.name === body.name)) {
        return response.status(400).json({
            error: 'Invalid name. The name already exists.'
    })}
    
    if (!body.name){
        return response.status(400).json({
            error: 'Invalid input. Missing name.'
    })} 
    
    if (!body.number){
        return response.status(400).json({
            error: 'Invalid input. Missing number.'
    })}

    
    data = data.concat(newPerson);
    response.send(newPerson);
});
  
//3.8*: Phonebook backend step8. Configure morgan so that it also shows the data sent in HTTP POST requests.
morgan.token('newInput', function (req, res) { 
    if (req.method === 'POST') {
        return JSON.stringify(req.body);
    }
    return null;
});
app.use(morgan(':method :url :status :newPeople'));
console.log


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})