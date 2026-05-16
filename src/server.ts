import express, { type Request, type Response } from "express";
import { Pool } from "pg";
import config from "./config";

const app = express();
const port = config.port;

app.use(express.json());

const pool = new Pool({
  connectionString: config.connection_string,
});

app.get("/", (req: Request, res: Response) => {
  //   res.send('Hello World!')
  res.status(200).json({
    message: "Hello World!",
  });
});

const initDB = async () => {
  try {
    await pool.query(`
             CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(20), 
                email VARCHAR(20) NOT NULL UNIQUE,
                password VARCHAR(20) NOT NULL,
                is_active BOOLEAN DEFAULT true,
                age INT,

                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
                )
            `);
    console.log("Database initialized successfully");
  } catch (error) {}
};

initDB();

//===========================================================
app.post("/user", async (req: Request, res: Response) => {
  const { name, email, age, password } = req.body;

  try {
    const result = await pool.query(
      `
     INSERT INTO users (name,email,age,password) 
     VALUES ($1, $2, $3, $4) 
     RETURNING *
  `,
      [name, email, age, password],
    );

    if (result.rowCount === 0) {
      return res.status(400).json({
        message: "Failed to create user",
      });
    }

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result.rows[0],
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
      error: error,
    });
  }
});

// =====================================================
app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT * FROM users
      `);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Users not found",
        data: {},
      });
    }

    res.status(200).json({
      success: true,
      message: "Users retrived successfully",
      data: result.rows[0],
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
      error: error,
    });
  }
});

//=============================================================
app.get("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT * FROM users
      WHERE id = $1
      `,
      [id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found!",
        data: {},
      });
    }

    res.status(200).json({
      success: true,
      message: "User retrived successfully",
      data: result.rows[0],
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
      error: error,
    });
  }
});

//======================================================================
app.put("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, password, age, is_active } = req.body;

  try {
    const result = await pool.query(
      `
      UPDATE users
      SET 
      name = COALESCE($1, name),
      password = COALESCE($1, password),
      age = COALESCE($1, age),
      is_active = COALESCE($1, is_active),

      WHERE id = $6
      RETURNING *
      `,
      [name, password, age, is_active, id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
      error: error,
    });
  }
});

//==================================================================
app.delete("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
      DELETE FROM users
      WHERE id = $1
      `,
      [id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: {}, 
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal Server Error",
      error: error,
    });
  }
});


// =============================================================
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
