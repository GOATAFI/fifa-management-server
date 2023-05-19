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
app.get('/players',(req,res)=>{
    const sql = 'SELECT * FROM players ORDER BY Ranking ASC';
    db.query(sql, (err,result)=>{
        if(err){
            throw err;
        }
        res.json(result);
    })
})
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
app.delete('/matches/:match_id', (req, res) => {
    const match_id = req.params.match_id;
    const sql = 'DELETE FROM matches WHERE match_id = ?';
    db.query(sql, [match_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Failed to delete the match.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Match not found.' });
        }

        return res.sendStatus(200); // Return a success status code
    });
});
// app.put('/teams/:id', (req, res) => {
//     console.log('inside put');
//     const id = req.params.id;
//     const { name, league, wins, losses, draws } = req.body;
//     const sql = 'UPDATE teams SET name = ?, league = ?, wins = ?, losses = ?, draws = ? WHERE id = ?';
//     const values = [name, league, wins, losses, draws, id];
    
//     db.query(sql, values, (err, result) => {
//         if (err) {
//             throw err;
//         }
//         res.json({ message: 'Team updated successfully' });
//     });
// });


app.get('/teams/:teamName', (req, res) => {
    const name = req.params.teamName;
    const sql = `SELECT * FROM \`${name}\``; // Use backticks to escape the table name
    db.query(sql, (err, result) => {
      if (err) {
        throw err;
      }
      res.json(result);
    });
  });
  app.post('/teams/:teamName',(req,res)=>{
    console.log("inside vuvuvu");
    const name = req.params.teamName;
    const sql = `INSERT INTO ${name} (pname,age,nationality,Jersey_Num,position,salary,contract) VALUES (?,?,?,?,?,?,?)`

    db.query(sql, [ req.body.name, req.body.age, req.body.nationality, req.body.jersey, req.body.position, req.body.salary, req.body.contract], (err, result) => {
        if (err) {
          throw err;
        }
        res.json({ message: 'successful' });
      });
  })
//   app.get('/teams/:teamName/players', (req, res) => {
//     const teamName = req.params.teamName;
//     const searchTerm = req.query.searchTerm;
  
//     const sql = `SELECT * FROM players WHERE Team = ? AND (PName LIKE ? OR Position LIKE ? OR Age LIKE ? OR Nationality LIKE ? OR Jersey_Num LIKE ? OR Salary LIKE ? OR Contract LIKE ?)`;
//     const values = [teamName, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`];
  
//     db.query(sql, values, (err, result) => {
//       if (err) {
//         throw err;
//       }
//       res.json(result);
//     });
//   });
  
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
app.get('/managers', (req, res) => {
    const sql = `SELECT Mid,Name,Age,Nationality, IFNULL(Club,'-') as Club, IFNULL(Contract,'-') as Contract ,Salary FROM Managers`;
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});
// app.get('/managers', (req, res) => {
//     const sql = `SELECT * FROM managers`;
//     db.query(sql, (err, result) => {
//         if (err) {
//             throw err;
//         }
//         res.json(result);
//     });
// });
app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, result) => {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});

app.post('/users/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, result) => {
      if (err) {
        throw err;
      }
  
      if (result.length > 0) {
        res.json({ message: 'Login successful' });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    });
  });
  
  app.post('/users', (req, res) => {
    const { username, email, password } = req.body;
    const sql = 'INSERT INTO users (Username, Email, Password) VALUES (?, ?, ?)';
    db.query(sql, [username, email, password], (err, result) => {
      if (err) {
        throw err;
      }
      res.json({ message: 'Registration successful' });
    });
  });
  

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

