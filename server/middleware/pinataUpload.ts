import pinataClient from '@pinata/sdk';
import CONFIG from '../config/env';

const pinata = new pinataClient(CONFIG.PINATA.KEY, CONFIG.PINATA.SECRET);

export const UploadFilesToPinata =async (file:any, name:any) =>{
  try{
    const options:any = {
        pinataMetadata: {
            name: name,
           
        },
    };
    console.log(file)
    const pinataRes = await pinata.pinFileToIPFS("test", options)
    return  pinataRes
  }catch (err){
    console.log(err)
    return(err)
  }
}

export const UploadFSToPinata =async (file:any, name:any) =>{
  try{
    const options:any = {
        pinataMetadata: {
            name: name,
           
        },
    };
    const pinataRes = await pinata.pinFromFS(file, options)
    return  pinataRes
  }catch (err){
    console.log(err)
    return(err)
  }
}

export const UploadJsonToPinata = async (data:any, name:any) =>{
  try{
    const options:any = {
        pinataMetadata: {
            name: name,
           
        },
    };
    const pinataRes = await pinata.pinJSONToIPFS(data, options)
    return  pinataRes
  }catch (err){
    console.log(err)
    return(err)
  }
}