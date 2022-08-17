import AWS = require('aws-sdk');
const fs = require('fs')

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

export const UploadFilesToAWS = async (file:any) =>{
  const params:any = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: file.name,
    Body: file.data,
  }
  try{
    const s3Url = await s3.upload(params).promise() 
    console.log(s3Url)
    return s3Url
  }catch (err){
    console.log(err)
    return(err)
  }
}