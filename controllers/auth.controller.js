const {Users, Profiles, Roles} = require('../models')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function hashPassword(plaintextPassword) {
    const hash = await bcrypt.hash(plaintextPassword, 10);
    return hash;
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
            const hashed = await hashPassword(req.body.password);

            const user = await Users.create({
                data: {
                    email: req.body.email,
                    phone: req.body.phone,
                    password: hashed,
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
        
            return res.status(200).json({
                status: "created",
                user,
                profile,
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
    }
}