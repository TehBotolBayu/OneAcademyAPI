const {Users, Profiles, Roles} = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

async function hashPassword(plaintextPassword) {
    const hash = await bcrypt.hash(plaintextPassword, 10);
    return hash;
}

async function cryptPassword(password) {
    const salt = await bcrypt.genSalt(5);
    return bcrypt.hash(password, salt)
}

function generateOTP() {
    var digits = '0123456789'; 
    let OTP = ''; 
    for (let i = 0; i < 6; i++ ) { 
        OTP += digits[Math.floor(Math.random() * 10)]; 
    } 
    return OTP; 
} 

module.exports = {
    getAllRole: async (req, res) => {
        try {
            const roles = await Roles.findMany()
            return res.status(201).json({
                roles
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Something went wrong" });
        }
    },

    createRole: async (req, res) => {
        try {
            const role = await Roles.create({
                data: {
                    name: req.body.name
                }
            })
            return res.status(201).json({
                role
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Something went wrong" });
        }
    },

    register: async (req, res) => {
        try {
            let date = new Date();
            date.setMinutes(date.getMinutes() + 5);
            date.toISOString();
            const hashed = await hashPassword(req.body.password);
            const user = await Users.create({
                data: {
                    email: req.body.email,
                    phone: req.body.phone,
                    password: hashed,
                    codeOTP: generateOTP(),
                    OTPlimit: date,
                    status: "inactive",
                    role: {
                        connect: {id: parseInt(req.body.roleId)}
                    }
                }
            });
        
            const profile = await Profiles.create({
                data: {
                    name: req.body.name,
                    user: {
                        connect: {id: user.id}
                    }
                }
            });

            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            const mailOptions = {
                from: 'system@gmail.com',
                to : req.body.email,
                subject: "Account Verification",
                html: `<p>Your OTP</p><h1>${user.codeOTP}</h1>`
            }

            transporter.sendMail(mailOptions, (err) => {
                if(err) {
                    console.log(err)
                    return res.status(400);
                }
                return res.status(200).json({
                    message: "account is created, OTP sent",
                    user
                });
            })
        
            
        } catch (error) {
            console.log(error.message);
            return res.status(400).json({
                error
            })
        }
    },

    verifyOTP: async (req, res) => {
        try {
            const acc = await Users.findUnique({
                where: {
                    email: req.body.email
                }
            })
            
            if(req.body.OTP == acc.codeOTP){
                let now = new Date().toISOString();
                if(acc.OTPlimit.toISOString() > now){
                    await Users.update({
                        data: {
                            codeOTP: null,
                            OTPlimit: null,
                            status: "active"
                        },
                        where: {
                            email: req.body.email
                        }
                    })

                    return res.status(200).json({
                        message: "Your Account has activated"
                    })
                } else {
                    return res.status(400).json({
                        message: "Your OTP is expired, try resetting it"
                    })
                }
            } else {
                return res.status(200).json({
                    message: "Your OTP is invalid"
                })
            }
        } catch (error) {
            console.log(error.message);
            return res.status(400).json({
                error
            })
        }
    },

    resetOTP: async (req, res) => {
        try {
            let date = new Date();
            date.setMinutes(date.getMinutes() + 5);
            date.toISOString();
            const acc = await Users.update({
                data:{
                    codeOTP: generateOTP(),
                    OTPlimit: date
                },
                where: {
                    email: req.body.email
                }
            })

            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            const mailOptions = {
                from: 'system@gmail.com',
                to : req.body.email,
                subject: "Account Verification",
                html: `<p>Your OTP</p><h1>${acc.codeOTP}</h1>`
            }

            transporter.sendMail(mailOptions, (err) => {
                if(err) {
                    console.log(err)
                    return res.status(400);
                }
                return res.status(200).json({
                    message: "We have sent a new OTP, check your email",
                });
            })

        } catch (error) {
            console.log(error.message);
            return res.status(400).json({
                error
            })
        }
    },

    login: async (req, res) => {
        try {
            const findUser = await Users.findFirst({
                where: {
                    email: req.body.email
                }
            })
        
            if(!findUser){
                return res.status(404).json({
                    error: 'Email tidak terdaftar!'
                });
            }

            if(findUser.status === "inactive"){
                return res.status(401).json({
                    message: "Account is not activated, please enter OTP"
                })
            }
        
            if(bcrypt.compareSync(req.body.password, findUser.password)){
                const token = jwt.sign(
                {
                    id: findUser.id
                },
                'secret_key', 
                {
                    expiresIn: '24h'
                })
                return res.status(200).json({
                    data: {
                        token
                    },
                    id: findUser.id
                })
            }
        
            return res.status(403).json({
                error: 'Invalid credentials'
            })
        } catch (error) {
            console.log(error.message);
            res.status(400).json({
                error
            })
        }
    },

    resetPassword: async (req, res) => {
        try {
            const findUser = await Users.findFirst({
                where: {
                    email: req.body.email
                }
            });

            if(!findUser) {
                return res.status(400).json({
                    message: "User not found"
                });
            }

            const encrypt = await cryptPassword(req.body.email);

            await Users.update({
                data: {
                    resetToken: encrypt,
                },
                where: {
                    id: findUser.id
                }
            });

            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                }
            });

            const mailOptions = {
                from: 'system@gmail.com',
                to : req.body.email,
                subject: "Reset Password",
                html: `<p>Reset Password </p><a href="localhost:5000/set-password/${encrypt}">Click Here</a><br></br><p>Paste this url to your browser if you cant click link above</p><p>localhost:5000/set-password/${encrypt}</p>`
            }

            transporter.sendMail(mailOptions, (err) => {
                if(err) {
                    console.log(err)
                    return res.status(400).json({
                        message: "Something went wrong"
                    });
                }

                return res.status(200).json({
                    message: "email sent"
                });
            })
            
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                error
            });
        }
    },

    setPassword: async (req, res) => {
        try {
            
            const findUser = await Users.findFirst({
                where: {
                    resetToken: req.body.key
                }
            });

            if(!findUser) {
                return res.status(400).json({
                    message: "User not found"
                });
            }

            await Users.update({
                data: {
                    password: await cryptPassword(req.body.password),
                    resetToken: null
                },
                where: {
                    id: findUser.id
                }
            });

            return res.status(200).json({
                message: "Password has changed"
            });
            
        } catch (error) {
            console.log(error)
            return res.status(500).json({
                error
            });
        }
    },

    update: async (req, res) => {
        try {
            const user = await Users.update({
                data: {
                    email: req.body.email,
                    phone: req.body.phone
                },
                where: {
                    id: req.params.userId
                }
            })
            const profile = await Profiles.update({
                data: {
                    name: req.body.name,
                    country: req.body.country,
                    city: req.body.city,
                    image: {
                        connect: {id: res.locals.data.id}
                    } 
                },
                where: {
                    userId: req.params.userId
                }
            })

            return res.status(201).json({
                message: "updated",
                user,
                profile
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Something went wrong" });
        }
    },

    getProfile: async (req,res) => {
        try {
            const profile = await Profiles.findUnique({
                where: {
                    userId: req.params.userId
                }
            })

            return res.status(201).json({
                profile
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Something went wrong" });
        }
    },
    
    delete: async (req, res) => {
        try {
            const user = await Users.delete({
                where: {
                    id: req.params.userId
                }
            })

            return res.status(201).json({
                message: "deleted",
                user
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Something went wrong" });
        }
    }
}