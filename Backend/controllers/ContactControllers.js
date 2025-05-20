import userauth from "../models/usermodel.js";

export const searchcontactlist = async (req, res, next) => {
  try {
    const { searchTerm } = req.body;

    if (!searchTerm) {
      return res.status(400).send("searchTerm is required");
    }

    const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex = new RegExp(sanitizedSearchTerm, "i");

    const contacts = await userauth.find({
      $and: [
        { _id: { $ne: req.userId } },
        {
          $or: [
            { firstname: regex },
            { lastname: regex },
            { email: regex }
          ],
        },
      ],
    });

    return res.status(200).json({ contacts });
  } catch (error) {
    console.error("Error in searchcontactlist:", error);
    return res.status(500).send("Internal server error");
  }
};
