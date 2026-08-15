import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
name:z.string().min(1),
subject:z.string().min(1),
html:z.string().min(1),
text:z.string().optional()
});

export async function GET() {
return NextResponse.json(await prisma.emailTemplate.findMany({orderBy:{createdAt:"desc"}}));
}

export async function POST(req:Request) {
try {
const data = schema.parse(await req.json());
return NextResponse.json(await prisma.emailTemplate.create({data}));
} catch(e:any) {
return NextResponse.json({error:e?.message || "Invalid template."},{status:400});
}
}
