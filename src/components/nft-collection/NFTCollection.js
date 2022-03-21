import Web3 from 'web3'
import React, { useState, useEffect } from 'react'
import './NFTCollection.css'
import {
  Typography,
  Button,
  IconButton,
  Grid,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
} from '@material-ui/core'
import Avatar from '@mui/material/Avatar'
import { red } from '@mui/material/colors'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { ethers } from 'ethers'

import { Link } from 'react-router-dom'
import { apiKey } from '../../APIKEYS'
import CircularStatic from '../commons/CircularProgressWithLabel'
import CustomizedProgressBars from '../../components/progress-bar/ProgressBar'
import revenueClaimABI from '../../../src/abis/RevenueClaim.json'
const COLORS = {
  Diamond: '5px solid red',
  Silver: '5px solid blue',
  'Patium Hands': '5px solid black',
}

function NFTCollection({
  account,
  usdcContract,
  contractProjects,
  aaveStakedShareContract,
  anchorStakedShareContract,
  mockAnchorToken,
  mockAnchorTokenContract,
  faucetContract,
  feesOracleContract,
  mockAaveTokenContract,
  mockAaveTokenAddress,
  AaveAddress,
  revenueClaimContract,
  claiming,
}) {
  const axios = require('axios')
  const [loading, setLoading] = useState(false)
  const [swapsData, setSwapsData] = useState([])
  const [myNFTS, setMyNFTS] = useState([])

  const [userHistory, setUserHistory] = useState([])
  const [claimableNFTS, setClaimableNFTS] = useState([])
  const [allClaimableInfo, setAllClaimableInfo] = useState('')
  const userWallet = '0x9B6efdCFcdfb9825f805C2FE2f7f87eBBe76b253'
  // const userWallet = '0xAF67cbD8fb00759C3b4667beAcfBB3600e25476A'

  const userNFTs = async () => {
    let account = '0xf4eA652F5B7b55f1493631Ea4aFAA63Fe0acc27C'
    if (account) {
      // http://3.83.53.59:3000/user/0xf4eA652F5B7b55f1493631Ea4aFAA63Fe0acc27C
      let myNFTs = await axios.get(`http://3.83.53.59:3000/user/${account}`, {
        params: {},
        headers: {
          'Content-Type': 'application/json',
        },
      })
      setMyNFTS(myNFTs.data.nfts)
    }
  }

  const checkRewards = async (nft) => {
    console.log('eee', nft)
    // add here the contract

    // tokenId, uint256 reward, bytes32[] memory merkleProof
    const tokenId = 2
    const reward = 2
    const merkleProof = 2

    // const claimRewards = await revenueClaimContract.methods
    // .claim((amount).toString(), (1).toString())
    // .send({ from: account })
    // console.log('🚀  claimRewards', claimRewards)

    // ========================
    // to claim you need to call this function
    // function claim(uint256 tokenId, uint256 reward, bytes32[] memory merkleProof) external virtual nonReentrant {
    //         _isInitialized();
    //         require(IERC721(_nft).ownerOf(tokenId) == msg.sender, "your are not the owner of ERC721");
    //         require(!_claimed[tokenId], "reward alrready claimed");
    //         require(_verifyClaim(tokenId, reward, merkleProof), "merkle proof fail");
    //         uint256 amount = ( reward * _revenue ) / granularity;
    //         require(_transferToken(msg.sender, amount), "reward transfer fail");
    //         _claimed[tokenId] = true;
    //         emit Claimed(msg.sender, tokenId, amount);
    //     }
    // is in the RevenueClaim Contract
    // the parameter are 3: NFTID, Reward Amount, Proof
  }

  const loadMyCollection = async () => {
    const covalentAPI = 'ckey_d4115699196e4d238fa138e180c'
    try {
      const historyResult = await fetch(
        `https://api.covalenthq.com/v1/137/address/${userWallet}/balances_v2/?nft=true&key=${covalentAPI}`,
      )
      // json address & items listing all erc20 or 21
      const { data } = await historyResult.json()

      if (data) {
        setUserHistory(data.items[0].nft_data)
        setLoading(false)
      }
    } catch (error) {
      setLoading(true)
      console.error(error)
    }
  }

  useEffect(() => {
    const loadSwapList = async () => {
      try {
        setLoading(true)
        if (userWallet) loadMyCollection()
        let cids = await fetch('https://api.nft.storage', {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        })
        cids = await cids.json()
        const temp = []
        for (let cid of cids.value) {
          if (cid?.cid) {
            let data = await fetch(
              `https://ipfs.io/ipfs/${cid.cid}/metadata.json`,
            )
            data = await data.json()
            let dataSplit = data.description.split(',')
            data.description = dataSplit[0]
            data.userAccount = dataSplit[1]

            const getImage = (ipfsURL) => {
              if (!ipfsURL) return
              ipfsURL = ipfsURL.split('://')
              return 'https://ipfs.io/ipfs/' + ipfsURL[1]
            }
            data.image = await getImage(data.image)
            data.cid = cid.cid
            data.created = cid.created
            temp.push(data)
          }
        }
        setSwapsData(temp)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
    loadSwapList()
    userNFTs()
    claimingRewards()
  }, [])

  const checkMyRewards = async (nft) => {
    console.log('🚀nft', nft)
    const revenueAddress = nft.reward.contract
    const web3 = window.web3
    const revenueClaimContract = new web3.eth.Contract(
        revenueClaimABI,
        revenueAddress,
      )

//       NFTId: "5"
// project: "0x59fCcFbE3511B0f1286D54935258cB93AcC18E81"
// proof:
// nftProof:
// leaf: "0x52bc1c60187c0cabd57827045211b6f4987c315519dd3df81d5a24251d22f8bf"
// proof: Array(4)
// 0: "0x638f3a3c72c463424ba6a5940a41bd4f111a0a44ceb8532ba6ef6a09a0fd1557"
// 1: "0x07a2e5e82f55d4a5358b6cc8dda32fa699c12078e8b53aaa14a47c9a566ebc86"
// 2: "0x4140cb466558f5c054dedbd6d8dd014e264c2e5b0923f2b597cc6ea0e8c4f5e1"
// 3: "0x6db6aeef10e6a0925d564ca13f8a360235074c61fa5ac36d5972163a4656113d"
// length: 4
// [[Prototype]]: Array(0)
// reward: "13888"
// [[Prototype]]: Object
// [[Prototype]]: Object
// reward: {contract: '0xD7a30A0F02BE26a2Cec825B9aF1657fCb2e2057b', blockNumber: 30535867, token: {…}}
// [[Prototype]]: Object
      const tokenId = parseInt(nft.NFTId)
      const reward = parseInt(nft.proof.nftProof.reward)
      const proof = nft.proof.nftProof.proof
    const claim = await revenueClaimContract.methods.claim(tokenId,reward, proof).send({ from: account })
    console.log(' claim', claim)
  }

  const claimingRewards = async () => {
    const axios = require('axios')

    const projectAddress = '0x59fCcFbE3511B0f1286D54935258cB93AcC18E81'
    // http://3.83.53.59:3000/claim/:userAddress
    const claimableRn = await axios.get(
      `http://3.83.53.59:3000/claim/${account}`,
      {
        withCredentials: false,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods':
            'GET, POST, PATCH, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers':
            'Origin, Content-Type, X-Auth-Token, Authorization, Accept,charset,boundary,Content-Length',
        },
      },
    )
    const revenuesFromClaimables = claimableRn.data.claims[0].revenues
    // console.log("44Claimables", claimableRn.data)
    setClaimableNFTS(revenuesFromClaimables)

    // for loop  on revenuesFromClaimables call proof for each revenue fill the card info then on click call the smartcotract because we have the proof
    const tempArr = []
    for (let i = 0; i < revenuesFromClaimables.length; i++) {
      const blockNumber = revenuesFromClaimables[i].blockNumber
      const project = claimableRn.data.claims[0].project
      const NFTId = claimableRn.data.claims[0].nftId
      let proofRewards = await axios.get(
        `http://3.83.53.59:3000/merkle/${project}/${blockNumber}/${NFTId}`,
        {
          withCredentials: false,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods':
              'GET, POST, PATCH, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers':
              'Origin, Content-Type, X-Auth-Token, Authorization, Accept,charset,boundary,Content-Length',
          },
        },
      )
      console.log('proofRewards', proofRewards.data)
      let obj = {
        proof: proofRewards.data,
        reward: revenuesFromClaimables[i],
        project: project,
        NFTId: NFTId,
      }
      tempArr.push(obj)
    }
    setAllClaimableInfo(tempArr)


    // setLoadNFTs(projectsNFTS.data)

    // call the API to get proof
    // const proof = await
    // NFTID, Reward Amount, Proof => http://localhost:3000/merkle/0x59fCcFbE3511B0f1286D54935258cB93AcC18E81/30480194/2
  }

  console.log('**', allClaimableInfo)
  const img = {
    '0x59fCcFbE3511B0f1286D54935258cB93AcC18E81':
      'https://raw.githubusercontent.com/electrone901/revenue-share-frontend/main/src/images/projects/aaveNFT.jpg',
    '0x10B3Ce8b9B1b6777EE9d798119Ef7Be9BD38EB83':
      'https://raw.githubusercontent.com/electrone901/revenue-share-frontend/main/src/images/projects/Anchor.png',
  }

  const userNfts = {
    nfts: [
      {
        project: '0x59fCcFbE3511B0f1286D54935258cB93AcC18E81',
        nft: [
          { id: '5', createAt: '1647730056', locked: '30', amount: '1' },
          { id: '6', createAt: '1647731104', locked: '30', amount: '1' },
        ],
      },
    ],
  }

  return (
    <div style={{ minHeight: '75vh' }}>
      {loading ? (
        <CircularStatic />
      ) : (
        <div>
          <Grid container spacing={24}>
            {myNFTS && myNFTS[0]?.nft?.length ? (
              myNFTS[0]?.nft.map((nft, index) => (
                <Grid item md={3} spacing={1} className="swap-card">
                  <Card sx={{ maxWidth: 235, border: `` }}>
                    <CardMedia
                      component="img"
                      height="184"
                      image={img[userNfts.nfts[0].project]}
                      alt="Paella dish"
                    />
                    <CardContent
                      style={{
                        border: `${COLORS.Silver}`,
                        borderTop: `0px solid rgb(38 37 181 / 35%)`,
                      }}
                    >
                      <p className="info">
                        ID: <strong>{nft.id}</strong>
                      </p>
                      <p className="info">
                        Create At: <strong>{nft.createAt}</strong>
                      </p>
                      <p className="info">
                        Period: <strong>{nft.locked} seconds</strong>
                      </p>
                      <p className="info">
                        Amount: <strong>{nft.amount}</strong>
                      </p>
                      <p className="info">
                        Level: <strong>{'Diamond Hands'}</strong>
                      </p>
                      <br />
                      <br />
                      <CustomizedProgressBars value={nft.locked} />
                      <br />
                      <br />
                      <Button
                        variant="contained"
                        size="small"
                        // component={Link}
                        style={{
                          fontSize: '0.7125rem',
                          backgroundColor: '#9a21b8',
                          color: 'white',
                        }}
                        // to={`/rewards`}
                        // onClick={checkRewards}
                      >
                        Check rewards
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <h2>No NFTS Yet...</h2>
            )}
          </Grid>
        </div>
      )}

      <hr />
      <br />
      <h3>Your Claimable Rewards</h3>
      {loading ? (
        <CircularStatic />
      ) : (
        <div>
          <Grid container spacing={24}>
            {/* blockNumber [0].NFTId */}
            {allClaimableInfo && allClaimableInfo?.length ? (
              allClaimableInfo.map((nft, index) => (
                <Grid item md={3} spacing={1} className="swap-card">
                  <Card sx={{ maxWidth: 235, border: `` }}>
                    <CardMedia
                      component="img"
                      height="184"
                      image={img[userNfts.nfts[0].project]}
                      alt="Paella dish"
                    />
                    <CardContent
                      style={{
                        border: `${COLORS.Silver}`,
                        borderTop: `0px solid rgb(38 37 181 / 35%)`,
                      }}
                    >
                      <p className="info">
                      Reward Token: <strong>{nft.reward.token.symbol}</strong>
                      </p>

                      <p className="info">
                        Revenue: <strong>{ethers.BigNumber.from(nft.reward.token.revenue).div('1000000000000000000').toString() }</strong>
                      </p>
                      <p className="info">
                        NFTId: <strong>{nft.NFTId}</strong>
                      </p>
                      <p className="info">
                        Reward: <strong>{ethers.BigNumber.from(nft.proof.nftProof.reward).mul(nft.reward.token.revenue).div('1000000').div('1000000000000000000').toString()}</strong>
                      </p>
                      {/* <p className="info">
                        BlockNumber: <strong>{nft.blockNumber}</strong>
                      </p>
                      <p className="info">
                        Symbol: <strong>{nft.token.symbol}</strong>
                      </p>
                      <p className="info">
                        Revenue: <strong>{nft.token.revenue}</strong>
                      </p>
                      <p className="info">
                        Amount: <strong>{nft.amount}</strong>
                      </p>
                      <p className="info">
                        Level: <strong>{'Diamond Hands'}</strong>
                      </p>
                      <br />
                      <br />
                      <CustomizedProgressBars value={nft.locked} />
                      <br />
                      <br /> */}
                      <Button
                        variant="contained"
                        size="small"
                        style={{
                          fontSize: '0.7125rem',
                          backgroundColor: '#9a21b8',
                          color: 'white',
                        }}
                        onClick={() => checkMyRewards(nft)}
                      >
                        Claim rewards
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <h2>No Claimable NFTs Yet...</h2>
            )}
          </Grid>
        </div>
      )}
    </div>
  )
}

export default NFTCollection
