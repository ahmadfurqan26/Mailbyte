import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/crypto";
import { verifySmtp } from "@/lib/mailer";

const schema = z.object({
name:z.string().min(1),
host:z.string().min(1),
port:z.number().int().min(1).max(65535),
username:z.string().min(1),
password:z.string().min(1),
secure:z.boolean().default(false),
fromName:z.string().optional(),
fromEmail:z.string().email()
});

export async function POST(req:Request) {
try {
const input = schema.parse(await req.json());
const temp = {...input, passwordEnc:encrypt(input.password)};
await verifySmtp({
host:temp.host, port:temp.port, username:temp.username,
passwordEnc:temp.passwordEnc, secure:temp.secure
});
const account = await prisma.smtpAccount.create({
data:{
name:input.name, host:input.host, port:input.port,
username:input.username, passwordEnc:temp.passwordEnc,
secure:input.secure, fromName:input.fromName, fromEmail:input.fromEmail
},
select:{id:true,name:true,host:true,port:true,fromEmail:true}
});
return NextResponse.json(account);
} catch (e:any) {
return NextResponse.json({error:e?.message || "SMTP configuration failed."},{status:400});
}
}


