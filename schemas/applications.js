const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cvUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['APPLIED', 'REVIEWING', 'SHORTLISTED', 'REJECTED'],
    default: 'APPLIED'
  }
}, {
  timestamps: true
});

applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
