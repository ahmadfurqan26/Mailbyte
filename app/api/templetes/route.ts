import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
const [total,sent,queued,failed,accounts,templates] = await Promise.all([
prisma.emailMessage.count(),
prisma.emailMessage.count({where:{status:"SENT"}}),
prisma.emailMessage.count({where:{status:"QUEUED"}}),
prisma.emailMessage.count({where:{status:"FAILED"}}),
prisma.smtpAccount.findMany({select:{id:true,name:true,host:true,port:true,fromEmail:true,secure:true}}),
prisma.emailTemplate.findMany({orderBy:{createdAt:"desc"}})
]);
return NextResponse.json({stats:{total,sent,queued,failed},accounts,templates});
}
