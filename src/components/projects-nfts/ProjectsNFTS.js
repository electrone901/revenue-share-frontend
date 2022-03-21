import React, { useState, useEffect } from 'react'
import './ProjectsNFTS.css'
import {
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Container,
} from '@material-ui/core'
import Avatar from '@mui/material/Avatar'
import { red } from '@mui/material/colors'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { apiKey } from '../../APIKEYS'
import CircularStatic from '../commons/CircularProgressWithLabel'
import CustomizedProgressBars from '../progress-bar/ProgressBar'
const COLORS = {
  Diamond: '5px solid red',
  Silver: '5px solid blue',
  PlatiumHands: '5px solid black',
}
const axios = require('axios')

function ProjectsNFTS({ account, contractData }) {

  const [loading, setLoading] = useState(false)
  const [swapsData, setSwapsData] = useState([])
  const [userHistory, setUserHistory] = useState([])
  const [loadNFTs, setLoadNFTs] = useState([])
  const [projectNfts, setProjectNfts] = useState([])
  const userWallet = '0x9B6efdCFcdfb9825f805C2FE2f7f87eBBe76b253'
  // const userWallet = '0xAF67cbD8fb00759C3b4667beAcfBB3600e25476A'

  const { contractaddress } = useParams()
  const img = {
    '0x59fCcFbE3511B0f1286D54935258cB93AcC18E81':
      'https://raw.githubusercontent.com/electrone901/revenue-share-frontend/main/src/images/projects/aaveNFT.jpg',
    '0x10B3Ce8b9B1b6777EE9d798119Ef7Be9BD38EB83':
      'https://raw.githubusercontent.com/electrone901/revenue-share-frontend/93cb11efacd85643c92296fc24430485e4846050/src/images/projects/Anchor.svg',
  }

  const imgBackup = [
    'https://raw.githubusercontent.com/electrone901/revenue-share-frontend/main/src/images/projects/Anchor.png',
    'https://raw.githubusercontent.com/electrone901/revenue-share-frontend/main/src/images/projects/Convex.png',
    'https://raw.githubusercontent.com/electrone901/revenue-share-frontend/main/src/images/projects/MakerDAO.jpg',
    'https://raw.githubusercontent.com/electrone901/revenue-share-frontend/main/src/images/projects/Spell.jpg',
    'https://raw.githubusercontent.com/electrone901/revenue-share-frontend/main/src/images/projects/Anchor.png',
  ]
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
    const projectsNFTS = async () => {
      // let contractaddress = '0x59fCcFbE3511B0f1286D54935258cB93AcC18E81'
      if (contractaddress) {
        let projectsNFTS = await axios.get(
          `http://3.83.53.59:3000/project/${contractaddress}`,
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
        setLoadNFTs(projectsNFTS.data)
      }
    }
    const loadNFTs = async () => {
      if (contractaddress) {
        let projectsNFTS = await axios.get(
          `http://3.83.53.59:3000/project/${contractaddress}`,
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

        // await fetch(
        //   `http://3.83.53.59:3000/project/${contractaddress}`,
        // )
        // console.log('🚀projectsNFTS **', projectsNFTS)
      }
    }
    setLoadNFTs(loadNFTs)
    // loadNFTs()

    const userNFTs = async () => {
      const userAddress = '0xf4eA652F5B7b55f1493631Ea4aFAA63Fe0acc27C'
      if (userAddress) {
        let myNFTs = await axios.get(
          `http://3.83.53.59:3000/user/${userAddress}`,
          {
            params: {},
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )
      }
    }
    // userNFTs()
    // setLoadNFTs(loadNFTs)
    // loadNFTs()

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
    projectsNFTS()
  }, [])

  return (
    <div style={{ minHeight: '70vh' }}>
      <Container>
        {loading ? (
          <CircularStatic />
        ) : (
          <div>
            <Container style={{ paddingTop: '3rem' }}>
              <h3>Project's NFTs</h3>
            </Container>
            <Grid container spacing={24}>
              {loadNFTs && loadNFTs?.blockNfts?.nfts.length ? (
                loadNFTs?.blockNfts?.nfts.map((nft, index) => (
                  <Grid
                    item
                    md={3}
                    spacing={1}
                    className="swap-card"
                    key={index}
                  >
                    <Card sx={{ maxWidth: 235, border: `` }}>
                      <CardMedia
                        component="img"
                        height="184"
                        image={img[contractaddress]}
                        alt="nft"
                      />
                      <CardContent
                        style={{
                          // border: `${COLORS.Silver}`,
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
                        <CustomizedProgressBars value={nft.amount / 10 ** 18} />
                        <br />
                        <br />
                        <Button
                          variant="contained"
                          size="small"
                          component={Link}

                          to={`/my-nfts`}
                          // to={`/rewards/${pet.cid}`}

                          // "/collection/wallet-address"
                          // className="swap-msg-btn"
                        >
                          Loyalty
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Container>
                  <h2 style={{
                  textAlign: 'center',
                  paddingTop:'3rem'
                }}>No NFTs Yet...</h2>
                </Container>

              )}
            </Grid>
          </div>
        )}
      </Container>
    </div>
  )
}

export default ProjectsNFTS
