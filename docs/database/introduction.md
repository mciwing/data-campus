# Introduction to Databases

## Motivation: Why Databases?

Almost every app we use daily stores and manages data.  
Whether it’s **Instagram**, **WhatsApp**, or **Spotify** – in the background, 
databases handle millions of requests simultaneously.

So today, we ask ourselves:  
How can we store data in a way that makes it **organized, safe, and efficient**?

### Example: Instagram

Let’s think of Instagram as a database:

- **Users**: name, email, password, profile picture  
- **Posts**: image, caption, timestamp  
- **Likes**: which user liked which post  
- **Comments**: user writes text under a post  
- **Followers**: who follows whom  

All of this information has to be stored and retrieved quickly when needed.

???+ info

    A **Database Management System (DBMS)** is software that helps us store, 
    manage, and query data. Examples include:
    
    - MySQL  
    - PostgreSQL  
    - SQLite (we will use this in our course)

---

## From Data to Information

### Data vs. Information

- **Data**: raw values without context (e.g., “42”, “Anna”, “2025-09-23”)  
- **Information**: data that is put into context  
  (e.g., “Anna created a post on 2025-09-23 at 2:00 pm.”)

???+ defi "Metadata"

    Data about data.  
    Example: “File created on 2025-09-23, size 2 MB.”  
    For Instagram: the upload date of a picture, camera used, location.

---

## First Practical Exercise

Let’s start **hands-on**:  
Open Excel (or any table tool) and create a small table.

Columns:  
- `id` (unique number)  
- `username`  
- `email`  
- `password`

Rows:  
- Fill the table with users you know (yourself, friends, family).

???+ tip

    Think about this: Why do we need an `id` column if every user already has 
    a unique username?

---

## Recap

- Databases are the foundation of modern apps like Instagram.  
- A DBMS helps us manage data efficiently and consistently.  
- We distinguish between **data**, **information**, and **metadata**.  
- First hands-on task: create a user table in Excel.

---

## Chore

Create a second table in Excel: **Posts**.  
Columns could be:

- `id` (unique)  
- `user_id` (reference to a user)  
- `content` (text or image description)  
- `created_at` (date/time)

Fill the table with 3–5 examples.  
Think about this: how could we later connect the posts to the users?
