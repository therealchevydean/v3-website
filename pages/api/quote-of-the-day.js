import cutdowns from '../../content/cutdowns.json';
export default function handler(req, res){
  const now = new Date();
  const dayIndex = Math.floor((Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())/(24*3600*1000))) % cutdowns.length;
  const quote = cutdowns[dayIndex];
  res.status(200).json({ quote, motto: 'I AM THAT I AM  THE WORD', index: dayIndex });
}
