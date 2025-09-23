# SQL Basics: Creating and Querying Tables

## From Excel to SQL

So far, we worked with **Excel tables**. Databases work the same way, but instead of a spreadsheet, we use **SQL (Structured Query Language)**.

SQL allows us to:

- Define tables (structure of our data)  
- Insert new data  
- Query (search) existing data  
- Update or delete data  

### Creating a Table

In SQL, we can create the **Users** table like this:

```sql
CREATE TABLE Users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT UNIQUE,
    password TEXT NOT NULL
);
```

???+ defi "CREATE TABLE"

    `CREATE TABLE` defines a new table.  
    - `PRIMARY KEY` ensures uniqueness.  
    - `NOT NULL` means the column cannot be empty.  
    - `UNIQUE` means no two rows can have the same value.
    

---

## Inserting Data

To add a new user:

```sql
INSERT INTO Users (username, email, password)
VALUES ('anna', 'anna@example.com', 'secret123');
```

???+ tip

    Notice that we did not insert an `id`.  
    Most databases will automatically generate the `id` for us.


---

## Querying Data

To see all users in the database:

```sql
SELECT * FROM Users;
```

Result:

| id | username | email                                       | password  |
| -- | -------- | ------------------------------------------- | --------- |
| 1  | anna     | [anna@example.com](mailto:anna@example.com) | secret123 |

We can also **filter** data:

```sql
SELECT username, email
FROM Users
WHERE username = 'anna';
```

---

## Recap

* SQL defines and manipulates data in databases.
* We learned `CREATE TABLE`, `INSERT`, and `SELECT`.
* SQL queries look like simple sentences in English.

---

## Chore

1. Create a **Posts** table in SQL with the following columns:

   * `id` (primary key)
   * `user_id` (foreign key to Users)
   * `content`
   * `created_at`

2. Insert at least 3 posts for different users.

3. Write a query: “Show all posts made by user `anna`.”

---

