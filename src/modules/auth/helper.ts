import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  scryptSync,
} from 'crypto';

const algorithm = 'aes-256-cbc';
const secretKey = process.env.SECRET_KEY || 'default_secret_key';
const salt = 'salt';

export function encrypt(text: string): string {
  const key = scryptSync(secretKey, salt, 32);
  const iv = randomBytes(16);
  const cipher = createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export function decrypt(text: string): string {
  const parts = text.split(':');
  if (parts.length !== 2) {
    return text;
  }
  const [ivHex, encryptedText] = parts;
  const key = scryptSync(secretKey, salt, 32);
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
