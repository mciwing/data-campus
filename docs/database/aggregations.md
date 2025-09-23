# Aggregations and GROUP BY

## Why Do We Need Aggregations?

Sometimes we don’t just want raw data, but **summaries**:  

- How many posts does each user have?  
- Which post got the most likes?  
- Who has the most followers?  

This is where **aggregation functions** and `GROUP BY` come into play.

---

## COUNT

`COUNT` counts the number of rows.  
Example: number of posts in the database:

```sql
SELECT COUNT(*) AS total_posts
FROM Posts;
```

Result:

| total\_posts |
| ------------ |
| 12           |

---

## GROUP BY

To count posts **per user**:

```sql
SELECT Users.username, COUNT(Posts.id) AS num_posts
FROM Users
LEFT JOIN Posts ON Users.id = Posts.user_id
GROUP BY Users.username;
```

Result:

| username | num\_posts |
| -------- | ---------- |
| anna     | 3          |
| bob      | 2          |
| claire   | 0          |

???+ defi "GROUP BY"

    Groups rows that have the same value in a column, so that aggregate 
    functions (`COUNT`, `SUM`, `AVG`, etc.) can be applied to each group.

---

## MAX and MIN

Which post got the most likes?

```sql
SELECT Posts.content, COUNT(Likes.id) AS num_likes
FROM Posts
LEFT JOIN Likes ON Posts.id = Likes.post_id
GROUP BY Posts.content
ORDER BY num_likes DESC
LIMIT 1;
```

Result:

| content       | num\_likes |
| ------------- | ---------- |
| Coffee time ☕ | 7          |

---

## AVG and SUM

Example: average number of likes per post:

```sql
SELECT AVG(like_counts.num_likes) AS avg_likes
FROM (
    SELECT COUNT(Likes.id) AS num_likes
    FROM Posts
    LEFT JOIN Likes ON Posts.id = Likes.post_id
    GROUP BY Posts.id
) AS like_counts;
```

---

## Recap

* Aggregations let us summarize data.
* `COUNT`, `MAX`, `MIN`, `AVG`, `SUM` are the most common functions.
* `GROUP BY` groups rows so we can calculate aggregates per group.
* Real Instagram-style questions (top post, most active user, etc.) require aggregations.

---

## Chore

1. Count how many users are in your database.
2. Count how many posts each user has.
3. Find out which post has the most likes.
4. Bonus: Find out who is the most active liker (which user has liked the most posts).
