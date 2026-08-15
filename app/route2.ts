import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createTransport } from "@/lib/mailer";

const schema = z.object({
  smtpId:z.string().min(1),
  to:z.string().email(),
  subject:z.string().min(1).max(998),
  text:z.string().optional(),
  html:z.string().optional()
});

export async function POST(req:Request) {
  let messageId:string|undefined;
  try {
    const input = schema.parse(await req.json());
    const account = await prisma.smtpAccount.findUnique({where:{id:input.smtpId}});
    if (!account) return NextResponse.json({error:"SMTP account not found."},{status:404});

    const message = await prisma.emailMessage.create({
      data:{
        smtpId:account.id, to:input.to, subject:input.subject,
        text:input.text || null, html:input.html || null,
        status:"SENDING", attempts:1
      }
    });
    messageId = message.id;

    const transport = await createTransport(account);
    const info = await transport.sendMail({
      from: account.fromName ? `"${account.fromName}" <${account.fromEmail}>` : account.fromEmail,
      to: input.to,
      subject: input.subject,
      text: input.text || undefined,
      html: input.html || undefined
    });
    transport.close();

    await prisma.emailMessage.update({
      where:{id:message.id},
      data:{status:"SENT",sentAt:new Date(),messageId:info.messageId}
    });
    return NextResponse.json({id:message.id,status:"SENT"});
  } catch (e:any) {
    if (messageId) {
      await prisma.emailMessage.update({
        where:{id:messageId},
        data:{status:"FAILED",error:String(e?.message || e)}
      }).catch(()=>{});
    }
    return NextResponse.json({error:e?.message || "Email sending failed."},{status:400});
  }
}
