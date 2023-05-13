const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '##mjmafi66##',
    database: 'fifa1'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database!');
});

app.use(cors());
app.use(express.json());

// Define your API endpoints here
app.get('/teams', (req, res) => {
    const sql = 'SELECT * FROM teams';
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});
app.get('/leagues', (req, res) => {
    const sql = 'SELECT * FROM league';
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});
app.get('/ucl', (req, res) => {
    const sql = 'SELECT * FROM UCL ORDER BY Ranking ASC';
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});
app.get('/epl', (req, res) => {
    const sql = 'SELECT * FROM EPL ORDER BY Ranking ASC';
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});

app.get('/laliga', (req, res) => {
    const sql = 'SELECT * FROM LALIGA ORDER BY Ranking ASC';
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});

app.post('/teams', (req, res) => {
    const { id, name, league, wins, losses, draws } = req.body;
    const sql = `INSERT INTO teams (id, name, league, wins, losses, draws) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [id, name, league, wins, losses, draws];
    db.query(sql, values, (err, result) => {
        if (err) {
            throw err;
        }
        res.json({ message: 'Team added successfully', team: { id, name, league, wins, losses, draws } });
    });
});

app.delete('/teams/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM teams WHERE id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            throw err;
        }
        console.log(`Deleted team with id ${id}`);
        res.send(`Deleted team with id ${id}`);
    });
});

// app.get('/players', (req, res) => {
//     const sql = 'SELECT * FROM players';
//     db.query(sql, (err, result) => {
//         if (err) {
//             throw err;
//         }
//         res.json(result);
//     });
// });

app.get('/players', (req, res) => {
    const sql = 'SELECT players.id, players.name, players.image_url, players.position, players.age, teams.name AS team_name FROM players INNER JOIN teams ON players.team_id = teams.id';
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});
app.get('/matches', (req, res) => {
    const query = `SELECT DateTime, Home_Team, Away_Team, IFNULL(HT_Goals, '-') as HT_Goals, IFNULL(AT_Goals, '-') as AT_Goals, IFNULL(HT_Yc, '-') as HT_Yc, IFNULL(AT_Yc, '-') as AT_Yc, IFNULL(HT_Rc, '-') as HT_Rc, IFNULL(AT_Rc, '-') as AT_Rc, Match_Stage, League FROM Matches ORDER BY DateTime DESC;`;
    db.query(query, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
});



const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

