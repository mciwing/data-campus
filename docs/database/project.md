# Final Project: Build Your Own Mini-Instagram Database

## Goal

Apply everything you have learned in Units 1–8 by designing and implementing 
a small Instagram-like database system.  
You will define tables, insert data, and write queries to answer real questions.

---

## Step 1: Database Design

1. Create the following tables:
   - **Users**  
     - `id` (primary key)  
     - `username` (unique, not null)  
     - `email` (unique)  
     - `password` (not null)  
   - **Posts**  
     - `id` (primary key)  
     - `user_id` (foreign key to Users)  
     - `content` (not null)  
     - `created_at` (timestamp)  
   - **Likes**  
     - `id` (primary key)  
     - `user_id` (foreign key to Users)  
     - `post_id` (foreign key to Posts)  
   - **Followers**  
     - `id` (primary key)  
     - `follower_id` (foreign key to Users)  
     - `followed_id` (foreign key to Users)

2. Make sure you add **constraints**:
   - Primary Keys  
   - Unique on `username` and `email`  
   - Foreign Keys with `ON DELETE CASCADE`  

---

## Step 2: Insert Sample Data

- Insert at least **5 users**.  
- Insert at least **10 posts** across different users.  
- Insert at least **20 likes**.  
- Insert follower relationships (at least 5).  

???+ tip

    Use realistic data (funny usernames, real timestamps).  
    This makes queries more meaningful.

---

## Step 3: Basic Queries

1. Show all posts from a given user.  
2. Show all users and their posts (even if they have none).  
3. Show all likes for a given post.  
4. Show all followers of a user.

---

## Step 4: Aggregations

1. Find the user with the most posts.  
2. Find the most liked post.  
3. Find the most active user (most likes given).  
4. Count how many followers each user has.  

---

## Step 5: Integrity Tests

1. Try inserting two users with the same username → what happens?  
2. Try inserting a post with a `user_id` that does not exist → what happens?  
3. Delete a user. Check what happens to their posts and likes.  

---

## Step 6: Documentation

Write a short explanation (1–2 pages) describing:
- Your database design (ER diagram + tables).  
- Why normalization helps your design.  
- Examples of queries and results.  

---

## Deliverables

- SQL file (`.sql`) with all table definitions and inserts.  
- ER diagram (can be drawn in any tool or even on paper and scanned).  
- Documentation file (`.md` or `.pdf`).  

---

## Grading Criteria

- ✅ Correct table design with constraints  
- ✅ Sample data inserted correctly  
- ✅ Queries return correct results  
- ✅ Aggregations show meaningful insights  
- ✅ Clear documentation  

---

## Recap

This project combines everything we learned:
- Tables, Keys, Relationships  
- SQL basics  
- CRUD operations  
- Joins  
- Aggregations  
- Constraints  
- Normalization  

By the end, you will have a working **Mini-Instagram Database** 🎉
