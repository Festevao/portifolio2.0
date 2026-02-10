import type { NextApiRequest, NextApiResponse } from "next";

const mockMessages = [
  {
    _id: "1",
    from: "5511999999999",
    type: "text",
    text: "Oi!",
    createdAt: new Date()
  },
  {
    _id: "2",
    from: "5511988888888",
    type: "audio",
    audioUrl: "https://cdn.w-api.app/audio/test.ogg",
    createdAt: new Date()
  }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).json(mockMessages);
}
