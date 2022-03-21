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
  'Patium Hands': '5px solid black',
}

function ProjectsNFTS({ account, contractData }) {
  const [loading, setLoading] = useState(false)
  const [swapsData, setSwapsData] = useState([])
  const [userHistory, setUserHistory] = useState([])
  const [loadNFTs, setLoadNFTs] = useState([])
  console.log('should get projects NFTs', loadNFTs)
  const userWallet = '0x9B6efdCFcdfb9825f805C2FE2f7f87eBBe76b253'
  // const userWallet = '0xAF67cbD8fb00759C3b4667beAcfBB3600e25476A'

  const { contractaddress } = useParams()
  const img = {
    '0x59fCcFbE3511B0f1286D54935258cB93AcC18E81','',
    '0x10B3Ce8b9B1b6777EE9d798119Ef7Be9BD38EB83','',
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
    const loadNFTs = async () => {
      if (contractaddress) {
        let projectsNFTS = await fetch(
          `http://3.83.53.59:3000/project/${contractaddress}`,
        )
        console.log('🚀projectsNFTS **', projectsNFTS)
      }
    }
    // setLoadNFTs(loadNFTs)
    // loadNFTs()

    const userNFTs = async () => {
      const userAddress = '0xf4eA652F5B7b55f1493631Ea4aFAA63Fe0acc27C'
      if (userAddress) {
        let myNFTs = await fetch(
          `http://3.83.53.59:3000/user/${userAddress}`,
        )
        console.log('** myNFTs  **', myNFTs)
      }
    }
    userNFTs()
    // setLoadNFTs(loadNFTs)
    loadNFTs()

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
        console.log(' cids', cids)
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
  }, [])

  const projectsNFTs = {
    blockNfts: {
      block: 30522134,
      timestamp: 1647804784,
      nfts: [
        { id: '1', createAt: '1647028940', locked: '150', amount: '500' },
        {
          id: '2',
          createAt: '1647173964',
          locked: '90',
          amount: '900000000000000000000',
        },
        {
          id: '3',
          createAt: '1647174200',
          locked: '60',
          amount: '300000000000000000000',
        },
        {
          id: '4',
          createAt: '1647633060',
          locked: '60',
          amount: '3000000000000000000000000',
        },
        { id: '5', createAt: '1647730056', locked: '30', amount: '1' },
        { id: '6', createAt: '1647731104', locked: '30', amount: '1' },
      ],
    },
  }

  return (
    <div style={{ minHeight: '40vh' }}>
      <Container>
        {loading ? (
          <CircularStatic />
        ) : (
          <div>
            <h2>Project's NFTs</h2>
            <Grid container spacing={24}>
              {projectsNFTs && projectsNFTs.blockNfts.nfts.length ? (
                projectsNFTs.blockNfts.nfts.map((nft, index) => (
                  <Grid
                    item
                    md={3}
                    spacing={1}
                    className="swap-card"
                    key={index}
                  >
                    <Card sx={{ maxWidth: 235, border: `` }}>
                      {/* <CardMedia
                        component="img"
                        height="184"
                        image=""
                        alt="nft"
                      /> */}
                      <CardContent
                        style={{
                          border: `${COLORS.Silver}`,
                          borderTop: `0px solid rgb(38 37 181 / 35%)`,
                        }}
                      >
                        <p className="info">
                          ID: <strong>{nft.id}</strong>
                          ID: <strong>{nft.createAt}</strong>
                        </p>
                        {/* <p className="info">
                          {' '}
                          Amount: <strong>{'1,00'}</strong>
                        </p>
                        <p className="info">
                          {' '}
                          Period: <strong>{'3 months'}</strong>
                        </p>
                        <p className="info">
                          {' '}
                          Level: <strong>{'Diamond Hands'}</strong>
                        </p>
                        <br />
                        <br />
                        <CustomizedProgressBars />
                        <br />
                        <br /> */}
                        <Button
                          variant="contained"
                          size="small"
                          component={Link}
                          style={{
                            fontSize: '0.7125rem',
                            backgroundColor: '#9a21b8',
                            color: 'white',
                          }}
                          to={`/rewards`}
                          // to={`/rewards/${pet.cid}`}

                          // "/collection/wallet-address"
                          // className="swap-msg-btn"
                        >
                          Loyalty
                        </Button>
                        {/* <Typography
                        variant="body2"
                        color="text.secondary"
                        className="card-header-swap"
                      >
                        {project.external_data.name}
                      </Typography> */}
                      </CardContent>
                      {/* <CardActions disableSpacing>
                      <IconButton aria-label="share">
                        <ShareIcon />
                      </IconButton>
                    </CardActions> */}
                    </Card>
                  </Grid>
                ))
              ) : (
                <h2>No Gifts Yet...</h2>
              )}
            </Grid>
          </div>
        )}

        {/* OLD  */}
        {loading ? (
          <CircularStatic />
        ) : (
          <div>
            <h2>Project's NFTs</h2>
            <Grid container spacing={24}>
              {userHistory && userHistory.length ? (
                userHistory.map((project, index) => (
                  <Grid item md={3} spacing={1} className="swap-card">
                    <Card sx={{ maxWidth: 235, border: `` }}>
                      <CardMedia
                        component="img"
                        height="184"
                        image={project.external_data.image}
                        alt="Paella dish"
                      />
                      <CardContent
                        style={{
                          border: `${COLORS.Silver}`,
                          borderTop: `0px solid rgb(38 37 181 / 35%)`,
                        }}
                      >
                        <p className="info">
                          ID: <strong>{'0098'}</strong>
                        </p>
                        <p className="info">
                          {' '}
                          Amount: <strong>{'1,00'}</strong>
                        </p>
                        <p className="info">
                          {' '}
                          Period: <strong>{'3 months'}</strong>
                        </p>
                        <p className="info">
                          {' '}
                          Level: <strong>{'Diamond Hands'}</strong>
                        </p>
                        <br />
                        <br />
                        <CustomizedProgressBars />
                        <br />
                        <br />
                        <Button
                          variant="contained"
                          size="small"
                          component={Link}
                          style={{
                            fontSize: '0.7125rem',
                            backgroundColor: '#9a21b8',
                            color: 'white',
                          }}
                          to={`/rewards`}
                          // to={`/rewards/${pet.cid}`}

                          // "/collection/wallet-address"
                          // className="swap-msg-btn"
                        >
                          Loyalty
                        </Button>
                        {/* <Typography
                        variant="body2"
                        color="text.secondary"
                        className="card-header-swap"
                      >
                        {project.external_data.name}
                      </Typography> */}
                      </CardContent>
                      {/* <CardActions disableSpacing>
                      <IconButton aria-label="share">
                        <ShareIcon />
                      </IconButton>
                    </CardActions> */}
                    </Card>
                  </Grid>
                ))
              ) : (
                <h2>No Gifts Yet...</h2>
              )}
            </Grid>
          </div>
        )}
      </Container>
    </div>
  )
}

export default ProjectsNFTS
