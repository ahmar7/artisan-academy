let UserModel = require("../models/userModel");
// Usedto handle error
const errorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary");
const getDataUri = require("../utils/dataUri");

const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const jwtToken = require("../utils/jwtToken");

const crypto = require("crypto");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
function generateResetToken() {
  const buffer = crypto.randomBytes(32);
  const token = buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
  return token;
}
exports.LoginWithGoogle = catchAsyncErrors(async (req, res, next) => {
  const { email, first_name, last_name, profile } = req.body;

  try {
    let user = await UserModel.findOne({ email });

    if (!user) {
      // If the user doesn't exist, create a new user
      user = await UserModel.create({
        name: `${first_name} ${last_name}`,
        email,
        profile,
        role: "user",
        verified: true,
      });

      // Generate a new token for the user
      const token = new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      });
      await token.save();

      // Respond with the JWT token
      jwtToken(user, 201, res);
    } else {
      // If the user already exists, delete existing tokens and generate a new one
      await Token.deleteMany({ userId: user._id });

      const newToken = new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      });
      await newToken.save();

      // Respond with the JWT token
      jwtToken(user, 200, res);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
exports.RegisterUser = catchAsyncErrors(async (req, res, next) => {
  const {
    name,
    email,
    phone,
    password,
    company,
    title,
    services,
    // role,
  } = req.body;
  // if (
  //   !name ||
  //   !company ||
  //   !email ||
  //   !password ||
  //   !phone ||
  //   !title ||
  //   !services
  // ) {
  //   return next(new errorHandler("Please fill all the required fields", 500));
  // }
  let findUser = await UserModel.findOne({
    email: req.body.email,
  });
  if (findUser) {
    return next(
      new errorHandler("Email  already exists, please sign in to continue", 500)
    );
  }
  email.toLowerCase();
  const profile =
    "https://res.cloudinary.com/dzkk7ubqq/raw/upload/v1711138293/cxkd7rd3jzdv4ljjaftg.png";
  let createUser = await UserModel.create({
    name,
    email,
    phone,
    password,
    company,
    title,
    services,
    profile,
    role: "user",
  });
  const token = await new Token({
    userId: createUser._id,
    token: crypto.randomBytes(32).toString("hex"),
  }).save();
  let subject = `Email Verification link`;
  const url = `${process.env.BASE_URL}/users/${createUser._id}/verify/${token.token}`;
  let text = `To activate your account, please click the following link:

${url}
The link will be expired after 2 hours`;
  await sendEmail(createUser.email, subject, text);
  res.status(201).send({
    msg: "A verification link has been sent to your email, please verify",
    url: url,
    success: true,
  });
  // jwtToken(createUser, 201, res);
});

