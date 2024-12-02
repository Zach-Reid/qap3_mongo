const express = require('express');
const { Client } = require('pg'); // PostgreSQL client
const app = express();
const PORT = 3000;

app.use(express.json());

// Connection for PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost', 
    database: 'postgres',
    password: 'pass1',
    port: 5432, 
  });

client.connect();

// Create the tasks table if there isn't one
const createTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS tasks (
            id SERIAL PRIMARY KEY,
            description TEXT NOT NULL,
            status TEXT NOT NULL
        );
    `;
    await client.query(query);
};

createTable();

// GET /tasks - Get all tasks
app.get('/tasks', async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM tasks');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
});

// POST /tasks - Add a new task
app.post('/tasks', async (req, res) => {
    const { description, status } = req.body;
    if (!description || !status) {
        return res.status(400).json({ error: 'Description and status are required' });
    }

    try {
        const result = await client.query(
            'INSERT INTO tasks (description, status) VALUES ($1, $2) RETURNING id',
            [description, status]
        );
        res.status(201).json({ message: 'Task added successfully', taskId: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ error: 'Failed to add task' });
    }
});

// PUT /tasks/:id - Update the status of a task
app.put('/tasks/:id', async (req, res) => {
    const taskId = parseInt(req.params.id, 10);
    const { status } = req.body;

    try {
        const result = await client.query(
            'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
            [status, taskId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ message: 'Task updated successfully', task: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', async (req, res) => {
    const taskId = parseInt(req.params.id, 10);

    try {
        const result = await client.query(
            'DELETE FROM tasks WHERE id = $1 RETURNING *',
            [taskId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



