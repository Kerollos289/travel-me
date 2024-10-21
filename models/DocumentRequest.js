const mongoose = require("mongoose");

const documentRequestSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    documentUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const DocumentRequest = mongoose.model(
  "DocumentRequest",
  documentRequestSchema
);
module.exports = DocumentRequest;
