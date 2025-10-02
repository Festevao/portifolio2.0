import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './[...nextauth]';

interface DebugSessionResponse {
  success: boolean;
  session?: {
    hasSession: boolean;
    hasUser: boolean;
    hasAccessToken: boolean;
    accessTokenLength?: number;
    userEmail?: string | null;
    userName?: string | null;
    accessTokenPreview?: string | null;
  };
  message?: string;
}

/**
 * API para debug da sessão do usuário
 * GET /api/auth/user
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<DebugSessionResponse>) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (session) {
      return res.status(200).json({
        success: true,
        session: {
          hasSession: true,
          hasUser: !!session.user,
          hasAccessToken: !!session.accessToken,
          accessTokenLength: session.accessToken?.length,
          userEmail: session.user?.email,
          userName: session.user?.name,
          accessTokenPreview: session.accessToken ? session.accessToken.substring(0, 3) + '...' : null
        }
      });
    } else {
      return res.status(200).json({
        success: true,
        session: {
          hasSession: false,
          hasUser: false,
          hasAccessToken: false,
        },
        message: 'No active session found.'
      });
    }
  } catch (error) {
    console.error('Error in /api/auth/user:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}
