const {Users, Profiles, Roles} = require('../models')

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
    }


    // register: async (req, res) => {
    //     const user = await Users.create({
    //         data: {
    //             email,       
    //             phone,
    //             password,   
    //             resetToken,  
    //             codeOTP     
    //             OTPlimit    
    //             roleId      
    //             role         
    //         }
    //     })
    // }
}