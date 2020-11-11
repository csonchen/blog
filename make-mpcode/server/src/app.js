const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('hello world'))

app.get('/api/customers', (req, res) => {
  const customers = [
    {id: 1, firstName: 'john', lastName: 'doe'},
    {id: 2, firstName: 'brad', lastName: 'Traversy'},
    {id: 3, firstName: 'sam', last: 'chen'}
  ]
  res.json(customers)
})

const port = 5000;
app.listen(port, () => console.log(`make mpcode service listen on port ${5000}`))