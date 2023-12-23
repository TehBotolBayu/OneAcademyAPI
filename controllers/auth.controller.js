const { Users, Profiles, Roles } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { revokeToken } = require("../middlewares/auth");
const { google } = require("googleapis");

async function hashPassword(plaintextPassword) {
  const hash = await bcrypt.hash(plaintextPassword, 10);
  return hash;
}

const cryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(5);
  const hash = await bcrypt.hash(password, salt);
  const encrypted = hash.replace(/\//g, "");
  return encrypted;
};

function generateOTP() {
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  // "http://localhost:3000/api/v1/user/auth/google/callback",
  "https://oneacademyapi-staging.up.railway.app/api/v1/user/auth/google/callback"
);

const scopes = [
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

module.exports = {
  oauth2Client,
  scopes,
  getAllRole: async (req, res) => {
    try {
      const roles = await Roles.findMany();
      return res.status(201).json({
        roles,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  },

  createRole: async (req, res) => {
    try {
      const role = await Roles.create({
        data: {
          name: req.body.name,
        },
      });
      return res.status(201).json({
        role,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Something went wrong" });
    }
  },

  register: async (req, res) => {
    try {
      const existUser = await Users.findUnique({
        where: {
          email: req.body.email,
        },
      });

      if (existUser) {
        return res.status(400).json({
          message: "Email already registered",
        });
      }

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
            connect: { id: parseInt(req.body.roleId) },
          },
        },
      });

      const profile = await Profiles.create({
        data: {
          name: req.body.name,
          user: {
            connect: { id: user.id },
          },
        },
      });

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: "system@gmail.com",
        to: req.body.email,
        subject: "Account Verification",
        html: `<div
        style="
          text-align: center;
          padding: 1rem;
          border-radius: 5px;
          background-color: #6148ff;
          color: white;
          font-family: 'Montserrat', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0 auto;
        "
      >
        <h1>Activation Account</h1>
        <img
          src="https://i.imgur.com/nhNpkBd.png"
          alt="One Academy"
          style="width: 15dvw"
        />
        <div
          style="
            background-color: white;
            border-radius: 10px;
            padding: 1rem;
            margin-bottom: 20px;
            color: black;
            max-width: 60dvw;
            max-height: 60dvh;
            margin-top: 10px;
            margin: 0 auto;
          "
        >
          <p>Hello <span style="font-weight: 700">${profile.name},</span></p>
  
          <p>
            Thank you for choosing to join OneAcademy!<br />
            Your account activation is almost complete. To finalize the activation
            process, please Enter the OTP below :
          </p>
  
          <p style="letter-spacing: 5px; font-size: 25px">
            <strong>${user.codeOTP}</strong>
          </p>
          <p>
            Your account will be successfully activated upon completion of these
            steps. If you did not initiate this action or have any concerns,
            please contact our support team immediately.
          </p>
        </div>
        <p>
          Thank you for choosing OneAcademy!<br />
          © 2023, One Academy. All rights reserved.
        </p>
      </div>`,
      };

      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          console.log(err);
          return res.status(400);
        }
        return res.status(201).json({
          message: "account is created, OTP sent",
          user,
        });
      });
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        message: "Something went wrong",
      });
    }
  },

  verifyOTP: async (req, res) => {
    try {
      const acc = await Users.findUnique({
        where: {
          email: req.body.email,
        },
      });

      if (req.body.OTP == acc.codeOTP) {
        let now = new Date().toISOString();
        if (acc.OTPlimit.toISOString() > now) {
          await Users.update({
            data: {
              codeOTP: null,
              OTPlimit: null,
              status: "active",
            },
            where: {
              email: req.body.email,
            },
          });

          return res.status(200).json({
            message: "Your Account has activated",
          });
        } else {
          return res.status(400).json({
            message: "Your OTP is expired, try resetting it",
          });
        }
      } else {
        return res.status(200).json({
          message: "Your OTP is invalid",
        });
      }
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({
        error: "Something went wrong",
      });
    }
  },

  resetOTP: async (req, res) => {
    try {
      let date = new Date();
      date.setMinutes(date.getMinutes() + 5);
      date.toISOString();
      const acc = await Users.update({
        data: {
          codeOTP: generateOTP(),
          OTPlimit: date,
        },
        where: {
          email: req.body.email,
        },
        include: {
          profile: true,
        },
      });

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: "system@gmail.com",
        to: req.body.email,
        subject: "Account Verification",
        html: `<div
        style="
          text-align: center;
          padding: 1rem;
          border-radius: 5px;
          background-color: #6148ff;
          color: white;
          font-family: 'Montserrat', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0 auto;
        "
      >
        <h1>Activation Account</h1>
        <img
          src="https://i.imgur.com/nhNpkBd.png"
          alt="One Academy"
          style="width: 15dvw"
        />
        <div
          style="
            background-color: white;
            border-radius: 10px;
            padding: 1rem;
            margin-bottom: 20px;
            color: black;
            max-width: 60dvw;
            max-height: 60dvh;
            margin-top: 10px;
            margin: 0 auto;
          "
        >
          <p>Hello <span style="font-weight: 700">${acc.profile.name},</span></p>
  
          <p>
            Thank you for choosing to join OneAcademy!<br />
            Your account activation is almost complete. To finalize the activation
            process, please Enter the OTP below :
          </p>
  
          <p style="letter-spacing: 5px; font-size: 25px">
            <strong>${acc.codeOTP}</strong>
          </p>
          <p>
            Your account will be successfully activated upon completion of these
            steps. If you did not initiate this action or have any concerns,
            please contact our support team immediately.
          </p>
        </div>
        <p>
          Thank you for choosing OneAcademy!<br />
          © 2023, One Academy. All rights reserved.
        </p>
      </div>`,
      };

      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          console.log(err);
          return res.status(400);
        }
        return res.status(200).json({
          message: "We have sent a new OTP, check your email",
        });
      });
    } catch (error) {
      console.log(error.message);
      return res.status(400).json({
        error,
      });
    }
  },

  login: async (req, res) => {
    try {
      const findUser = await Users.findFirst({
        where: {
          email: req.body.email,
        },
      });

      if (!findUser) {
        return res.status(404).json({
          error: "Email tidak terdaftar!",
        });
      }

      if (findUser.status === "inactive") {
        return res.status(401).json({
          message: "Account is not activated, please enter OTP",
        });
      }

      if (bcrypt.compareSync(req.body.password, findUser.password)) {
        const token = jwt.sign(
          {
            id: findUser.id,
            roleId: findUser.roleId,
          },
          "secret_key",
          {
            expiresIn: "24h",
          }
        );
        return res.status(200).json({
          data: {
            token,
          },
          id: findUser.id,
          roleId: findUser.roleId,
        });
      }

      return res.status(403).json({
        error: "Invalid credentials",
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({
        error: "Something went wrong",
      });
    }
  },

  loginGoogle: async (req, res) => {
    try {
      const { code } = req.query;

      const { tokens } = await oauth2Client.getToken(code);

      oauth2Client.setCredentials(tokens);

      const oauth2 = google.oauth2({
        auth: oauth2Client,
        version: "v2",
      });

      const { data } = await oauth2.userinfo.get();

      if (!data.email || !data.name) {
        return res.status(400).json({
          message: "Data not Found",
          data: data,
        });
      }

      const user = await Users.findUnique({
        where: {
          email: data.email,
        },
        include: {
          profile: true,
          role: true,
        },
      });

      if (!user) {
        let user = await Users.create({
          data: {
            email: data.email,
            password: "",
            status: "active",
            phone: "",
            profile: {
              create: {
                name: data.name,
              },
            },
            roleId: 2,
          },
          include: {
            profile: true,
          },
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          roleId: user.roleId,
        },
        "secret_key",
        {
          expiresIn: "24h",
        }
      );

      return res.status(200).json({
        user,
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "Something went wrong",
      });
    }
  },

  logout: async (req, res) => {
    const token = req.headers.authorization;
    try {
      if (!token) {
        return res.status(403).json({
          error: "please provide a token",
        });
      }

      let tokenValue = token;

      if (tokenValue.toLowerCase().startsWith("bearer")) {
        tokenValue = tokenValue.slice(6).trim();
      }

      revokeToken(tokenValue);

      return res.status(200).json({
        message: "Logout successful",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: "Something went wrong",
      });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const findUser = await Users.findFirst({
        where: {
          email: req.body.email,
        },
        include: {
          profile: true,
        },
      });

      if (!findUser) {
        return res.status(400).json({
          message: "User not found",
        });
      }

      const encrypt = await cryptPassword(req.body.email);

      // return res.status(200).json({
      //   encrypt,
      // });

      await Users.update({
        data: {
          resetToken: encrypt,
        },
        where: {
          id: findUser.id,
        },
      });

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: "system@gmail.com",
        to: req.body.email,
        subject: "Reset Password",
        html: `<div
        style="
          text-align: center;
          padding: 1rem;
          border-radius: 5px;
          background-color: #6148ff;
          color: white;
          font-family: 'Montserrat', Tahoma, Geneva, Verdana, sans-serif;
        "
      >
        <h1>Reset Password</h1>
        <img
          src="https://i.imgur.com/nhNpkBd.png"
          alt="One Academy"
          style="width: 15dvw"
        />
        <div
          style="
            background-color: white;
            border-radius: 10px;
            padding: 1rem;
            margin-bottom: 20px;
            color: black;
            max-width: 60dvw;
            max-height: 60dvh;
            margin-top: 10px;
            margin: 0 auto;
          "
        >
          <p>Hello <span style="font-weight: 700">${findUser.profile.name},</span></p>
  
          <p style="margin-bottom: 15px">
            We received a request to reset your account password. To proceed with
            the password reset, please click reset password button bellow:
          </p>
  
          <a
            href="https://oneacademy-staging.pemudasukses.tech/forgot/${encrypt}"
            style="
              background-color: #6148ff;
              color: white;
              padding: 10px;
              border-radius: 5px;
              text-decoration: none;
            "
            ><strong>Reset Password</strong></a
          >
  
          <p>
            Please note that this verification code is valid for a limited time.
            If you did not initiate this password reset or have any concerns,
            please contact our support team immediately.
          </p>
        </div>
  
        <p>
          Thank you for choosing OneAcademy!<br />
          © 2023, One Academy. All rights reserved.
        </p>
      </div>`,
      };

      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          console.log(err);
          return res.status(400).json({
            message: "Something went wrong",
          });
        }

        return res.status(200).json({
          message: "email sent",
          encrypt,
        });
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Something went wrong",
      });
    }
  },

  setPassword: async (req, res) => {
    try {
      const findUser = await Users.findFirst({
        where: {
          resetToken: req.body.key,
        },
      });

      if (!findUser) {
        return res.status(400).json({
          message: "User not found",
        });
      }

      await Users.update({
        data: {
          password: await cryptPassword(req.body.password),
          resetToken: null,
        },
        where: {
          id: findUser.id,
        },
      });

      return res.status(200).json({
        message: "Password has changed",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        error: "Something went wrong",
      });
    }
  },
};
