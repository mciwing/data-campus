# Tables, Keys, and Relationships

## Why Do We Need Relationships?

So far, we have two tables: **Users** and **Posts**.  
But how do we connect them? If Anna makes a post, how does the database know that *this post belongs to Anna*?

This is where **relationships** come in.

- One **user** can create many **posts** → *One-to-Many*  
- A **post** can have many **likes**, and a **user** can like many posts → *Many-to-Many*  
- One **user** can follow many other **users** → *Self-Relationship*

???+ info

    Relationships between tables are created using **keys**.  
    - A **Primary Key** uniquely identifies a row in a table.  
    - A **Foreign Key** connects a row in one table to a row in another table.

---

## Primary Keys

Every table should have a **Primary Key** – a unique value that identifies a record.

Examples:  
- `user.id` → uniquely identifies a user  
- `post.id` → uniquely identifies a post  

???+ defi "Primary Key"

    A column (or set of columns) that uniquely identifies each row in a table.  
    No duplicates, no empty values.

---

## Foreign Keys

Now we want to connect posts to users.  
In the **Posts** table we add a column called `user_id`. This value refers back to the `id` column in the **Users** table.

Example:

| post.id | user_id | content              |
|---------|---------|----------------------|
| 1       | 2       | "Hello, world!"      |
| 2       | 1       | "My first picture"   |
| 3       | 2       | "Coffee time ☕"     |

Here, `user_id=2` means this post belongs to the user with `id=2` in the Users table.

???+ defi "Foreign Key"

    A column in one table that points to a Primary Key in another table.  
    It creates the connection between two tables.

---

## Hands-on: Relationships in Instagram

Let’s extend our mini Instagram database:

- In the **Posts** table: add a column `user_id` (foreign key).  
- Fill it with values that point to existing users.  
- Think about: what happens if you delete a user? Should their posts remain or be deleted too?

???+ tip

    This is why databases enforce **referential integrity**:  
    You cannot have a post with a `user_id` that does not exist in the Users table.

---

## Recap

- Primary Keys uniquely identify rows in a table.  
- Foreign Keys create relationships between tables.  
- Relationships allow us to connect users to posts, likes, and followers.  
- We introduced the concepts of **One-to-Many**, **Many-to-Many**, and **Self-Relationships**.

---

## Chore

1. Add a **Likes** table in Excel. Columns:  
   - `id` (unique)  
   - `user_id` (who liked)  
   - `post_id` (which post was liked)  

2. Fill the table with at least 5 likes from different users.  

3. Question: How would you represent the *follower* relationship (who follows whom) as a table?
