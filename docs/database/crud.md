
# CRUD Operations: Insert, Update, Delete

## CRUD in Instagram

CRUD = **Create, Read, Update, Delete**.
These are the four basic operations in every database application.

* **Create**: a new user signs up
* **Read**: show all posts of a user
* **Update**: change a password or caption
* **Delete**: remove a post

---

## Updating Data

If Anna changes her email:

```sql
UPDATE Users
SET email = 'anna.new@example.com'
WHERE username = 'anna';
```

---

## Deleting Data

If Anna deletes her account:

```sql
DELETE FROM Users
WHERE username = 'anna';
```

???+ warning

    Be careful with `DELETE`.  
    Without a `WHERE` clause, the command removes **all rows** in the table.


---

## Practical Example

1. Insert a few users and posts into your database.
2. Update one of the posts by changing the caption.
3. Delete one user and see what happens to their posts.

???+ tip

    This is where **referential integrity** comes into play.  
    A database can be configured to either keep the posts (orphaned) or delete them automatically when the user is deleted (`ON DELETE CASCADE`).

---

## Recap

* CRUD operations are the backbone of applications like Instagram.
* `INSERT`, `SELECT`, `UPDATE`, `DELETE` let us manage data in the database.
* Referential integrity ensures consistent relationships between tables.

---

## Chore

1. Insert a new user called `bob`.
2. Insert 2 posts for `bob`.
3. Update one of Bob’s posts with a new caption.
4. Delete Bob’s account and decide: should his posts remain or be deleted?
