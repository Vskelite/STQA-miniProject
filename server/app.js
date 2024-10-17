const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

// Initialize SQLite Database
const db = new sqlite3.Database('./database/todo.db', (err) => {
    if (err) {
        console.error("Error opening database " + err.message);
    } else {
        db.run('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, task TEXT, done INTEGER)', (err) => {
            if (err) {
                console.error("Error creating table " + err.message);
            }
        });
    }
});

// Get all tasks
app.get('/tasks', (req, res) => {
    db.all('SELECT * FROM tasks', (err, rows) => {
        if (err) {
            res.status(400).send(err.message);
        } else {
            res.json(rows);
        }
    });
});

// Add new task
app.post('/tasks', (req, res) => {
    const { task } = req.body;
    db.run('INSERT INTO tasks (task, done) VALUES (?, 0)', [task], function (err) {
        if (err) {
            res.status(400).send(err.message);
        } else {
            res.json({ id: this.lastID, task, done: 0 });
        }
    });
});

// Update task (mark as done/undone)
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { done } = req.body;
    db.run('UPDATE tasks SET done = ? WHERE id = ?', [done, id], function (err) {
        if (err) {
            res.status(400).send(err.message);
        } else {
            res.json({ id, done });
        }
    });
});

// Delete task
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM tasks WHERE id = ?', [id], function (err) {
        if (err) {
            res.status(400).send(err.message);
        } else {
            res.json({ message: "Task deleted successfully", id });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
