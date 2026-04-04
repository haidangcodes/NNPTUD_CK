const Company = require('../schemas/companies');

const getMyCompany = async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user.id });

    if (!company) {
      return res.status(404).json({
        status: 'error',
        message: 'Company not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: company,
      message: 'Company retrieved successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const createOrUpdateMyCompany = async (req, res) => {
  try {
    const { name, description, website, address, logoUrl } = req.body;

    // SỬA Ở ĐÂY: req.userId -> req.user.id
    let company = await Company.findOne({ userId: req.user.id });

    if (!company) {
      // SỬA Ở ĐÂY: req.userId -> req.user.id
      company = new Company({ userId: req.user.id });
    }

    if (name !== undefined) company.name = name;
    if (description !== undefined) company.description = description;
    if (website !== undefined) company.website = website;
    if (address !== undefined) company.address = address;
    if (logoUrl !== undefined) company.logoUrl = logoUrl;

    await company.save();

    return res.status(200).json({
      status: 'success',
      data: company,
      message: 'Company saved successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        status: 'error',
        message: 'Company not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: company,
      message: 'Company retrieved successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getAllCompanies = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const companies = await Company.find(filter).populate('userId', 'email');

    return res.status(200).json({
      status: 'success',
      data: companies,
      message: 'Companies retrieved successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const approveCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        status: 'error',
        message: 'Company not found'
      });
    }

    company.status = 'APPROVED';
    await company.save();

    return res.status(200).json({
      status: 'success',
      data: company,
      message: 'Company approved successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const rejectCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        status: 'error',
        message: 'Company not found'
      });
    }

    company.status = 'REJECTED';
    await company.save();

    return res.status(200).json({
      status: 'success',
      data: company,
      message: 'Company rejected'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        status: 'error',
        message: 'Company not found'
      });
    }

    const isOwner = company.userId.toString() === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only delete your own company'
      });
    }

    await Company.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      status: 'success',
      data: null,
      message: 'Company deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  getMyCompany,
  createOrUpdateMyCompany,
  getCompanyById,
  getAllCompanies,
  approveCompany,
  rejectCompany,
  deleteCompany
};
