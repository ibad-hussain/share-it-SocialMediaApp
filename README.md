# Share It - Social Media App
# Share It - Social Media App2
# Share It - Social Media App3
# Share It - Social Media App4
# Share It - Social Media App5


# Share It

**Share It** is a social media web application where users can share their thoughts with the world through posts. It features user authentication, image uploads, profile management, and a smooth UI built with EJS templating.

## 🌐 Live Site

> Deployment coming soon on **Vercel**

## 🚀 Features

### 🔐 Authentication
- User Registration and Login
- Secure password hashing
- Session-based authentication using `express-session`

### 📝 Post Management
- Create new posts with optional image uploads
- Edit or delete your own posts
- Like/unlike posts from other users
- Posts sorted by most recent

### 👤 Profile
- View your own profile with bio and posts
- Edit profile details: name, bio, avatar
- View other users' profiles and their posts

### 📸 Image Uploads
- Upload images for posts and profile avatars using **Multer**
- Stores files locally with unique filenames

### 🗃️ Technologies Used

| Tech          | Description                     |
|---------------|---------------------------------|
| Node.js       | Backend runtime                 |
| Express.js    | Web framework                   |
| MongoDB       | NoSQL database                  |
| Mongoose      | MongoDB ODM                     |
| EJS           | Server-side templating engine   |
| Multer        | Middleware for handling `multipart/form-data` (file uploads)
| dotenv        | Environment variable management |
| bcrypt        | Password hashing                |
| express-session | Session management             |
| connect-mongo | Stores sessions in MongoDB      |

---

## 🧾 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/share-it.git
   cd share-it



# Share It

**Share It** is a social web app where users can share posts with captions and images, like posts, and manage their profile. Built using **Node.js**, **Express.js**, **MongoDB**, and **EJS**, it offers a clean, dynamic experience with image uploads via **Multer**.

---

## 🔧 Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: EJS, HTML, CSS (vanilla)
- **Database**: MongoDB, Mongoose
- **Image Uploads**: Multer (stored locally)
- **Authentication**: Manual (custom logic with hashed passwords using bcrypt)
- **Templating**: EJS

---

## ✨ Key Features

### 🧑 User
- Register & login
- Secure password hashing with **bcrypt**
- Edit profile (name, bio, avatar)

### 🖼️ Posts
- Create posts with optional image upload
- Edit and delete your own posts
- Like/unlike posts
- See your posts in your profile

### 📸 Image Uploads
- Upload profile avatars and post images
- Handled by **Multer** and stored locally

### 🌍 Social Feed
- View all user posts sorted by most recent
- Visit other users’ profiles and view their shared posts

---

## ⚙️ Getting Started

1. **Clone & install**
   ```bash
   git clone https://github.com/yourusername/share-it.git
   cd share-it
   npm install
