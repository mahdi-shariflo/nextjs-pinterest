import User from "./../../../models/userModel";
import bcrypt from "bcrypt";
import connnectDB from "../../../utils/connectDB";

connnectDB();


export default async (req: any, res: any) => {
  switch (req.method) {
    case "POST":
      await SignUp(req, res);
      break;
  }
};

const SignUp = async (req: any, res: any) => {
  try {
   const { name, email, password } = req.body;
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res
        .status(400)
        .json({ err: "this email is already exists" });

    const hashPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      name,
      password: hashPassword,
    });

    await user.save();

    res.status(200).json({ msg: "signup successful" });
  } catch (error: any) {
    res.status(500).json({ err: error.message });
  }
};
