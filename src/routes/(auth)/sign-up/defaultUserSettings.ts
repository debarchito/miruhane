import { generateToken } from "$lib/server/auth";

export default function (userId: string) {
  return [
    {
      id: generateToken(),
      userId,
      key: "model-stt",
      value: "model:whisper-base",
    },
    {
      id: generateToken(),
      userId,
      key: "model-context",
      value: "model:gemini-1.5-flash",
    },
    {
      id: generateToken(),
      userId,
      key: "model-tts",
      value: "service:speecify",
    },
  ];
}
