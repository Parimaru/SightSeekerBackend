const TravelPlan = require("../schemas/TravelPlan");

const createTravelplan = async (req, res) => {
  const { name, startDate, endDate, members, selectedPoints } = req.body;
  try {
    const travelplan = await TravelPlan.create({
      name,
      "dates.startDate": startDate,
      "dates.endDate": endDate,
      creator,
      $addToSet: { members: { $each: members } },
      $addToSet: { selectedPoints: { $each: selectedPoints } },
    })
      .populate("members", "userName _id name")
      .populate("selectedPoints", "name _id address coordinates");
    if (!travelplan)
      return res.status(401).json({ msg: "No travelplan found." });
    res.status(201).json({ data: travelplan });
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

const getTravelplan = async () => {
  const { _id } = req.body;
  try {
    const travelplan = await Travelplan.findOne({ _id });
    if (!travelplan)
      return res.status(401).json({ msg: "No travelplan found." });
    res.status(200).jason({ data: travelplan });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteTravelplan = async (req, res) => {
  const { _id } = req.body;
  try {
    const travelplan = await TravelPlan.deleteOne({ _id });
    if (!travelplan)
      return res.status(401).json({ msg: "No travelplan found." });
    res.status(201).json({ msg: `Deleted travelplan with id ${_id}` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createTravelplan,
  editTravelplan,
  deleteTravelplan,
  getTravelplan,
};
