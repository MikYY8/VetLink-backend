import mongoose from "mongoose";

const vaccineScheduleSchema = new mongoose.Schema({
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pet",
    required: true
  },
  vaccineName: {
    type: String,
    required: true
  },
  lastAppliedDate: {
    type: Date,
    required: true
  },
  nextDueDate: {
    type: Date,
    required: true
  }
}, { timestamps: true });

const CalendarioVacunatorio = mongoose.model("VaccineSchedule", vaccineScheduleSchema);
export default CalendarioVacunatorio;
