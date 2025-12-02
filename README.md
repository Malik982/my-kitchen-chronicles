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

## Test cases
1. Authentication
   To register, submit the form with the name, email, and password.
   When you click on "register", if the account already exists, it will say "email taken", and if not,
   you will see "User registered successfully", and after that you will be redirected to the front page.

   To login, you should submit the correst email and password.
   When you click on "sign in" button, if the email or the password is wrong, you will receive an error
   saying "invalid email or password", and if it is correct, you will see "welcome" and the user's name,
   and you will be redirected to dashboard.

   To logout, you can just simply click on "logout" on dashboard and you will be logged out, but your email still exists
   in the website.

   To delete your account, click on "delete account" button on dashboard, you will get a notification that says
   "are you sure? this cannot be undone", to confirm click "ok" and your account will be deleted along with the
   recipes that the user have uploadded. You can make sure by signing in and you will receive an error that says
   "invalid email or password".

3. Add and view recipes
   To add a recipe, click on "add recipe" button, and fill the form which is title, description, ingredients,
   description, and images which you can add between 1 and 10 images. any missing field will result with an
   error that says "please fill out this field".
   After filling all the fields and click on submit, you will be redirected to the "ecipes" where you will see your recipe
   along with other recipes that you can view indiviually by clicking on "view recipe" button which will redirect you to
   the recipe that will show you the ingredients and the instructions of how to make the dish.



    
