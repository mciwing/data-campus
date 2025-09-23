# Joins: Combining Data from Multiple Tables

## Why Do We Need Joins?

So far, we queried single tables.  
But Instagram is more complex:  

- Posts belong to users  
- Likes connect users and posts  
- Comments are written by users under posts  

To answer real questions like *“Which user wrote this post?”* we need to combine data from multiple tables. This is done using **Joins**.

---

## Inner Join

An **Inner Join** returns rows that have matching values in both tables.  
Example: show each post with its author’s username.

```sql
SELECT Users.username, Posts.content
FROM Posts
INNER JOIN Users ON Posts.user_id = Users.id;
```

Result:

| username | content       |
| -------- | ------------- |
| anna     | Hello, world! |
| bob      | Coffee time ☕ |

???+ defi "Inner Join"

    Returns only rows where there is a match in both tables.  
    If a user has no posts, they will not appear in the result.


---

## Left Join

A **Left Join** returns all rows from the left table, and matching rows from the right table.
Example: show all users and their posts (even if they have none).

```sql
SELECT Users.username, Posts.content
FROM Users
LEFT JOIN Posts ON Users.id = Posts.user_id;
```

Result:

| username | content       |
| -------- | ------------- |
| anna     | Hello, world! |
| bob      | NULL          |

Here, `bob` shows up even without posts.

???+ tip

    Use **LEFT JOIN** when you want to see all rows from one table, even if no match exists in the other.

---

## Many-to-Many with Joins

Likes are a **Many-to-Many** relationship:

* A user can like many posts
* A post can be liked by many users

To answer *“Who liked which post?”* we need three tables: **Users**, **Posts**, and **Likes**.

```sql
SELECT Users.username, Posts.content
FROM Likes
INNER JOIN Users ON Likes.user_id = Users.id
INNER JOIN Posts ON Likes.post_id = Posts.id;
```

Result:

| username | content       |
| -------- | ------------- |
| anna     | Coffee time ☕ |
| bob      | Hello, world! |

---

## Recap

* **Joins** combine rows from multiple tables.
* **Inner Join** → only matching rows.
* **Left Join** → all from left, plus matches from right.
* Many-to-Many (Likes, Followers) require joining more than two tables.

---

## Chore

1. Write a query that shows all posts with their authors.
2. Write a query that shows all users and the posts they have written (even if none).
3. Write a query that lists each post and all users who liked it.
4. Bonus: Design a **Followers** table and write a query: *“Who follows Anna?”*
