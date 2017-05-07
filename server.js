// Підключення бібліотек
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();
var mysql = require('mysql');

// Підключення бази даних
var db_config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mj_tasklist',
    //socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
};

// Щоб не вилітало підключення до БД (взяв зі StackOverflow)
var connection;
function handleDisconnect()
{
    connection = mysql.createConnection(db_config);

    connection.connect(function(err) {
        if(err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
    });

    connection.on('error', function(err) {
        console.log('db error', err);
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();

// Створення таблички taskList
var initDb = function ()
{
    connection.query('' +
        'CREATE TABLE IF NOT EXISTS taskList (' +
        'id int(10) unsigned NOT NULL AUTO_INCREMENT,' +
        'title varchar(50), ' +
        'status varchar(50), ' +
        'checked tinyint(1),' +
        'PRIMARY KEY(id) )',
        function (err) {
            if (err) throw err;
            console.log('CREATE TABLE IF NOT EXISTS taskList')
        });
};

initDb();

// Виклик якигось бібліотек ???
app.use(bodyParser.json());
app.use(cors());

//
// app.get('/', function (req, res) {
//     fs.readFile('index.html', 'utf8', function (err, data) {
//         if (err) throw err;
//         res.status(200).send(data);
//     });
// });
//
app.get('/get-tasks', function (req, res) {
    connection.query('SELECT * FROM taskList', function (err, rows) {
            if (err) throw err;
            console.log('get all task, length: ' + rows.length);
            res.status(200).send(rows);
        }
    );
});

app.post('/add-task', function (req, res) {
    connection.query('INSERT INTO taskList SET ?', req.body,
        function (err, result) {
            if (err) throw err;
            console.log('task added to database with id: ' + result.insertId);
        }
    );
    res.send(200);
});

app.post('/check-task', function (req, res) {
    connection.query('UPDATE taskList SET status = ?, checked = 1 WHERE id = ?',
        [req.body.status, req.body.id],
        function (err) {
            if (err) throw err;
            console.log('task update id: ' + req.body.id);
        }
    );
    res.send(200);
});

app.post('/uncheck-task', function (req, res) {
    connection.query('UPDATE taskList SET status = ?, checked = 0 WHERE id = ?',
        [req.body.status, req.body.id],
        function (err) {
            if (err) throw err;
            console.log('task update id: ' + req.body.id);
        }
    );
    res.send(200);
});

app.post('/edit-task', function (req, res) {
    connection.query('UPDATE taskList SET title = ? WHERE id = ?',
        [req.body.title, req.body.id],
        function (err) {
            if (err) throw err;
            console.log('task update id: ' + req.body.id);
        }
    );
    res.send(200);
});

app.post('/delete-task', function (req, res) {
    connection.query('DELETE FROM taskList WHERE id = ?', req.body.id, function (err) {
            if (err) throw err;
            console.log('task delete id: ' + req.body.id);
        }
    );
    res.send(200);
});

app.listen(8080, function (err) {
    if (err) throw err;
    console.log('Server start on port 8080!');
});