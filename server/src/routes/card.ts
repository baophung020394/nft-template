import express, { Request, Response } from "express";
import { Card } from "../models/cardModels";
import { User } from "../models/userModels";

export const cardRouter = express.Router();

// list card
// cardRouter.get('/', async (req: Request, res: Response) => {
//   let page = parseInt(req.query.page as string) || 1;
//   let limit = parseInt(req.query.limit as string) || 12;
//   const theme = req.query.theme as string;
//   const priceFrom = parseFloat(req.query.priceFrom as string) || 0;
//   const priceTo = parseFloat(req.query.priceTo as string) || 9999999;
//   const sortByPrice = req.query.sortByPrice as string;
//   const sortByDate = req.query.sortByDate as string;

//   // Xây dựng các điều kiện tìm kiếm
//   const searchConditions: any = {};

//   if (theme) {
//     searchConditions.theme = theme;
//   }
//   searchConditions.priceETH = { $gte: priceFrom, $lte: priceTo };

//   let sortQuery: any = {};
//   if (sortByPrice) {
//     sortQuery.priceETH = sortByPrice === 'ASC' ? 1 : -1;
//   }
//   if (sortByDate) {
//     sortQuery.createdAt = sortByDate === 'oldest' ? 1 : -1;
//   }

//   try {
//     const startIndex = (page - 1) * limit;
//     const endIndex = page * limit;

//     const results: any = {};
//     results.results = await Card.find(searchConditions)
//       .limit(limit)
//       .skip(startIndex)
//       .sort(sortQuery)
//       .lean()
//       .exec();

//     const totalDocuments = await Card.countDocuments(searchConditions).exec();
//     results.total = totalDocuments;

//     if (endIndex < totalDocuments) {
//       results.next = {
//         page: page + 1,
//         limit: limit,
//       };
//     }

//     if (startIndex > 0) {
//       results.previous = {
//         page: page - 1,
//         limit: limit,
//       };
//     }

//     return res.status(200).json({
//       status: 200,
//       message: 'success',
//       ...results,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: 500,
//       message: 'error',
//       reason: error,
//     });
//   }
// });
cardRouter.get("/", async (req: Request, res: Response) => {
  let page = parseInt(req.query.page as string) || 1;
  let limit = parseInt(req.query.limit as string) || 12;
  console.log('req', req.query)
  const theme = (req.query.theme as string) || "all";
  const tier = (req.query.tier as string) || "all";
  const priceFrom = parseFloat(req.query.priceFrom as string) || 0;
  const priceTo = parseFloat(req.query.priceTo as string) || 9999999;
  const sortByPrice = req.query.sortByPrice as string;
  const sortByDate = req.query.sortByDate as string;

  const searchConditions: any = {};
  console.log(theme, tier);
  if (theme === "all") {
    console.log("???");
    // return;
  } else {
    searchConditions.theme = theme;
  }
  // if (theme !== "all" || theme !== null) {
  //   console.log("###");
  //   searchConditions.theme = theme;
  // } else {
  //   console.log("??");
  //   delete searchConditions.theme;
  // }

  if (tier === "all") {
    console.log("???");
    // return;
  } else {
    searchConditions.tier = tier;
  }

  searchConditions.priceETH = { $gte: priceFrom, $lte: priceTo };

  let sortQuery: any = {};

  if (sortByPrice) {
    sortQuery.priceETH = sortByPrice === "ASC" ? 1 : -1;
  }
  if (sortByDate) {
    sortQuery.createdDate = sortByDate === "oldest" ? 1 : -1;
  }
  console.log("sortQuery", sortQuery);
  console.log("searchConditions", searchConditions);
  try {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const cards = await Card.find(searchConditions)
      .limit(limit)
      .skip(startIndex)
      .sort(sortQuery)
      .lean()
      .populate({
        path: "user",
        select: "id username avatar level",
      })
      .exec();

    const totalDocuments = await Card.countDocuments(searchConditions).exec();

    const results: any = {
      total: totalDocuments,
      results: cards.map((card: any) => {
        return {
          ...card,
          user: card.user ? card.user : null, // Trả về thông tin user mong muốn
        };
      }),
    };

    if (endIndex < totalDocuments) {
      results.next = {
        page: page + 1,
        limit: limit,
      };
    }

    if (startIndex > 0) {
      results.previous = {
        page: page - 1,
        limit: limit,
      };
    }

    return res.status(200).json({
      status: 200,
      message: "success",
      ...results,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "error",
      reason: error,
    });
  }
});

// Create card
// cardRouter.post('/create', async (req: Request, res: Response) => {
//   const { name, image, priceETH, user, category, tier, theme } = req.body;
//   const errors: string[] = [];

//   if (!name) {
//     errors.push('Field "name" cannot be empty.');
//   }

//   if (!priceETH) {
//     errors.push('Field "priceETH" cannot be empty.');
//   }

//   if (!theme) {
//     errors.push('Field "theme" cannot be empty.');
//   }

//   if (!user) {
//     errors.push('Field "user" cannot be empty.');
//   } else {
//     const existingUser = await User.findById(user);
//     if (!existingUser) {
//       errors.push('User does not exist.');
//     }
//   }

//   if (errors.length > 0) {
//     return res.status(400).json({
//       status: 400,
//       message: 'Validation failed',
//       errors: errors,
//     });
//   }

//   try {
//     const existingCard = await Card.findOne({ name });
//     if (existingCard) {
//       return res.status(400).json({
//         status: 400,
//         message: 'Card with this name already exists.',
//       });
//     }

//     const newCard = new Card({ name, image, priceETH, user, category, tier, theme });
//     await newCard.save();

//     return res.status(201).json({
//       status: 201,
//       message: 'Created card successfully',
//       createdCard: newCard,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: 500,
//       message: 'Failed to create card',
//       reason: error,
//     });
//   }
// });

cardRouter.post("/create", async (req: Request, res: Response) => {
  const {
    name,
    image,
    priceETH,
    user,
    category,
    tier,
    theme,
    colorFrom,
    colorTo,
  } = req.body;

  try {
    const existingCard = await Card.findOne({ name });
    if (existingCard) {
      return res.status(400).json({
        status: 400,
        message: "Card with this name already exists.",
      });
    }

    const existingUser = await User.findById(user);
    if (!existingUser) {
      return res.status(400).json({
        status: 400,
        message: "User does not exist.",
      });
    }

    const newCard = new Card({
      name,
      image,
      priceETH,
      user,
      category,
      tier,
      theme,
      colorFrom,
      colorTo,
    });
    await newCard.save();

    return res.status(201).json({
      status: 201,
      message: "Created card successfully",
      createdCard: newCard,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Failed to create card",
      reason: error,
    });
  }
});

// Delete card or cards
cardRouter.delete("/", async (req: Request, res: Response) => {
  try {
    const { cardIds } = req.body;

    if (!cardIds || !Array.isArray(cardIds) || cardIds.length === 0) {
      return res.status(400).json({
        status: 400,
        message: "Bad request. Please provide an array of card IDs to delete.",
      });
    }

    const result = await Card.deleteMany({ _id: { $in: cardIds } });

    return res.status(200).json({
      status: 200,
      message: "Deleted cards successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "Failed to delete cards",
      reason: error,
    });
  }
});
