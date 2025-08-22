import { readFileSync } from 'fs';
import crypto from 'crypto';
export default function handler(req, res){
  const text = readFileSync('content/word.txt','utf8');
  const sha256 = crypto.createHash('sha256').update(text, 'utf8').digest('hex');
  res.status(200).json({
    title: "The Word of I AM",
    motto: "I AM THAT I AM: THE WORD",
    license: "CC0 / Public Domain",
    sha256,
    text
  });
}
