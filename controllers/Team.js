const Team = require("../models/Teams");
const Profile = require("../models/Profile");

exports.addTeam = async (req, res) => {
    try {
      const { name, peoples } = req.body;
      if (!name || !peoples || !Array.isArray(peoples)) {
        return res.status(400).json({ error: "All fields are required and 'peoples' should be an array of profile IDs" });
      }
      
      // Check if all profile IDs in peoples exist
      const profilesExist = await Profile.find({ '_id': { $in: peoples } });
      if (profilesExist.length !== peoples.length) {
        return res.status(400).json({ error: "Some profiles do not exist" });
      }
  
      const team = await Team.create({
        name,
        peoples,
      });
  
      return res.status(200).json({
        success: true,
        message: "Team Created Successfully",
        team,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  

  exports.showAllTeams = async (req, res) => {
    try {
      const teams = await Team.find().populate('peoples', 'name email'); // Adjust the fields to populate as needed
      return res.status(200).json({
        success: true,
        teams,
        message: "All Teams",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  

  exports.updateTeam = async (req, res) => {
    try {
      const { teamId, name, peoples } = req.body;
  
      // Find the existing team by ID
      const existingTeam = await Team.findById(teamId);
      
      if (!existingTeam) {
        return res.status(404).json({ error: "Team not found" });
      }
  
      // Update the name if provided
      if (name) {
        existingTeam.name = name;
      }
  
      // Update the peoples array if provided
      if (peoples) {
        if (!Array.isArray(peoples)) {
          return res.status(400).json({ error: "'peoples' should be an array of profile IDs" });
        }
  
        // Check if all profile IDs in peoples exist
        const profilesExist = await Profile.find({ '_id': { $in: peoples } });
        if (profilesExist.length !== peoples.length) {
          return res.status(400).json({ error: "Some profiles do not exist" });
        }
  
        existingTeam.peoples = peoples;
      }
  
      // Save the updated team
      const updatedTeam = await existingTeam.save();
      return res.status(200).json({
        success: true,
        updatedTeam,
        message: "Team Updated Successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
  

exports.deleteTeam = async (req, res) => {
  try {
    const {teamId} =req.body;
    const team = await Team.findByIdAndDelete(teamId);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }
   
    return res.status(200).json({
      success: true,
      message: "Team Deleted Successfully",
    });
    }
    catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
}