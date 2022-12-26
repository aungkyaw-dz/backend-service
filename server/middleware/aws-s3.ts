import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
const fs = require('fs')

const s3 = new S3Client({
  region: 'ap-southeast-1',
  credentials: {
    accessKeyId: String(process.env.AWS_ACCESS_KEY_ID),
    secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY)
  }
})

export const UploadFilesToAWS = async (file:any) =>{
  const params:any = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: file.name,
    Body: file.data,
  }
  try{
    const s3Url = await s3.send(new PutObjectCommand(params));
    return s3Url
  }catch (err){
    console.log(err)
    return(err)
  }
}