exports.verifyToken = catchAsyncErrors(async (req, res, next) => {
  const user = await UserModel.findOne({ _id: req.params.id });
  if (!user) {
    return next(new errorHandler("Invalid link", 400));
  }

  const token = await Token.findOne({
    userId: user._id,
    token: req.params.token,
  });
  if (!token) {
    return next(new errorHandler("link expired", 400));
  }

  await UserModel.updateOne(
    { _id: user._id },
    { verified: true },
    { upsert: true, new: true }
  );
  await token.deleteOne();

  res.status(200).send({ msg: "Email verified successfully", success: true });
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Checking if user has given password and email
  if (!email || !password) {
    return next(new errorHandler("Please enter email and password", 400));
  }
  let UserAuth = await UserModel.findOne({ email });

  if (!UserAuth) {
    return next(
      new errorHandler(
        "User not found with this email address, please register first!"
      )
    );
  }

  if (UserAuth.password != password) {
    return next(new errorHandler("Invalid Email or Password"));
  }
  if (!UserAuth.verified) {
    let token = await Token.findOne({ userId: UserAuth._id });
    if (!token) {
      token = await new Token({
        userId: UserAuth._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();

      //
      let subject = `Email Verification link`;
      const url = `${process.env.BASE_URL}/users/${UserAuth._id}/verify/${token.token}`;
      let text = `To activate your account, please click the following link: 

${url}

The link will be expired after 2 hours`;
      await sendEmail(UserAuth.email, subject, text);
      //
    } else if (token) {
      await Token.findOneAndDelete({ userId: UserAuth._id });
      token = await new Token({
        userId: UserAuth._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();

      //
      let subject = `Email Verification link`;
      const url = `${process.env.BASE_URL}/users/${UserAuth._id}/verify/${token.token}`;
      let text = `To activate your account, please click the following link: 

${url}

The link will be expired after 2 hours`;
      await sendEmail(UserAuth.email, subject, text);
      //
    }

    return res.status(400).send({
      success: false,

      msg: "A verification link has been sent to your email, please verify",
    });
  }

  jwtToken(UserAuth, 200, res);
});
exports.sendTicket = catchAsyncErrors(async (req, res, next) => {
  const { title, description, id } = req.body;
  let _id = id;
  // Checking if user has given password and email
  if (!title || !description) {
    return next(new errorHandler("Please fill both the requrired fields", 500));
  }
  if (description.length < 20) {
    return next(new errorHandler("Enter some detail in description", 500));
  }
  let userEmail = await UserModel.findById(_id);

  let newTitle = `Blochain user ticket`;
  let newDescription = `
From:
${userEmail.firstName}
${userEmail.email}


Ticket Title: 
${title}

Ticket Description:
${description}`;

  await sendEmail(process.env.USER, newTitle, newDescription);

  return res.status(200).send({
    success: true,

    msg: "Your ticket was sent. You will be answered by one of our representatives.",
  });
});
// exports.sendEmailCode = catchAsyncErrors(async (req, res, next) => {
//   const { email} = req.body;

//   // Checking if user has given password and email

//   let userEmail = await UserModel.findById(_id);

//   let newTitle = `Blochain user ticket`;
//   let newDescription = `
// From:
// ${userEmail.firstName}
// ${userEmail.email}

// Ticket Title:
// ${title}

// Ticket Description:
// ${description}`;

//   await sendEmail(process.env.USER, newTitle, newDescription);

//   return res.status(200).send({
//     success: true,

//     msg: "Your ticket was sent. You will be answered by one of our representatives.",
//   });
// });

//
exports.sendEmailCode = catchAsyncErrors(async (req, res, next) => {
  //
  const { email, id, code } = req.body;
  let _id = id;

  await UserModel.findById(_id);
  let subject = `KYC Verification OTP`;
  let text = `Your OTP for the verification of KYC: 

${code}
`;
  await sendEmail(email, subject, text);

  return res.status(400).send({
    success: true,

    msg: "An OTP has been sent to your email, please enter it to continue",
  });
});

// Logout User

exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("jwttoken", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).send({
    success: true,
    msg: "User Logged out successfully",
  });
});
const ITEMS_PER_PAGE = 6;
exports.allUser = catchAsyncErrors(async (req, res, next) => {
  const { page = 1, search } = req.query;

  try {
    let query = {};

    // Apply search criteria if 'search' parameter is provided
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    const totalItems = await UserModel.countDocuments(query);
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    const skip = (page - 1) * ITEMS_PER_PAGE;

    const users = await UserModel.find(query).skip(skip).limit(ITEMS_PER_PAGE);

    res.status(200).send({
      success: true,
      msg: "Users fetched successfully",
      currentPage: +page,
      totalPages,
      totalItems,
      users,
    });
  } catch (error) {
    next(new errorHandler(error, 500));
  }
});
exports.singleUser = catchAsyncErrors(async (req, res, next) => {
  let { id } = req.params;
  let signleUser = await UserModel.findById({ _id: id });
  res.status(200).send({
    success: true,
    msg: "Signle Users",
    signleUser,
  });
});

exports.updateSingleUser = catchAsyncErrors(async (req, res, next) => {
  let { id } = req.params;
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    address,
    city,
    progress,
    country,
    postalCode,
    note,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !phone ||
    !address ||
    !city ||
    !country ||
    !postalCode
  ) {
    return next(
      new errorHandler(
        "You can't leave any field empty except note field!",
        500
      )
    );
  }
  let signleUser = await UserModel.findByIdAndUpdate(
    { _id: id },
    {
      firstName,
      lastName,
      email,
      password,
      phone,
      progress,
      address,
      city,
      country,
      postalCode,
      note,
    },
    { new: true }
  );
  res.status(200).send({
    success: true,
    msg: "User updated successfully",
    signleUser,
  });
});
exports.bypassSingleUser = catchAsyncErrors(async (req, res, next) => {
  let { id } = req.params;

  let singleUser = await UserModel.findByIdAndUpdate(
    { _id: id },
    { $set: { verified: true } },
    { new: true }
  );

  res.status(200).send({
    success: true,
    msg: "User email verified successfully",
    singleUser,
  });
});

exports.updateKyc = catchAsyncErrors(async (req, res, next) => {
  let { id } = req.params;
  const { kyc, status } = req.body;

  let signleUser = await UserModel.findByIdAndUpdate(
    { _id: id },
    {
      kyc: kyc,
      submitDoc: {
        status: status,
      },
    },
    { new: true, upsert: true }
  );

  res.status(200).send({
    success: true,
    msg: "User updated successfully",
    signleUser,
  });
});
exports.getsignUser = catchAsyncErrors(async (req, res, next) => {
  let { id } = req.body;
  let signleUser = await UserModel.findById({ _id: id });
  res.status(200).send({
    success: true,
    msg: "Signle Users",
    signleUser,
  });
});
exports.verifySingleUser = catchAsyncErrors(async (req, res, next) => {
  let { id, cnic, bill } = req.body;

  let signleUser = await UserModel.findByIdAndUpdate(
    { _id: id },
    {
      submitDoc: {
        status: "completed",
        cnic: cnic,
        bill: bill,
      },
    },
    { new: true, upsert: true }
  );
  signleUser.save();

  res.status(200).send({
    success: true,
    msg: "Thank you for submitting KYC documents.",
    signleUser,
  });
});

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  let email = req.body.email;
  let user = await UserModel.findOne({ email });
  if (!user) {
    next(new errorHandler("user not found", 404));
  }

  return res.status(200).send({
    msg: "Done",
    // token,
    user,
  });
});

