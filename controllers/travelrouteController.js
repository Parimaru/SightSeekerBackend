const TravelPlan = require("../schemas/TravelPlan");
const User = require("../schemas/User");

const createTravelplan = async (req, res) => {
  const { name, startDate, endDate, creator, members, selectedPoints } =
    req.body;
  try {
    const travelplan = await TravelPlan.create({
      name,
      "dates.startDate": startDate,
      "dates.endDate": endDate,
      creator,
      members,
      selectedPoints,
    });
    await travelplan.save();
    const { _id: userID } = req.user;
    const user = await User.findByIdAndUpdate(
      { _id: userID },
      {
        $addToSet: { travelPlans: travelplan._id },
      },
      { new: true, projection: { password: 0 } }
    )
      .populate(["friends.user", "favorites", "travelPlans"])
      .exec();
    console.log("######USER#########", user.travelPlans[0].members);
    if (!user) return res.status(200).json({ msg: "No matching user found" });
    else res.status(200).json({ data: user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const editTravelplan = async (req, res) => {
  const { _id, name, startDate, endDate, members, selectedPoints } = req.body;
  try {
    const travelplan = await TravelPlan.findByIdAndUpdate(
      { _id },
      {
        name,
        "dates.startDate": startDate,
        "dates.endDate": endDate,
        $addToSet: { members: { $each: members } },
        $addToSet: { selectedPoints: { $each: selectedPoints } },
      },
      { new: true }
    );
    if (!travelplan)
      return res.status(401).json({ msg: "No travelplan found." });
    res.status(201).json({ data: travelplan });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// const getTravelplan = async () => {
//   const { _id } = req.body;
//   try {
//     const travelplan = await Travelplan.findOne({ _id });
//     if (!travelplan)
//       return res.status(401).json({ msg: "No travelplan found." });
//     res.status(200).jason({ data: travelplan });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

const deleteTravelplan = async (req, res) => {
  const { _id } = req.body;
  try {
    const travelplan = await TravelPlan.deleteOne({ _id });
    if (!travelplan)
      return res.status(401).json({ msg: "No travelplan found." });

    const { _id: userID } = req.user;
    const user = await User.findByIdAndUpdate(
      { _id: userID },

      {
        $pull: { travelPlans: _id },
      },
      { new: true, projection: { password: 0 } }
    ).populate(["friends.user", "favorites", "travelPlans"]);
    if (!user) return res.status(200).json({ msg: "No matching user found" });
    res
      .status(200)
      .json({ data: user, msg: `Deleted travelplan with id ${_id}` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createTravelplan,
  editTravelplan,
  deleteTravelplan,
  // getTravelplan,
};
