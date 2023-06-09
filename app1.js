const express = require('express');
const app = express();
const mysql = require('mysql');

app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'FormY2'
});

connection.connect();

app.get('/', (req, res) => {
  res.send(`
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">

    <form action="/submit-form" method="POST">
      <label for="name">Name:</label>
      <input type="text" id="name" name="name"><br><br>
      <label for="email">Email:</label>
      <input type="email" id="email" name="email"><br><br>
      <label for="age">Age:</label>
      <input type="number" id="age" name="age"><br><br>
      <label for="address">Address:</label>
      <input type="text" id="address" name="address"><br><br>
      <label for="gender">Gender:</label>
      <select id="gender" name="gender">
        <option value="">--Please choose an option--</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select><br><br>
      <input type="submit" value="Submit">
    </form><style>form {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      
      label {
        font-weight: bold;
      }
      
      input[type="text"],
      input[type="email"],
      input[type="number"],
      select {
        width: 200px;
        padding: 5px;
        margin-bottom: 10px;
      }
      
      input[type="submit"] {
        width: 100px;
        padding: 5px;
      }
      
      body {
        font-family: 'Comic Sans MS', cursive, sans-serif;
      }
      </style>
  `);
});
app.post('/submit-form', (req, res) => {
  const { name, email, age, address, gender } = req.body;
  const query = 'INSERT INTO FormY2 (name, email, age, address, gender) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [name, email, age, address, gender], (error, results) => {
    if (error) throw error;
    res.redirect('/data');
  });
});

app.get('/data', (req, res) => {
  const query = 'SELECT * FROM FormY2';
  connection.query(query, (error, results) => {
    if (error) throw error;
    let html = '<!DOCTYPE html><html><head>';
    html += '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">';
    html += '</head><body>';
    html += '<table class="table">';
    html += '<tr><th>ID</th><th>Name</th><th>Email</th><th>Age</th><th>Address</th><th>Gender</th><th>Edit</th><th>Delete</th></tr>';
    results.forEach(row => {
      html += `<tr><td>${row.id}</td><td>${row.name}</td><td>${row.email}</td><td>${row.age}</td><td>${row.address}</td><td>${row.gender}</td>`;
      html += `<td><button class="btn btn-primary" onclick="location.href='/edit/${row.id}'">Edit</button></td>`;
      html += `<td><button class="btn btn-danger" onclick="location.href='/delete/${row.id}'">Delete</button></td></tr>`;
    });
    html += '</table></body></html>';
    res.send(html);
  });
});

app.get('/edit/:id', (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM FormY2 WHERE id=?';
  connection.query(query, [id], (error, result) => {
    if (error) throw error;
    let row = result[0];
    let html = '<!DOCTYPE html><html><head>';
    html += '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">';
    html += '</head><body>';
    html += `<form action="/update/${id}" method="POST" class="form-group container">`;
    html += `<label for="name">Name:</label>`;
    html += `<input type="text" id="name" name="name" value="${row.name}" class="form-control"><br>`;
    html += `<label for="email">Email:</label>`;
    html += `<input type="email" id="email" name="email" value="${row.email}" class="form-control"><br>`;
    html += `<label for="age">Age:</label>`;
    html += `<input type="number" id="age" name="age" value="${row.age}" class="form-control"><br>`;
    html += `<label for="address">Address:</label>`;
    html += `<input type="text" id="address" name="address" value="${row.address}" class="form-control"><br>`;
    html += `<label for="gender">Gender:</label>`;
    html += `<select id="gender" name="gender" class="form-control">`;
    html += `<option value="">--Please choose an option--</option>`;
    html += `<option value="male"${row.gender==='male'?' selected':''}>Male</option>`;
    html += `<option value="female"${row.gender==='female'?' selected':''}>Female</option>`;
    html += `<option value="other"${row.gender==='other'?' selected':''}>Other</option>`;
    html += `</select><br>`;
    html += `<input type="submit" value="Submit" class="btn btn-primary">`;
    html += `</form></body></html>`;
   
    res.send(html);
  });
});


app.post('/update/:id', (req, res) => {
  const id = req.params.id;
  const { name, email, age, address, gender } = req.body;
  const query = 'UPDATE FormY2 SET name = ?, email = ?, age = ?, address = ?, gender = ? WHERE id = ?';
  connection.query(query, [name, email, age, address, gender, id], (error, results) => {
    if (error) throw error;
    res.redirect('/data');
  });
});

app.get('/delete/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM FormY2 WHERE id = ?';
  connection.query(query, [id], (error, results) => {
    if (error) throw error;
    res.redirect('/data');
  });
});


app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
