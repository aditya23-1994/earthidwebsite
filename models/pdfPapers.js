const mongoose = require('mongoose');

const pdfPapersSchema = new mongoose.Schema({
  name: {
    type: String,
    requried: [true, 'A pdf file must have a name'],
    maxlength: [200, 'The name should not exceed more than 200 words'],
  },
  pdf: {
    type: String,
    requried: [true, 'A pdf must be present'],
  },
});

const PdfPaper = mongoose.model('PdfPaper', pdfPapersSchema);

module.exports = PdfPaper;
