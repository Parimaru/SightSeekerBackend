const Point = require("../schemas/Point");
const User = require("../schemas/User");

const createPoint = async (req, res) => {
  const { name, coords, address, preference } = req.body;
  try {
    const point = await Point.create({
      name,
      coords,
      address,
      preference,
    });
    if (!point) return res.status(401).json({ msg: "No point found." });
    await point.save();
    const { _id } = req.user;
    const user = await User.findByIdAndUpdate(
      { _id },
      {
        $addToSet: { favorites: point._id },
      },
      { new: true, upsert: true, projection: { password: 0 } }
    )
      .populate({ path: "friends.user", select: "-password" })
      .populate("favorites")
      .populate("travelPlans");

    if (!user) return res.status(200).json({ msg: "No matching user found" });
    else res.status(200).json({ data: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const editPoint = async (req, res) => {
  const { _id, name, coords, address, preference } = req.body;
  try {
    const point = await Point.findByIdAndUpdate(
      { _id },
      {
        name,
        coords,
        address,
        $addToSet: { preference: { $each: preference } },
      },
      { new: true }
    );
    if (!point) return res.status(401).json({ msg: "No point found." });
    res.status(201).json({ data: point });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deletePoint = async (req, res) => {
  const { _id } = req.body;
  try {
    const point = await Point.deleteOne({ _id });
    if (!point) return res.status(401).json({ msg: "No point found." });

    const { _id: userID } = req.user;
    const user = await User.findByIdAndUpdate(
      { _id: userID },
      {
        $pull: { favorites: _id },
      },
      { new: true, projection: { password: 0 } }
    ).populate(["friends.user", "favorites", "travelPlans"]);

    if (!user) return res.status(200).json({ msg: "No matching user found" });
    else
      res.status(200).json({ data: user, msg: `Deleted point with id ${_id}` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// const getPoint = async (req, res) => {
//   const _id = req.params["pointId"];
//   try {
//     const point = await Point.findOne({ _id });
//     if (!point) return res.status(401).json({ msg: "No point found." });
//     res.status(200).json({ data: point });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

// const getAllPoints = async (req, res) => {
//   try {
//     const point = await Point.find();
//     if (!point) return res.status(401).json({ msg: "No point found." });
//     res.status(200).json({ data: point });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

const getMultiplePoints = async (req, res) => {
  const { ids } = req.body;
  const idArray = ids.map((id) => {
    return { _id: id };
  });
  try {
    const points = await Point.find({ $or: [...idArray] });
    if (!points) return res.status(401).json({ msg: "No point found." });
    res.status(200).json({ data: points });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createPoint,
  editPoint,
  deletePoint,getMultiplePoints
  //   getPoint,
  //   getAllPoints,
};
