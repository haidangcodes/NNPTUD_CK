const Interview = require('../schemas/interviews');
const Application = require('../schemas/applications');
const Job = require('../schemas/jobs');

const createInterview = async (req, res) => {
  try {
    const { applicationId, interviewDate, meetingLink, notes } = req.body;

    if (!applicationId || !interviewDate) {
      return res.status(400).json({
        status: 'error',
        message: 'applicationId and interviewDate are required'
      });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Application not found'
      });
    }

    if (application.status !== 'SHORTLISTED') {
      return res.status(400).json({
        status: 'error',
        message: 'Application must be shortlisted before scheduling interview'
      });
    }

    const job = await Job.findById(application.jobId);
    const company = await require('../schemas/companies').findOne({ userId: req.user.id });
    const isAdmin = req.user.role === 'ADMIN';

    if (!isAdmin && (!company || job.companyId.toString() !== company._id.toString())) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    const interview = new Interview({
      applicationId,
      interviewDate,
      meetingLink,
      notes
    });

    await interview.save();

    return res.status(201).json({
      status: 'success',
      data: interview,
      message: 'Interview scheduled successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getInterviewsByApplication = async (req, res) => {
  try {
    const interviews = await Interview.find({ applicationId: req.params.applicationId })
      .sort({ interviewDate: 1 });

    return res.status(200).json({
      status: 'success',
      data: interviews,
      message: 'Interviews retrieved successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const getMyInterviews = async (req, res) => {
  try {
    if (req.user.role === 'CANDIDATE') {
      const applications = await Application.find({ candidateId: req.user.id });
      const applicationIds = applications.map(app => app._id);

      const interviews = await Interview.find({ applicationId: { $in: applicationIds } })
        .populate('applicationId')
        .sort({ interviewDate: 1 });

      return res.status(200).json({
        status: 'success',
        data: interviews,
        message: 'My interviews retrieved successfully'
      });
    } else {
      const interviews = await Interview.find()
        .populate({
          path: 'applicationId',
          populate: {
            path: 'jobId',
            populate: { path: 'companyId' }
          }
        })
        .sort({ interviewDate: 1 });

      const filteredInterviews = interviews.filter(int => {
        if (!int.applicationId) return false;
        if (req.user.role === 'ADMIN') return true;
        const company = int.applicationId.jobId?.companyId;
        return company && company.userId?.toString() === req.user.id.toString();
      });

      return res.status(200).json({
        status: 'success',
        data: filteredInterviews,
        message: 'Interviews retrieved successfully'
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const updateInterview = async (req, res) => {
  try {
    const { interviewDate, meetingLink, notes } = req.body;
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        status: 'error',
        message: 'Interview not found'
      });
    }

    const application = await Application.findById(interview.applicationId);
    const job = await Job.findById(application.jobId);
    const company = await require('../schemas/companies').findOne({ userId: req.user.id });
    const isAdmin = req.user.role === 'ADMIN';

    if (!isAdmin && (!company || job.companyId.toString() !== company._id.toString())) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    if (interviewDate !== undefined) interview.interviewDate = interviewDate;
    if (meetingLink !== undefined) interview.meetingLink = meetingLink;
    if (notes !== undefined) interview.notes = notes;

    await interview.save();

    return res.status(200).json({
      status: 'success',
      data: interview,
      message: 'Interview updated successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        status: 'error',
        message: 'Interview not found'
      });
    }

    const application = await Application.findById(interview.applicationId);
    const job = await Job.findById(application.jobId);
    const company = await require('../schemas/companies').findOne({ userId: req.user.id });
    const isAdmin = req.user.role === 'ADMIN';

    if (!isAdmin && (!company || job.companyId.toString() !== company._id.toString())) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    await Interview.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      status: 'success',
      data: null,
      message: 'Interview deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

module.exports = {
  createInterview,
  getInterviewsByApplication,
  getMyInterviews,
  updateInterview,
  deleteInterview
};