exports.adminResetPassword = catchAsyncErrors(async (req, res, next) => {
  const { email } = req.body;
  const admin = await UserModel.findOne({ email });

  if (!admin) {
    return res.status(404).send("Admin not found");
  }

  const resetToken = generateResetToken();
  admin.resetPasswordToken = resetToken;
  admin.resetPasswordExpires = Date.now() + 3600000; // 1 hour from now
  await admin.save();

  const url = `${process.env.BASE_URL}/forget-password/${resetToken}`;
  const subject = `Reset Password Verification`;
  const text = `To reset your password, please click the following link: 
  
${url}

The link will expire after 1 hour.`;

  await sendEmail(admin.email, subject, text);

  return res.json({
    message: "Successfully sent link",
    link: url,
    success: true,
  });
});

exports.adminResetNewPassword = catchAsyncErrors(async (req, res, next) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;

  if (!newPassword || newPassword.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long." });
  }

  try {
    // Hash the token to compare with the hashed token stored in the database

    console.log(resetToken);
    // Find the admin by the reset token and ensure the token hasn't expired
    const admin = await UserModel.findOne({
      resetPasswordToken: resetToken,
    });

    if (!admin) {
      return res
        .status(400)
        .json({ message: "Invalid or expired password reset token." });
    }

    admin.password = await newPassword;
    // Clear the password reset token fields
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;
    await admin.save();
    res.status(200).json({
      message:
        "Password has been successfully reset. Please log in with your new password.",
      success: true,
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res
      .status(500)
      .json({ message: "An error occurred while resetting the password." });
  }
});

exports.adminProfileUpdate = catchAsyncErrors(async (req, res, next) => {
  try {
    const userId = req.user._id; // Assuming req.user contains the authenticated user's data

    const { name, email, company, services } = req.body;
    // Validate input data as needed

    // Update the user in the database
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: { name, email, company, services } },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Respond with the updated user information
    // Exclude sensitive fields as necessary
    const { password, ...userWithoutPassword } = updatedUser.toObject();
    res.status(200).json({
      message: "Profile updated successfully",
      user: userWithoutPassword,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

exports.AdminChangePassowrd = catchAsyncErrors(async (req, res, next) => {
  try {
    const userId = req.user._id;
    const password = req.user.password; // Assuming req.user contains the authenticated user's data

    const { currentPassword, NewPassword } = req.body;
    if (!currentPassword || !NewPassword) {
      return res.status(400).json({
        message: "Please provide both current and new password",
        success: false,
      });
    }
    if (password !== currentPassword) {
      return res
        .status(400)
        .json({ message: "Current password is incorrect", success: false });
    }
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { password: NewPassword },
      { new: true }
    );

    res.status(200).json({
      message: "successful password change",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
