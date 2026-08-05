import { Request, Response } from 'express';
import { connectToDatabase } from '../lib/db/mongodb.js';
import { User, TestAttempt } from '../lib/db/models.js';

export async function handleSignup(req: Request, res: Response) {
  const { name, phone, classLevel } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ success: false, error: 'Name and phone number are required.' });
  }

  const cleanPhone = String(phone).trim();
  const cleanName = String(name).trim();
  const targetClass = classLevel || '10';

  try {
    const db = await connectToDatabase();
    if (db) {
      const existing = await User.findOne({ phone: cleanPhone } as any);
      if (existing) {
        return res.status(400).json({
          success: false,
          error: 'Phone number already registered. Please log in directly.'
        });
      }

      const defaultCourseTitle = `Class ${targetClass} Board English Mastery Target Batch`;
      const newUser = await User.create({
        name: cleanName,
        phone: cleanPhone,
        classLevel: targetClass,
        enrolledCourses: [
          {
            courseSlug: `class-${targetClass}-target`,
            courseTitle: defaultCourseTitle,
            enrolledAt: new Date()
          }
        ]
      });

      return res.json({
        success: true,
        user: {
          id: newUser._id.toString(),
          name: newUser.name,
          phone: newUser.phone,
          classLevel: newUser.classLevel,
          enrolledCourses: newUser.enrolledCourses,
          createdAt: newUser.createdAt
        }
      });
    }
  } catch (err: any) {
    console.error('MongoDB signup error:', err);
  }

  const fallbackUser = {
    id: 'usr_' + cleanPhone,
    name: cleanName,
    phone: cleanPhone,
    classLevel: targetClass,
    enrolledCourses: [
      {
        courseSlug: `class-${targetClass}-target`,
        courseTitle: `Class ${targetClass} Target Batch`,
        enrolledAt: new Date()
      }
    ],
    createdAt: new Date()
  };

  return res.json({ success: true, user: fallbackUser });
}

export async function handleLogin(req: Request, res: Response) {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ success: false, error: 'Mobile number is required.' });
  }

  const cleanPhone = String(phone).trim();

  try {
    const db = await connectToDatabase();
    if (db) {
      const userDoc = await User.findOne({ phone: cleanPhone } as any);
      if (!userDoc) {
        return res.status(404).json({
          success: false,
          error: 'Yeh mobile number registered nahi hai. Pehle Sign Up (Register) karein.'
        });
      }

      return res.json({
        success: true,
        user: {
          id: userDoc._id.toString(),
          name: userDoc.name,
          phone: userDoc.phone,
          classLevel: userDoc.classLevel,
          enrolledCourses: userDoc.enrolledCourses,
          createdAt: userDoc.createdAt
        }
      });
    }
  } catch (err: any) {
    console.error('MongoDB login error:', err);
  }

  // If DB connection was not active, return not registered error unless handled client side
  return res.status(404).json({
    success: false,
    error: 'Yeh mobile number registered nahi hai. Pehle Sign Up (Register) karein.'
  });
}

export async function handleGetUserProfile(req: Request, res: Response) {
  const { userId } = req.params;

  try {
    const db = await connectToDatabase();
    if (db) {
      let userDoc: any = null;
      if (userId.match(/^[0-9a-fA-F]{24}$/)) {
        userDoc = await (User as any).findById(userId);
      }
      if (!userDoc) {
        userDoc = await User.findOne({ phone: userId } as any);
      }

      const attempts = await TestAttempt.find({
        $or: [{ userId: userId }, { userPhone: userId }, { userId: userDoc?._id?.toString() }]
      } as any)
        .sort({ submittedAt: -1 } as any)
        .lean();

      return res.json({
        success: true,
        user: userDoc
          ? {
              id: userDoc._id.toString(),
              name: userDoc.name,
              phone: userDoc.phone,
              classLevel: userDoc.classLevel,
              enrolledCourses: userDoc.enrolledCourses,
              createdAt: userDoc.createdAt
            }
          : null,
        attempts: attempts.map((att: any) => ({
          id: att._id.toString(),
          testSlug: att.testSlug,
          testTitle: att.testTitle,
          classLevel: att.classLevel,
          score: att.score,
          totalQuestions: att.totalQuestions,
          accuracyPercent: att.accuracyPercent,
          questions: att.questions,
          submittedAt: att.submittedAt
        }))
      });
    }
  } catch (err: any) {
    console.error('MongoDB get user error:', err);
  }

  return res.json({
    success: true,
    user: null,
    attempts: []
  });
}
