# 📆 Events api

This is a RESTful API developed with NodeJS, Express, MySQL and React.

## 🛠️Technologies used

    JavaScript
    Node.js
    Express
    MySQL
    React

## 🗃️Database schema

The database consists of the following collections:

### Users
    id:             INT AUTO_INCREMENT PRIMARY KEY
    email:      	VARCHAR(255) UNIQUE NOT NULL
    password_hash:	VARCHAR(255) NOT NULL
    name:       	VARCHAR(100) NOT NULL
    role:       	ENUM('admin', 'volunteer') NOT NULL DEFAULT 'volunteer'
    created_at: 	TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### Events
    id:	            INT AUTO_INCREMENT PRIMARY KEY	
    title:       	VARCHAR(150) NOT NULL
    description:    TEXT
    location	    VARCHAR(255)
    date:	        DATE NOT NULL
    max_volunteers:	INT DEFAULT 50
    created_at:	    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    
### Event_volunteers
    id:	            INT AUTO_INCREMENT PRIMARY KEY
    event_id:	    INT NOT NULL
    user_id:	    INT NOT NULL
    registered_at:	TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    
## 📥Instalation process

### Clone the repository

git clone https://github.com/GMinettodev/events-api.git
cd events-api

### Install the dependencies

npm install

### Configure the web environment

cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

### Edit the .env with the settings of your MySQL

### Create the database and the tables

mysql -u root
source backend/src/database/create_database.sql
source backend/src/database/create_tables.sql

### Run the application

npm run dev
