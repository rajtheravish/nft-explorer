import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import { useAccount, useProvider,useSigner, useContract } from 'wagmi'
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { Network, Alchemy } from 'alchemy-sdk';
import { useEffect, useState } from 'react';
import axios from 'axios';
import NFTCrad from '../src/NFTCards';
import { create } from 'ipfs-http-client'
import { json } from 'stream/consumers';
import { TextField } from '@material-ui/core';

const Home: NextPage = () => {
  const { address, isConnecting, isDisconnected ,isConnected} = useAccount();
  const [nfts, setNfts]:any = useState([]); 
  const [alchemy, setAlchemy]: any = useState(null);
  const [openForm, setOpenForm]:any = useState(false);
  const [title,setTitle] =useState("");
  const [description,setdescription] =useState("");
  const [image,setImage] =useState("");
  const {data:signer, isError, isLoading} = useSigner();

  const nftAddress = "0x223f960AD6238E390dc1EcB4B668E160926BE216";
  const ABI = [{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_owner","type":"address"},{"indexed":true,"internalType":"address","name":"_approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_owner","type":"address"},{"indexed":true,"internalType":"address","name":"_operator","type":"address"},{"indexed":false,"internalType":"bool","name":"_approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_from","type":"address"},{"indexed":true,"internalType":"address","name":"_to","type":"address"},{"indexed":true,"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"_approved","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address","name":"_operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_tokenURI","type":"string"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_operator","type":"address"},{"internalType":"bool","name":"_approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"payable","type":"function"}];

  const contract = useContract({
    address:nftAddress,
    abi:ABI,
    signerOrProvider:signer,
  });

  useEffect(()=> {
    const settings = {
      apiKey: '8J1ga7KYoBL4UqSgTq6ci7C4-jXFkgat', // Replace with your Alchemy API Key.
      network: Network.ETH_GOERLI, // Replace with your network.
    };
    const alchemy = new Alchemy(settings);

    setAlchemy(alchemy);
    },[]);

    useEffect(()=>{
      if(isConnected && alchemy && address){
        getNFTs(address);
      }
    },[isConnected,alchemy,address]);
  
    async function getNFTs(address :string){
      const nftsForOwner = await alchemy.nft.getNftsForOwner(address);
      for(let index= 0;index<nftsForOwner?.ownedNfts.length;index++){
        let currentNFT = nftsForOwner?.ownedNfts[index];
        const metadata = await axios(currentNFT?.tokenUri?.raw);
        nftsForOwner.ownedNfts[index].metadata = metadata.data;
      }
  
      setNfts(nftsForOwner.ownedNfts);
      // console.log(nftsForOwner.ownedNfts);
    }

    const uploadImage = async(e:any)=>{
      const auth ="Basic " +  Buffer.from("2I8mUdhxBRUmCzTW1TMgzb0mp7v" + ":" + "02ca84d511e5c350f16b2176092ae565").toString("base64");
      
      console.log(e.target.files[0]);
      const client = create({ url: "https://ipfs.infura.io:5001",headers:{
        authorization:auth,
      } });
      const response = await client.add(e.target.files[0]);
      setImage(`https://ipfs.io/ipfs/${response.path}`)
      console.log(client,response);
  
    }
    const createNFT = async ()=>{
      if(!title || !description || !image){
        alert("fields are required");
      }
      const metadata:any = {
        title,
        description,
        image,
      };
      console.log(metadata);
  
      const auth ="Basic " +  Buffer.from("2I8mUdhxBRUmCzTW1TMgzb0mp7v" + ":" + "02ca84d511e5c350f16b2176092ae565").toString("base64");
      const client = create({ url: "https://ipfs.infura.io:5001",headers:{
        authorization:auth,
      } });
      const response = await client.add(JSON.stringify(metadata))
      console.log(response, "metadata");
      
      console.log(contract);
      const transaction = await contract?.mint(`https://ipfs.io/ipfs/${response.path}`);
      console.log(transaction);
  
    }

  return (<div className={styles.container}>
    <Head>
      <title>RainbowKit App</title>
      <meta
        name="description"
        content="Generated by @rainbow-me/create-rainbowkit"
      />
     
    </Head>
    <main className={styles.main}>
      <ConnectButton />
     <button onClick={()=>setOpenForm(true)}>Create NFT</button>
    </main>

    {openForm ?<div className={styles.formfield}>
      <h2>Create Your NFT</h2>

      <TextField className={styles.textfield} id="outlined-basic" label="Title" variant="outlined" onChange={(e)=>setTitle(e.target.value)}/>

      <TextField className={styles.textfield} multiline id="outlined-basic" label="Description" variant="outlined"
      onChange={(e)=>setdescription(e.target.value)}/>

      <input className={styles.textfield} type="file" id="nft" name="nft" accept="image/png, image/jpeg" onChange={(e)=>uploadImage(e)}/>

      <button sx={{mt:2}} variant='contained' onClick={createNFT}>Deploy your NFT</button>
    </div>: <div className={styles.main_content}>
      {nfts.length ? nfts?.map((nft:any,index:any)=>(
        
        <div  key={index}>
         <NFTCrad nft={nft} key={index}/>
        </div> 
      )): <div>No NFT Available</div>}

    </div>}
  </div>
);
};

export default Home;
