// controllers/travelJobAccounts.js
exports.addItineraryToAccount = async (req, res) => {
  try {
    const { username } = req.params;
    const { itineraryName } = req.body;

    const account = await travelJobAccount.findOneAndUpdate(
      { username },
      { $push: { itinerariesArray: itineraryName } },
      { new: true }
    );

    if (!account) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Itinerary added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
