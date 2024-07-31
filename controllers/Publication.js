const Publication = require("../models/Publications");

exports.addPublication = async (req, res) => {
  try {
    const { title, authors, publicationDate, publicationType, publicationLink, publicationSummary } = req.body;
    if (!title || !authors || !publicationDate || !publicationType || !publicationLink || !publicationSummary) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const publicationDetails = await Publication.create({
      title,
      authors,
      publicationDate,
      publicationType,
      publicationLink,
      publicationSummary
    });
    return res.status(200).json({
      success: true,
      message: "Publication Created Successfully",
      data: publicationDetails
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

exports.showAllPublications = async (req, res) => {
  try {
    const publications = await Publication.find();
    return res.status(200).json({
      success: true,
      publications,
      message: "All Publications",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

exports.updatePublication = async (req, res) => {
  try {
    const { id, title, authors, publicationDate, publicationType, publicationLink, publicationSummary } = req.body;

    const existingPublication = await Publication.findById(id);

    if (!existingPublication) {
      return res.status(404).json({ error: "Publication not found" });
    }

    existingPublication.title = title || existingPublication.title;
    existingPublication.authors = authors || existingPublication.authors;
    existingPublication.publicationDate = publicationDate || existingPublication.publicationDate;
    existingPublication.publicationType = publicationType || existingPublication.publicationType;
    existingPublication.publicationLink = publicationLink || existingPublication.publicationLink;
    existingPublication.publicationSummary = publicationSummary || existingPublication.publicationSummary;

    await existingPublication.save();
    return res.status(200).json({
      success: true,
      message: "Publication updated successfully",
      data: existingPublication
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

exports.deletePublication = async (req, res) => {
  console.log("DELETE Publication API REQUEST............", req.body);
  try {
    const { id } = req.body;

    const existingPublication = await Publication.findByIdAndDelete(id);

    if (!existingPublication) {
      return res.status(404).json({ error: "Publication not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Publication deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
