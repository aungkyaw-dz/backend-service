import pinataClient from '@pinata/sdk';
import CONFIG from '../config/env';

const pinata = pinataClient(CONFIG.PINATA.KEY, CONFIG.PINATA.SECRET);

export const UploadFilesToPinata =async (file:any, name:any) =>{
  try{
    const options:any = {
        pinataMetadata: {
            name: name,
           
        },
    };
    console.log(file)
    const pinataRes = await pinata.pinFileToIPFS("test", options)
    console.log(pinataRes)
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
    console.log(options)
    const pinataRes = await pinata.pinFromFS(file, options)
    console.log(pinataRes)
    return  pinataRes
  }catch (err){
    console.log(err)
    return(err)
  }
}