import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    // uploads image to cloudinary and returns the url

    const formData = await req.formData();
    const file = formData.get("file") as File;

    const fileBuffer = await file.arrayBuffer();

    const mimeType = file.type;
    const encoding = "base64";
    const base64Data = Buffer.from(fileBuffer).toString("base64");

    // this will be used to upload the file
    const fileUri = "data:" + mimeType + ";" + encoding + "," + base64Data;

    const newFormData = new FormData();

    newFormData.append("file", fileUri);

    newFormData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET!);

    const response = await fetch(process.env.CLOUDINARY_URL!, {
        method: "POST",
        body: newFormData,
    });

    const data = await response.json();

    return NextResponse.json({
        url: data.secure_url,
    });

}