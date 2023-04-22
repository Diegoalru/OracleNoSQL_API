# Oracle NoSQL Database API with Express

This is a sample project that demonstrates how to use the Oracle NoSQL Database API with Express.

## Setup

To run this project, you need to have an Oracle NoSQL cloud account. You can get started by signing up for a free account at the [Oracle Cloud website](https://cloud.oracle.com/home).

**Important:** Although there is a way to create NoSQL tables from code, if you are using the free tier, you will need to create the table manually. You can do this by following the instructions in the [Oracle NoSQL Database documentation](https://docs.oracle.com/en/database/other-databases/nosql-database/22.3/java-driver-table/defining-tables.html).    

You also need to have the following environment variables set:

```dotenv
PORT=3000
OCI_COMPARTMENT='<your compartment ID>'
OCI_TENANTID='<your tenant ID>'
OCI_USERID='<your user ID>'
OCI_FINGERPRINT='<your API key fingerprint>'
OCI_PRIVATEKEYPATH='<path to your API private key file>'
```

## Dependencies
This project uses the following dependencies:

- Express.js
- Body-parser
- dotenv
- [Oracle NoSQL](https://www.npmjs.com/package/oracle-nosqldb)

## Usage
To run the project, execute the following commands:

```bash
npm install
npm start
```

_The server will start on port **3000** by default. You can change the port by setting the PORT environment variable._

## Routes
This project defines the following routes:

`GET /tasks`
Get all the tasks in the table.

`GET /tasks/completed`
Get all the completed tasks.

`GET /tasks/incomplete`
Get all the incomplete tasks.

`GET /task/:id`
Get a single task by ID.

`POST /task`
Create a new task.

`PUT /task/:id`
Update a task.

`DELETE /task/:id`
Delete a task.

# Note
The code above assumes that the necessary packages have been installed and the required environment variables have been set. It also assumes that there is a table named `tasks` that has the columns `id`, `title`, `description`, and `completed`.