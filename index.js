import express from 'express';
import OracleNoSQL from 'oracle-nosqldb';
import dotenv from 'dotenv';

dotenv.config();

const {NoSQLClient, Region} = OracleNoSQL;

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

/*****************************************
 * Get the connection to the cloud service
 ****************************************/

/**
 * The NoSQLClient object is used to connect to the cloud service
 * @type {NoSQLClient} A NoSQLClient object
 */
let client = getConnection();

/**
 * Create and return an instance of a NoSQLCLient object.
 * @returns {NoSQLClient} A NoSQLClient object
 */
function getConnection() {
    return new NoSQLClient({
        region: Region.US_PHOENIX_1,
        compartment: process.env.OCI_COMPARTMENT,
        auth: {
            iam: {
                tenantId: process.env.OCI_TENANTID,
                userId: process.env.OCI_USERID,
                fingerprint: process.env.OCI_FINGERPRINT,
                privateKeyFile: process.env.OCI_PRIVATEKEYPATH,
            }
        }
    });
}

/*****************************************
 * Routes for the application
 ****************************************/

const TABLE_NAME = 'tasks';

/**
 * Get all the tasks in the table.
 */
app.get('/tasks', async (req, res) => {
    try {
        let result = await client.query(`SELECT * FROM ${TABLE_NAME}`);
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(`[GET /tasks] Error getting tasks: ${error.message}`);
        res.status(500).json({error: "Error getting tasks."});
    }
});

/**
 * Get all the completed tasks.
 */
app.get('/tasks/completed', async (req, res) => {
    try {
        let result = await client.query(`SELECT * FROM ${TABLE_NAME} WHERE completed = true`);
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(`[GET /tasks/completed] Error getting tasks: ${error.message}`);
        res.status(500).json({error: "Error getting tasks."});
    }
});

/**
 * Get all the incomplete tasks.
 */
app.get('/tasks/incomplete', async (req, res) => {
    try {
        let result = await client.query(`SELECT * FROM ${TABLE_NAME} WHERE completed = false`);
        res.status(200).json(result.rows);
    } catch (error) {
        console.log(`[GET /tasks/incomplete] Error getting tasks: ${error.message}`);
        res.status(500).json({error: "Error getting tasks."});
    }
});

/**
 * Get a single task by id
 */
app.get('/task/:id', async (req, res) => {
    try {
        let result = await client.query(`SELECT * FROM ${TABLE_NAME} WHERE id = ${req.params.id}`);
        res.json(result.rows);
    } catch (error) {
        console.log(`[GET /task/:id] Error getting task: ${error.message}`);
        res.status(500).json({error: "Error getting task."});
    }
});

/**
 * Create a new task
 */
app.post('/task', async (req, res) => {
    try {
        let {id, title, description, completed} = req.body;

        // Check if the id is provided
        if (!id) {
            res.status(400).json({error: "You must provide an id."});
            return;
        }

        // Check if the completed field is provided
        if (completed === undefined) {
            completed = false;
        }

        // Create the task
        const result = await client.putIfAbsent(
            TABLE_NAME,
            {
                id,
                title,
                description,
                completed
            },
            {
                returnExisting: true
            }
        );

        // Return the result
        if (result.success) {
            res.status(200).json({result: "Task created."});
        } else {
            res.status(400).json({error: "Task already exists."});
        }
    } catch (error) {
        console.log(`[POST /task] Error creating task: ${error.message}`);
        res.status(500).json({error: "Error creating task."});
    }
});

/**
 * Update a task
 */
app.put('/task/:id', async (req, res) => {
    try {
        let {title, description, completed} = req.body;

        // Update the task
        const result = await client.put(TABLE_NAME, {
            id: req.params.id,
            title,
            description,
            completed
        });

        // Return the result
        if(!result.success)
            res.status(200).json({result: "Task updated."});
        else
            res.status(400).json({error: "Task does not exist."});
    } catch (error) {
        console.log(`[PUT /task/:id] Error updating task: ${error.message}`);
        res.status(500).json({error: "Error updating task."});
    }
});

/**
 * Delete a task
 */
app.delete('/task/:id', async (req, res) => {
    try {
        // Delete the task
        const result = await client.delete(TABLE_NAME, req.params.id);

        // Return the result
        if(!result.success)
            res.status(200).json({result: "Task deleted."});
        else
            res.status(400).json({error: "Task does not exist."});
    } catch (error) {
        console.log(`[DELETE /task/:id] Error deleting task: ${error.message}`);
        res.status(500).json({error: "Error deleting task."});
    }
});

/*****************************************
 * Start the application
 ****************************************/

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
