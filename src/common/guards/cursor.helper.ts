export function encodeCursor(date: string, id: string) {
  return Buffer.from(`${date}|${id}`).toString('base64');
}
export function decodeCursor(cursor: string) {
  const s = Buffer.from(cursor, 'base64').toString();
  const [date, id] = s.split('|');
  return { date, id };
}
