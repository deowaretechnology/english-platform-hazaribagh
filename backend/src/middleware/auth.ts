import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  userPhone?: string;
  userId?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const userIdHeader = req.headers['x-user-id'] || req.headers['x-user-phone'];

  if (userIdHeader) {
    req.userId = String(userIdHeader);
    return next();
  }

  if (authHeader && authHeader.startsWith('Bearer ')) {
    req.userId = authHeader.substring(7);
    return next();
  }

  if (req.body && req.body.userId) {
    req.userId = String(req.body.userId);
    return next();
  }

  return res.status(401).json({
    success: false,
    error: 'Authentication required. Please log in to access this test.',
  });
}
