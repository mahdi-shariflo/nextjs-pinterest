import {
    createAccessToken,
    createRefreshToken,
  } from "./../../../utils/generateToken";
  import User from "./../../../models/userModel";
  import bcrypt from "bcrypt";
  import cors from "cors";
import connnectDB from "../../../utils/connectDB";
  

  connnectDB();
  export default async (req: any, res: any) => {
    switch (req.method) {
      case "POST":
        await Login(req, res);
        break;
    }
  };
  
  const Login = async (req: any, res: any) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res
          .status(400)
          .json({ err: "this email is not exists" });
  
      const match = await bcrypt.compare(
        password,
        user.password
      );
  
      if (!match)
        return res
          .status(400)
          .json({ err: "email or password is incorrect" });
  
      const create_access_token = await createAccessToken({
        id: user._id,
      });
      const refresh_token = await createRefreshToken({
        id: user._id,
      });
  
      res.status(200).json({
        msg: "login successful",
        user: {
          access_token: create_access_token,
          refresh_token,
          name: user.name,
          email: user.email,
          image: user.image
        },
      });
    } catch (error: any) {
      res.status(500).json({ err: error.message });
    }
  };
  