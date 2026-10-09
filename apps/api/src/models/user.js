import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
    targetRole: { type: String, default: 'Full Stack Developer' },
    skills: { type: [String], default: [] },
    experienceLevel: {
      type: String,
      enum: ['Student/Fresher', 'Junior', 'Mid-Level', 'Senior'],
      default: 'Student/Fresher',
    },
    bio: { type: String, default: '' },
  },
  { timestamps: true }
);

// Hash password before saving if modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed database password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', userSchema);