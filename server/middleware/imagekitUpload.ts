import ImageKit from "imagekit";
import CONFIG from '../config/env';

const imagekit = new ImageKit({
                      publicKey : CONFIG.IMAGEKIT.PUBLIC|| "",
                      privateKey : CONFIG.IMAGEKIT.PRIVATE|| "",
                      urlEndpoint : CONFIG.IMAGEKIT.ENDPOINT|| ""
                    });


export const UploadImage =async (file:any) =>{
  try{
    const imageUrl = await imagekit.upload({
        file : file.data, //required
        fileName : file.name, //required
      },)
    return  imageUrl.thumbnailUrl
  }catch (err){
    console.log(err)
    return(err)
  }
}