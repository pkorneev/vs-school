# vs-school Backend

This is the backend server for the **vs-school** platform. It’s built with **Node.js**, **Express**, and **PostgreSQL** using **TypeORM**.

---

## Requirements

- [Node.js](https://nodejs.org/) and **npm** must be installed

### Install Node.js:

- **macOS** (Homebrew):

  ```bash
  brew install node
  ```

- **Ubuntu/Debian**:

  ```bash
  sudo apt install nodejs npm
  ```

- **Windows**:  
  Download from [https://nodejs.org/](https://nodejs.org/)

---

## 🛠 Database Setup

You need to have **PostgreSQL** installed and running locally.

1. Create a PostgreSQL database named:

   ```sql
   CREATE DATABASE vsschool;
   ```

2. Make sure your PostgreSQL user credentials match the following (or update them in the code):

   - **Username**: `postgres`  
   - **Password**: `postgress`

   These settings are configured in the `src/index.ts`:

   ```ts
   const AppDataSource = new DataSource({
     type: "postgres",
     host: "localhost",
     database: "vsschool",
     username: "postgres",
     password: "postgress",
     entities: [join(__dirname, "./entities/*.*")],
     logging: !__prod__,
     synchronize: !__prod__,
   });
   ```

---

##  Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Compile TypeScript:

   ```bash
   npm run watch
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

---

##  Load Sample Data (Optional)

To populate the database with test data, run the following script after the server is running:

```bash
ts-node src/sec/setInitialDataScript.ts
```

This will insert sample data into your local database for testing purposes.

---

## Scripts Reference

- `npm run watch` — watch and compile TypeScript files
- `npm run dev` — run the development server with `nodemon`

---


