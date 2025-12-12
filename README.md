# My Kitchen Chronicles

## Description
Kitchen chronicles is a lively recipe website where users can share 
their culinary creations and explore new dishes to enhance personal collection.

## Features
- User registration & login
- Add recipes with images
- view all recipes
- View individual recipe

## Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Database:** MySQL

## Installation & Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Malik982/my-kitchen-chronicles.git
2. Navigate into the project directory:
   ```bash
   cd my-kitchen-chronicles
3. Install dependencies:
   ```bash
   npm install
4. Create a file named .env:
   ```bash
   cp .env.example
5. Create MySQL tables:
   ```bash
   CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE recipes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        title VARCHAR(255),
        description TEXT,
        ingredients TEXT,
        instructions TEXT,
        images JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES user(id)
    );
    CREATE TABLE recipe_images (
        id int AUTO_INCREMENT PRIMARYKEY,
        recipe_id INT,
        image_url VARCHAR(500),
        FOREIGN KEY (user_id) REFERENCES user(id)
    );
6. Start the server
   ```bash
   node server.js
7. Server runs at:
   ```bash
   http://localhost:3000





    
