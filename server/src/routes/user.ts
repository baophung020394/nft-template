import express, { Request, Response } from 'express';
import { User } from '../models/userModels';


export const userRouter = express.Router();

// Lấy danh sách User với phân trang
// Lấy danh sách User với phân trang
userRouter.get('/list', async (req: Request, res: Response) => {
  let page = parseInt(req.query.page as string) || 1;
  let limit = parseInt(req.query.limit as string) || 10;

  try {
    const totalDocuments = await User.countDocuments().exec();
    const totalPages = Math.ceil(totalDocuments / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = Math.min(page * limit, totalDocuments);

    const users = await User.find()
      .skip(startIndex)
      .limit(limit)
      .lean()
      .exec();

    const hasNextPage = page < totalPages;
    const nextPage = hasNextPage ? page + 1 : null;

    return res.status(200).json({
      status: 200,
      message: 'List of Users',
      users,
      total: totalDocuments,
      currentPage: page,
      totalPages,
      hasNextPage,
      nextPage,
      endIndex, // Thêm thông tin về endIndex
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Failed to fetch users',
      reason: error,
    });
  }
});



// Tạo User
// userRouter.post('/create', async (req: Request, res: Response) => {
//   const { username, level, avatar, levelName } = req.body;
//   const errors: string[] = [];

//   if (!username) {
//     errors.push('Field "username" cannot be empty.');
//   }

//   if (!level) {
//     errors.push('Field "level" cannot be empty.');
//   }

//   if (!levelName) {
//     errors.push('Field "levelName" cannot be empty.');
//   }

//   if (errors.length > 0) {
//     return res.status(400).json({
//       status: 400,
//       message: 'Validation failed',
//       errors: errors,
//     });
//   }

//   try {
//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.status(400).json({
//         status: 400,
//         message: 'Username already exists.',
//       });
//     }

//     const newUser = new User({ username, level, avatar, levelName });
//     await newUser.save();

//     return res.status(201).json({
//       status: 201,
//       message: 'User created successfully',
//       createdUser: newUser,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: 500,
//       message: 'Failed to create user',
//       reason: error,
//     });
//   }
// });
userRouter.post('/create', async (req: Request, res: Response) => {
  const { username, level, avatar, levelName } = req.body;

  try {
    const newUser = new User({ username, level, avatar, levelName });
    await newUser.save();

    return res.status(201).json({
      status: 201,
      message: 'User created successfully',
      createdUser: newUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Failed to create user',
      reason: error,
    });
  }
});

// Xoá nhiều User
userRouter.delete('/delete', async (req: Request, res: Response) => {
  const { userIds } = req.body;

  try {
    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        status: 400,
        message: 'Bad request. Please provide an array of user IDs to delete.',
      });
    }

    const result = await User.deleteMany({ _id: { $in: userIds } });

    return res.status(200).json({
      status: 200,
      message: 'Deleted users successfully',
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Failed to delete users',
      reason: error,
    });
  }
});
