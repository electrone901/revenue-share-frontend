import React, { useEffect, useState } from 'react'
import CircularStatic from '../commons/CircularProgressWithLabel'
import ImageListItem from '@material-ui/core/ImageListItem'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import ImageListItemBar from '@material-ui/core/ImageListItemBar'
import { red } from '@mui/material/colors'
import ShareIcon from '@mui/icons-material/Share'
import FavoriteIcon from '@mui/icons-material/Favorite'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useHistory } from 'react-router-dom'
import {
  Grid,
  Card,
  CardHeader,
  Avatar,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Container,
  CardActions,
  Paper,
} from '@material-ui/core'
import { apiKey } from '../../ipfs'
import { Link } from 'react-router-dom'
import './Projects.css'
import CustomizedProgressBars from '../progress-bar/ProgressBar'
import { ethers } from 'ethers'
import Stake from '../stake/Stake'
import { green } from '@material-ui/core/colors'

const icons = ['1.jpg', '2.jpg']
function Projects({
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
  claiming,
}) {

  const [projectName, setProjectName] = useState('')
  const [amount, setAmount] = useState('')
  const [duration, setDuration] = useState('')

  const [t, setT] = useState('')
  const [playersData, setPlayersData] = useState([])
  const [projectsInfo, setProjectsInfo] = useState([])
  const [logo, setLogo] = useState('')
  const [name, setName] = useState('')
  const [tlv, setTlv] = useState('')

  const [NFTSNumber, setNFTSNumber] = useState(0)
  const [loading, setLoading] = useState(false)
  let NFTS = 3
  const history = useHistory()
  const [isOpen, setIsOpen] = useState(false)
  const axios = require('axios')

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        setLoading(true)
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

            const getImage = (ipfsURL) => {
              if (!ipfsURL) return
              ipfsURL = ipfsURL.split('://')
              return 'https://ipfs.io/ipfs/' + ipfsURL[1]
            }
            data = await data.json()
            const dataArrray = data.description.split('2$,')

            data.bio = dataArrray[0]
            data.sportType = dataArrray[1]
            data.q1 = dataArrray[2]
            data.q2 = dataArrray[3]
            data.q3 = dataArrray[4]
            data.image = await getImage(data.image)
            data.cid = cid.cid
            data.created = cid.created
            temp.push(data)
          }
        }
        setPlayersData(temp)

        // GET contractProjects, LOOP & GET contractProjects info
        //  create a temp obj, contruct it, then add it to projectsInfo
        const tempProjectsInfo = []
        for (let i = 0; i < contractProjects.length; i++) {
          const project = {}
          const name = await contractProjects[i].methods?.name().call()
          const logo = await contractProjects[i].methods.logo().call()
          const numbOfNfts = await contractProjects[i].methods.rsId().call()
          const tvl = await contractProjects[i].methods
            .totalVolumenLoad()
            .call()
          const tvlConverted = parseInt(tvl) / 10 ** 18

          project.name = name
          project.logo = logo
          project.numbOfNfts = numbOfNfts
          project.address = i
          project.tvlConverted = tvlConverted
          //  Number(project.tvlConverted)/1000000000000000000

          tempProjectsInfo.push(project)
        }
        setProjectsInfo(tempProjectsInfo)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }
    loadPlayers()
  }, [contractProjects])

  const getProjectInfo = async (e) => {
    e.preventDefault()
    // STAKESHARE
    const res1 = await aaveStakedShareContract.methods.rsToken(1).call() // returns when the stakeNFT was  created, the locked time, tokensAmount  0: '1647028940', 1: '150', 2: '500' => created, locked, amount

    const res2 = await aaveStakedShareContract.methods.rsToken(2).call() // returns when the stakeNFT was  created, the locked time, tokensAmount  0: '1647028940', 1: '150', 2: '500' => created, locked, amount
    // console.log('res2 returns?', res2)

    // const logo = await aaveStakedShareContract.methods.logo().call()
    // setLogo(logo)
    // console.log('logo', logo)

    // const name = await aaveStakedShareContract.methods.name().call()
    // setName(name)
    // console.log('name', name)

    // const NFTSNumber = await aaveStakedShareContract.methods.rsId().call()
    // setNFTSNumber(NFTSNumber)
    // console.log('NFTSNumber', NFTSNumber)

    // const tvl = await aaveStakedShareContract.methods.totalVolumenLoad().call()
    // const t = parseInt(tvl) / 10 ** 18
    // console.log('t', t)
    // setTlv(t)

    for (let i = 1; i <= Number(NFTSNumber); i++) {
      const cur = await aaveStakedShareContract.methods.rsToken(i).call()
    }

    // const res2 = await aaveStakedShareContract.methods.revToken(1).call() // gives the nfft info by id (timestamp, timeLockOnSecs,  amount)
    // aaveStakedShareContract totalVolumenLoad() ,  logo(), rsId: ƒ () number of  nfts id => counters
  }

  const getAnchor = async (e) => {
    e.preventDefault()
    const name = await anchorStakedShareContract.methods.name().call()
    setName(name)

    const NFTSNumber = await anchorStakedShareContract.methods.rsId().call()
    setNFTSNumber(NFTSNumber)


    const tvl = await anchorStakedShareContract.methods
      .totalVolumenLoad()
      .call()
    const t = parseInt(tvl) / 10 ** 18
    setTlv(t)

    for (let i = 1; i <= Number(NFTSNumber); i++) {
      const cur = await anchorStakedShareContract.methods.rsToken(i).call()
      console.log('🚀 cur', cur)
    }
  }

  const getBalance = async (e) => {
    e.preventDefault()
    if (!account) alert('Please login using metamask!')
    // const res = await usdcContract.methods.balanceOf(account).call() //0 usdc contract
    // const res = await usdcContract.methods.name().call() // USDC
    // const res = await usdcContract.methods.symbol().call() // USDC
    // const res = await usdcContract.methods.getApproved().call() //

    // STAKESHARE
    // const res = await aaveStakedShareContract.methods.rsToken(1).call() // this is better call one contract to another
    // const res = await aaveStakedShareContract.methods.revToken(1).call() // gives the nfft info by id (timestamp, timeLockOnSecs,  amount)

    // FAUCET
    // const aaveTokenAddress = '0xE3255FAdaF182A813933FEB8c69e3c91937854fD'
    // // in aave 1 token =  1000000000000000000000  thats why we have to convert it
    // const returnedData = await faucetContract.methods
    //   .claim(aaveTokenAddress, (100 * 10 ** 18).toString())
    //   .send({ from: account })
    // console.log(' returnedData', returnedData)

    // const res = await faucetContract.methods
    //   .claim(aaveTokenAddress, bigNum.from(`1000000000000000000000`))
    //   .send({ from: account })

    // const res = await contractData.methods.transferFrom('0xf4eA652F5B7b55f1493631Ea4aFAA63Fe0acc27C', '0x11Afb8521CbF03C3508378E41d4C5b7e2C90b233', '32').call() // USDC
    // console.log('~ res', res)
    // console.log(' balanceOf', contractData.methods.balanceOf())
  }
  const togglePopup = () => {
    setIsOpen(!isOpen)
  }

  const handleStakeOld = async (e) => {
    e.preventDefault()

    // const allowance = await mockAaveTokenContract.methods
    //   .allowance(account, mockAaveTokenAddress)
    //   .call() // returns integer how much money this contract can spend
    // console.log('🚀  allowance', allowance)
    // Remember approve the tokens Transfer before stake

    console.log('projectName, amount, duration', projectName, amount, duration)

    const mockTokenContracts = {
      aaveStakedShareContract: mockAaveTokenContract,
      anchorStakedShareContract: mockAnchorTokenContract,
    }

    const mockTokenAddresses = {
      aaveStakedShareContract: mockAaveTokenAddress,
      anchorStakedShareContract: mockAnchorToken,
    }

    const mockTokenAddress = mockTokenAddresses[projectName]
    const mockTokenContract = mockTokenContracts[projectName]
    // const aaveStakedShareAddress = '0x59fCcFbE3511B0f1286D54935258cB93AcC18E81'
    //  aaveStakedShareContract: {mockTokenAddress: '0x59fCcFbE3511B0f1286D54935258cB93AcC18E81', stakeShareAddress: '' }
    const allowance = await mockTokenContract.methods
      .allowance(account, mockTokenAddress)
      .call()
    console.log('  allowance🚀🚀🚀', allowance)

    // approve allow the mockAaveTokenContract to spend the user's tokens
    //  after that users can stake
    // approve function returns how much money this contract can spend
    const stakedShareAddresses = {
      aaveStakedShareContract: {
        mockTokenAddress: '0xE3255FAdaF182A813933FEB8c69e3c91937854fD',
        stakeShareAddress: '0x59fCcFbE3511B0f1286D54935258cB93AcC18E81',
      },
      anchorStakedShareContract: {
        mockTokenAddress: '0x9Ea3c15b70D7af8fA6AFEaC21A26eb2d159e8634',
        stakeShareAddress: '0x10B3Ce8b9B1b6777EE9d798119Ef7Be9BD38EB83',
      },
    }

    const stakeShareAddress = stakedShareAddresses[projectName].mockTokenAddress
    const approve = await mockTokenContract.methods
      .approve(stakeShareAddress, amount.toString())
      .send({ from: account })
    console.log('🚀  approve', approve)

    // Second call aaveStakedShareContract to stake tokens
    const contracts = {
      aaveStakedShareContract: aaveStakedShareContract,
      anchorStakedShareContract: anchorStakedShareContract,
    }

    const stakedShareContract = contracts[projectName]
    console.log('======stakedShareContract', stakedShareContract)

    const stake = await contractProjects[0].methods
      .stake(amount.toString(), duration.toString())
      .send({ from: account })
    console.log('🚀  stake', stake)

    // balanceOf(address)
    // const balanceOf = await stakedShareContract.methods
    //   .balanceOf(account)
    //   .call()
    // console.log('🚀  balanceOf', balanceOf)
  }

  const handleStake = async (e) => {
    e.preventDefault()
    // const allowance = await mockAaveTokenContract.methods
    //   .allowance(account, mockAaveTokenAddress)
    //   .call() // returns integer how much money this contract can spend
    // console.log('🚀  allowance', allowance)
    // Remember approve the tokens Transfer before stake

    const aaveStakedShareAddress = '0x59fCcFbE3511B0f1286D54935258cB93AcC18E81'
    const allowance = await mockAaveTokenContract.methods
      .allowance(account, mockAaveTokenAddress)
      .call()


    // if allowance <= 0 call approve
    // First part is to check if allowance <= 0 call approve.
    // approve allow the mockAaveTokenContract to spend the user's tokens
    //  after that users can stake
    // if (allowance <= 0 || allowance < amount) {
      // approve function returns how much money this contract can spend
      const approve = await mockAaveTokenContract.methods
        .approve(aaveStakedShareAddress, amount.toString())
        .send({ from: account })
      console.log('🚀  approve', approve)


    // Second call aaveStakedShareContract to stake tokens
    const stake = await contractProjects[0].methods
      .stake((amount).toString(), (1).toString())
      .send({ from: account })
    console.log('🚀  stake', stake)

    // balanceOf(address)
    const balanceOf = await contractProjects[0].methods
      .balanceOf(account)
      .call()
    console.log('🚀  balanceOf', balanceOf)
  }

  const gotoProjectNfts = (contractAddress) => {
    const addresses = [
      '0x59fCcFbE3511B0f1286D54935258cB93AcC18E81',
      '0x10B3Ce8b9B1b6777EE9d798119Ef7Be9BD38EB83',
    ]
    const contractaddress = addresses[contractAddress]
    history.push(`/projects-nfts/${contractaddress}`)
  }
  const getTokens = async (address) => {
    const contractAddresses = [
      `0xE3255FAdaF182A813933FEB8c69e3c91937854fD`,
      `0x9Ea3c15b70D7af8fA6AFEaC21A26eb2d159e8634`,
    ]
    const tokenAddress = contractAddresses[address]
    const returnedData = await faucetContract.methods
      .claim(tokenAddress, (100 * 10 ** 18).toString())
      .send({ from: account })
    console.log(' returnedData', returnedData)
  }

  const img = [
    'https://raw.githubusercontent.com/electrone901/revenue-share-frontend/main/src/images/projects/aaveNFT.jpg',
    'https://raw.githubusercontent.com/electrone901/revenue-share-frontend/93cb11efacd85643c92296fc24430485e4846050/src/images/projects/Anchor.svg',
    'https://raw.githubusercontent.com/electrone901/revenue-share-frontend/main/src/images/projects/Convex.png',
    'https://raw.githubusercontent.com/electrone901/revenue-share-frontend/main/src/images/projects/MakerDAO.jpg',
    'https://raw.githubusercontent.com/electrone901/revenue-share-frontend/main/src/images/projects/Spell.jpg',
    'https://raw.githubusercontent.com/electrone901/revenue-share-frontend/main/src/images/projects/Anchor.png',
    'https://raw.githubusercontent.com/electrone901/revenue-share-frontend/main/src/images/projects/Anchor.png',
    'https://raw.githubusercontent.com/electrone901/revenue-share-frontend/93cb11efacd85643c92296fc24430485e4846050/src/images/projects/Anchor.svg',
    'https://raw.githubusercontent.com/electrone901/revenue-share-frontend/main/src/images/projects/Convex.png',
    'https://raw.githubusercontent.com/electrone901/revenue-share-frontend/main/src/images/projects/MakerDAO.jpg',
  ]
  return (
    <Container>
      <div
        style={{ minHeight: '70vh', paddingBottom: '3rem', paddingTop: '3rem' }}
      >
        <Button
          variant="contained"
          size="small"
          style={{
            fontSize: '0.7125rem',
            backgroundColor: '#9a21b8',
            color: 'white',
          }}
          onClick={claiming}
        >
          Loyalty
        </Button>
        <Container>
          <div className="box">
            <div className="container-outer">
              <Card style={{ minWidth: 200 }} className="card-apps">
                <p className="project-title">TVL IN DAPPS</p>
                <p className="project-subtitle">
                  <span>$531.1M USD</span>
                </p>
              </Card>

              <Card style={{ minWidth: 200 }} className="card-apps inner">
                <p className="project-title">DAPPS COUNT</p>
                <p className="project-subtitle">
                  <span>
                    {contractProjects.length > 0
                      ? contractProjects.length
                      : '$48'}
                  </span>
                </p>
              </Card>

              <Card style={{ minWidth: 200 }} className="card-apps inner">
                <p className="project-title">CURRENT ERA</p>
                <p className="project-subtitle">
                  <span>39</span>
                </p>
                <p className="project-content">Blocks until next era</p>
                <p className="project-content"></p>
                <p className="project-content"></p>

                <CustomizedProgressBars value={50} />
                <p className="project-content2"></p>
              </Card>
            </div>
          </div>
        </Container>
        {loading ? (
          <CircularStatic />
        ) : (
          <div>
            {isOpen && (
              <Stake
                handleClose={togglePopup}
                handleStake={handleStake}
                setProjectName={setProjectName}
                setAmount={setAmount}
                setDuration={setDuration}
              />
            )}

            <Grid container>
              {projectsInfo.length ? (
                projectsInfo.map((project, index) => (
                  <Grid
                    item
                    md={4}
                    container
                    spacing={2}
                    className="swap-card"
                    key={index}
                  >
                    <Card sx={{ maxWidth: 325 }} className="card">
                      <Grid container className="root">
                        <Grid item xs={3} className="avatar">
                          <Avatar aria-label="recipe">
                            <img
                              className="project-icon"
                              src={img[index]}
                              alt="icon"
                            />
                          </Avatar>
                        </Grid>
                        <Grid item xs={9}>
                          <p className="title">{project.name}</p>
                          <p className="subtitle">
                            Welcome to Revenue Share staking pool...
                          </p>
                        </Grid>
                      </Grid>
                      <CardContent>
                        <div className="card-content">
                          <p className="body2 card-content-bar">
                            Total stake:{' '}
                            <span>{project.tvlConverted} Tokens</span>
                          </p>
                          <CustomizedProgressBars
                            tlv={
                              project.tvlConverted === 0
                                ? 0
                                : Math.random() * 100
                            }
                          />
                        </div>
                        <Typography
                          variant="body2"
                          color="primary"
                          className="card-header-swap"
                        >
                          Your number of NFTs:{' '}
                          <strong>{project.numbOfNfts}</strong>
                        </Typography>
                      </CardContent>

                      <CardActions className="card-act">
                        <Button
                          variant="contained"
                          style={{ backgroundColor: '#06d406' }}
                          className="btn-stake"
                          color="primary"
                          size="small"
                          onClick={() => gotoProjectNfts(project.address)}
                          // onClick={test}
                        >
                          See NFTs
                        </Button>

                        <Button
                          variant="contained"
                          className="btn-stake"
                          color="primary"
                          size="small"
                          onClick={() => getTokens(project.address)}
                        >
                          Faucet
                        </Button>

                        <Button
                          variant="contained"
                          className="btn-stake"
                          color="primary"
                          size="small"
                          onClick={togglePopup}
                          // component={Link}
                          // to={`/stake`}
                        >
                          Stake
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Container style={{ textAlign: 'center', paddingTop: '1rem' }}>
                  <h2>Please Login...</h2>
                </Container>
              )}
            </Grid>

            {/* OLD */}
            {/* <Grid container>
              {playersData.length ? (
                playersData.map((player, index) => (
                  <Grid
                    item
                    md={4}
                    container
                    spacing={2}
                    className="swap-card"
                    key={index}
                  >
                    <Card sx={{ maxWidth: 325 }} className="card">
                      <Grid container className="root">
                        <Grid item xs={3} className="avatar">
                          <Avatar aria-label="recipe">
                            <img
                              className="project-icon"
                              src="https://images.unsplash.com/photo-1524416866085-e6895d696250?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80"
                              alt="icon"
                            />
                          </Avatar>
                        </Grid>
                        <Grid item xs={9}>
                          <p className="title">Avee Project</p>
                          <p className="subtitle">
                            Welcome to the core-team staking pool...
                          </p>
                        </Grid>
                      </Grid>
                      <CardContent>
                        <div className="card-content">
                          <p className="body2 card-content-bar">
                            Total stake: <span>18.525M ASTR</span>
                          </p>
                          <CustomizedProgressBars />
                        </div>
                        <Typography
                          variant="body2"
                          color="primary"
                          className="card-header-swap"
                        >
                          Your number of NFTs: <strong>{NFTSNumber}</strong>
                        </Typography>
                      </CardContent>

                      <CardActions className="card-act">
                        <Button
                          variant="contained"
                          className="btn-stake"
                          color="primary"
                          size="small"
                        >
                          <a
                            href="https://gitter.im/kovan-testnet/faucet"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="a-stake"
                          >
                            Faucet
                          </a>
                        </Button>
                        <Button
                          variant="contained"
                          className="btn-stake"
                          color="primary"
                          size="small"
                          component={Link}
                          to={`/stake`}
                        >
                          Stake
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))
              ) : (
                <h2>No Projects Yet...</h2>
              )}
            </Grid> */}
          </div>
        )}
      </div>
    </Container>
  )
}

export default Projects
