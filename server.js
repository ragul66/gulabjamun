const express = require('express');
const oracledb = require('oracledb');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // Import bcrypt
const app = express();
const path = require('path');

// Oracle DB Connection Configuration
const dbConfig = {
  user: 'system',
  password: 'manager',
  connectString: 'localhost:1521/XE',
};

async function connectToDatabase() {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    return connection;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function createUserTable(connection) {
  try {
    const query = `
      CREATE TABLE users (
        id NUMBER GENERATED BY DEFAULT ON NULL AS IDENTITY,
        full_name VARCHAR2(255),
        email VARCHAR2(255) UNIQUE,
        age NUMBER,
        password VARCHAR2(255),
        phone_number VARCHAR2(20)
      )
    `;
    await connection.execute(query);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/signup', async (req, res) => {
  try {
    const { fullName, email, age, password, phoneNumber } = req.body;

    const connection = await connectToDatabase();

    // Check if the email already exists
    const query = 'SELECT * FROM users WHERE email = :email';
    const result = await connection.execute(query, [email]);

    if (result.rows.length > 0) {
      await connection.close();
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user data using parameterized query
    const insertQuery = `
      INSERT INTO users (full_name, email, age, password, phone_number)
      VALUES (:fullName, :email, :age, :hashedPassword, :phoneNumber)
    `;

    const insertData = {
      fullName,
      email,
      age,
      hashedPassword,
      phoneNumber,
    };

    await connection.execute(insertQuery, insertData);
    await connection.commit();
    await connection.close();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const connection = await connectToDatabase();

    // Check if the email exists
    const query = 'SELECT * FROM users WHERE email = :email';
    const result = await connection.execute(query, [email]);

    if (result.rows.length === 0) {
      await connection.close();
      return res.status(400).json({ message: 'Email not found' });
    }

    // Retrieve the hashed password from the database
    const storedHashedPassword = result.rows[0].PASSWORD;

    // Compare hashed password with provided password using bcrypt
    const isPasswordMatch = await bcrypt.compare(password, storedHashedPassword);

    if (!isPasswordMatch) {
      await connection.close();
      return res.status(401).json({ message: 'Incorrect password' });
    }

    await connection.close();

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
