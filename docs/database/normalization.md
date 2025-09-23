# Normalization: Avoiding Redundancy

## Why Normalization?

Without structure, databases can become messy.  
Example: Suppose we add a `username` column directly into the **Posts** table:

| post_id | username | content        |
|---------|----------|----------------|
| 1       | anna     | Hello, world!  |
| 2       | anna     | Coffee time ☕ |
| 3       | bob      | My first pic   |

Problems:

- If Anna changes her username, we must update it in **every post**.  
- Risk of inconsistent data (e.g., “anna” vs “Anna”).  
- Waste of storage with repeated values.  

Normalization solves these problems.

---

## What is Normalization?

Normalization is the process of organizing data into multiple related tables to **reduce redundancy** and **improve consistency**.

We use a set of rules called **Normal Forms**.

???+ info

    You don’t need to memorize all forms. For beginners, the first three are most important:  
    - **1NF (First Normal Form)**  
    - **2NF (Second Normal Form)**  
    - **3NF (Third Normal Form)**

---

## First Normal Form (1NF)

- Each column contains atomic (indivisible) values.  
- No repeating groups.

Bad example (multiple likes in one column):

| post_id | likes              |
|---------|--------------------|
| 1       | anna, bob, claire |

Better (separate rows):

| like_id | post_id | user_id |
|---------|---------|---------|
| 1       | 1       | anna    |
| 2       | 1       | bob     |
| 3       | 1       | claire  |

---

## Second Normal Form (2NF)

- Must be in 1NF.  
- Every non-key attribute must depend on the whole primary key.

Example: In a **Likes** table, if the primary key is `(user_id, post_id)`, then no other column should depend only on `user_id` or only on `post_id`.

---

## Third Normal Form (3NF)

- Must be in 2NF.  
- No transitive dependencies (non-key columns shouldn’t depend on other non-key columns).

Bad design: putting `email` inside the **Posts** table.  
`email` depends on `user_id`, not on `post_id`.  

Better: keep `email` in the **Users** table only.

---

## Why Stop at 3NF?

- In practice, **1NF–3NF** are usually enough.  
- Higher forms exist (BCNF, 4NF, 5NF), but are rarely needed in simple applications.  

---

## Recap

- Normalization reduces redundancy and avoids inconsistency.  
- **1NF**: atomic values, no repeating groups.  
- **2NF**: every attribute depends on the whole key.  
- **3NF**: no transitive dependencies.  
- Instagram example: usernames/emails should only live in **Users**, not duplicated in **Posts**.  

---

## Chore

1. Look at your current database design (Users, Posts, Likes, Followers).  
   - Is it in 1NF?  
   - Is it in 2NF?  
   - Is it in 3NF?  

2. If not, redesign the tables to fix the issues.  

3. Write a short explanation: Why is normalization important for large apps like Instagram?
