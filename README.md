

# One Academy API
### Final Project Kelompok 1 Binar Academy
OneAcademy is an application providing online learning content in the form of videos. The platform offers accessible learning content either for free or through a subscription model. There are two user roles : admin and regular user. The admin role involves determining which courses will be available. On the other hand, users can access learning videos after making payments.

![App Screenshot](https://ik.imagekit.io/uy6buvfss/WhatsApp%20Image%202023-12-31%20at%2010.36.59.jpeg?updatedAt=1703993848794)

## Features

## 1. Admin
- Manage Category Course (CRUD)
- Manage Course (CRUD)
- Manage Chapter Course (CRUD)
- Manage Material Course (CRUD)
- View User Transaction History

## 2. User
- View available courses
- Filter and search courses
- View course details
- Purchase a course
- Watch materials from purchased courses
- Check the progress of watched courses
- Manage profiles


## Tech Stack

- [Prisma ORM](https://www.prisma.io/) : Object Relational Mapping
- [PostgreSQL](https://www.postgresql.org/) : Relational Database
- [Railway](https://railway.app/) - Deployment Branch Staging
- [Google Cloud Platform](https://cloud.google.com/) - Cloud Platform Deployment Branch Master
- [Node JS](https://nodejs.org/en) : JavaScript Runtime Environment
- [Express](https://expressjs.com/) : Node JS Framework
- [Imagekit.io](https://imagekit.io/) : Image Storage
- [Nodemailer](https://nodemailer.com/) : Send Email 
- [JWT](https://jwt.io/) : Authentication
- [GIT](https://git-scm.com/) : Version Control
- [Axios](https://axios-http.com/) : Fetch API


## Installation

Clone Repository
```sh
https://github.com/dimasz555/OneAcademyAPI.git
```

Install the dependencies and devDependencies and start the server.

```sh
npm install
npm run dev
```

## Environtment Variable

.env.example is the environment configuration file used in this project, containing a list of environment variables that must be set in the actual .env file.

List of Environment Variables : 
1. PORT= PORT Server
2. DATABASE_URL= URL database
3. IMAGEKIT_PUBLIC_KEY= Public key to connect with imagekit
4. IMAGEKIT_SECRET_KEY= Secret key to connect with imagekit
5. IMAGEKIT_URL_ENDPOINT= URl to connect with imagekit
6. EMAIL_USER= Email to connect with nodemailer (send email)
7. EMAIL_PASSWORD= Password application to connect a nodmailer (send email)  

