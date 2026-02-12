import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email đã tồn tại"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Đăng ký thành công",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      message: "Lỗi server"
    });
  }
};

export const login = async (req,res)=>{
    const { email , password} = req.body;

    const user = await User.findOne({email});
    if(!user) return res.status(400).json({message : " Không tìm thấy người dùng!!!"});
    
    const match = await bcrypt.compare(password,user.password);
    if(!match) return res.status(400).json({message:" Bạn sai mật khẩu !!! "})
    
    const token = jwt.sign(
        { id : user._id, email : user.email },
        process.env.JWT_SECRET,
        { expiresIn : "7d"}
    );
    res.json({token,user});
};
