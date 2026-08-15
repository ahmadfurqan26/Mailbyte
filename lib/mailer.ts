import nodemailer from "nodemailer";
import { decrypt } from "./crypto";

export async function createTransport(account: {
  host: string;
  port: number;
  username: string;
  passwordEnc: string;
  secure: boolean;
}) {
  return nodemailer.createTransport({
    host: account.host,
    port: account.port,
    secure: account.secure,
    auth: {
      user: account.username,
      pass: decrypt(account.passwordEnc)
    }
  });
}

export async function verifySmtp(account: {
  host: string;
  port: number;
  username: string;
  passwordEnc: string;
  secure: boolean;
}) {
  const transport = await createTransport(account);
  await transport.verify();
  transport.close();
  return true;
}
