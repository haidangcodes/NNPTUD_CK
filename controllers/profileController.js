const Profile = require('../schemas/profiles');

const getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.user.id }).populate('userId', 'email role');

    if (!profile) {
      return res.status(404).json({
        status: 'error',
        message: 'Profile not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: profile,
      message: 'Profile retrieved successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const { fullName, phone, address, skills, cvUrl } = req.body;

    let profile = await Profile.findOne({ userId: req.user.id });

    if (!profile) {
      profile = new Profile({ userId: req.user.id });
    }

    if (fullName !== undefined) profile.fullName = fullName;
    if (phone !== undefined) profile.phone = phone;
    if (address !== undefined) profile.address = address;
    if (skills !== undefined) profile.skills = skills;
    if (cvUrl !== undefined) profile.cvUrl = cvUrl;

    await profile.save();

    return res.status(200).json({
      status: 'success',
      data: profile,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile
};
