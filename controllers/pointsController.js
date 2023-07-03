const Point = require("../schemas/Point");
const User = require("../schemas/User");

const createPoint = async (req, res) => {
  const { name, coordinates, address, pointTypes } = req.body;
  try {
    const point = await Point.create({
      name,
      coordinates,
      address,
      pointTypes,
    });
    if (!point) return res.status(401).json({ msg: "No point found." });

    const { _id } = req.user;
    const user = await User.findByIdAndUpdate(
      { _id },
      {
        $addToSet: { favorites: point._id },
      },
      { new: true, projection: { password: 0 } }
    )
      .populate("friends.user", "userName avatar _id name")
      .populate("favorites", "name coordinates address pointTypes");

    if (!user) return res.status(200).json({ msg: "No matching user found" });
    else res.status(200).json({ data: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const editPoint = async (req, res) => {
  const { _id, name, coordinates, address, pointTypes } = req.body;
  try {
    const point = await Point.findByIdAndUpdate(
      { _id },
      {
        name,
        coordinates,
        address,
        $addToSet: { pointTypes: { $each: pointTypes } },
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
    )
      .populate("friends.user", "userName avatar _id name")
      .populate("favorites", "name coordinates address pointTypes");

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

module.exports = {
  createPoint,
  editPoint,
  deletePoint,
  //   getPoint,
  //   getAllPoints,
};
