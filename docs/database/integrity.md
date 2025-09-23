# Data Integrity and Constraints

## Why Do We Need Constraints?

Imagine Instagram without rules:  
- Two users could have the same username.  
- A post could exist without an author.  
- Likes could point to posts that don’t exist.  

Constraints are rules that keep the data **consistent and reliable**.

---

## Primary Key Constraint

Every table should have a **Primary Key** that uniquely identifies each row.

Example:

```sql
CREATE TABLE Users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT UNIQUE,
    password TEXT NOT NULL
);
```

Here, `id` is the **Primary Key**.

???+ defi "Primary Key"

    Ensures each row can be uniquely identified.  
    - Cannot be NULL.  
    - Must be unique.  


---

## Unique Constraint

We don’t want two users with the same username.

```sql
ALTER TABLE Users
ADD CONSTRAINT unique_username UNIQUE (username);
```

Now, if someone tries to insert another user with the same username, the database will reject it.

---

## Not Null Constraint

Some columns should never be empty.
Example: every post must have an author.

```sql
CREATE TABLE Posts (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    content TEXT,
    created_at TEXT
);
```

If we try to insert a post without a `user_id`, the database will raise an error.

---

## Foreign Key Constraint

Foreign Keys guarantee that relationships stay valid.
For example, a post’s `user_id` must exist in the **Users** table.

```sql
CREATE TABLE Posts (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    content TEXT,
    created_at TEXT,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);
```

???+ tip

    This prevents “orphaned” rows – e.g., a post pointing to a user that doesn’t exist.  


---

## Referential Actions

What should happen when a user is deleted?

```sql
FOREIGN KEY (user_id) REFERENCES Users(id)
    ON DELETE CASCADE
```

* **CASCADE**: delete all posts by that user.
* **SET NULL**: keep the post, but set `user_id` to NULL.
* **RESTRICT**: block deletion if posts exist.

---

## Recap

* Constraints enforce rules on data.
* `PRIMARY KEY`, `UNIQUE`, `NOT NULL`, `FOREIGN KEY` are most common.
* Referential actions define what happens on delete or update.
* Constraints protect the integrity of the database.

---

## Chore

1. Add a **Unique Constraint** on `email` in the Users table.
2. Add a **Not Null Constraint** on `content` in the Posts table.
3. Add a **Foreign Key Constraint** on `Likes.user_id` and `Likes.post_id`.
4. Test: Try inserting invalid data (duplicate email, post without content, like on a non-existent post). What happens?
