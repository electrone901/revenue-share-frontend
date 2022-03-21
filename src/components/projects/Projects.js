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
  faucetContract,
  feesOracleContract,
  mockAaveTokenContract,
  mockAaveTokenAddress,
  AaveAddress,
}) {
  // console.log("🚀 ~ file: Projects.js ~ line 44 ~ mockAaveTokenAddress", mockAaveTokenAddress)
  // console.log('contractProjects[0]', contractProjects[0])
  console.log('mockAaveTokenContract approve(address,uint256):', mockAaveTokenContract)
  console.log('aaveStakedShareContract', aaveStakedShareContract)
  // console.log('mockAaveTokenContract ', mockAaveTokenContract)

  // console.log('feesOracleContract ', feesOracleContract)

  // aaveStakedShareContract totalVolumenLoad() ,  logo(), rsId: ƒ () number of  nfts id => counters

  // to approave it I need to create abis for Mock Aave Token: 0xE3255FAdaF182A813933FEB8c69e3c91937854fD then called allowance(metamskOwnerAccount, ProjectAddressToStake), returns ammounts either 0 or X
  //   function allowance(address owner, address spender) public view virtual override returns (uint256) {
  //     return _allowances[owner][spender];
  // }
  // if amount= 0 call  approve otherwise show stake screen
  // amount = ethers.constants.MaxUint256
  // function approve(address spender, uint256 amount) public virtual override returns (bool) {
  //     _approve(_msgSender(), spender, amount);
  //     return true;
  // }

  // console.log('aaveStakedShareContract ', aaveStakedShareContract)
  // console.log('anchorStakedShareContract ', anchorStakedShareContract)
  const [playersData, setPlayersData] = useState([])
  const [projectsInfo, setProjectsInfo] = useState([])
  const [logo, setLogo] = useState('')
  const [name, setName] = useState('')
  const [tlv, setTlv] = useState('')
  const [NFTSNumber, setNFTSNumber] = useState(0)
  const [loading, setLoading] = useState(false)
  let NFTS = 3
  const history = useHistory()

  const [isOpen, setIsOpen] = useState(false);
  const togglePopup = () => {
    setIsOpen(!isOpen);
  }

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

  // console.log('projectsInfo', projectsInfo)

  const getProjectInfo = async (e) => {
    e.preventDefault()
    // STAKESHARE
    const res1 = await aaveStakedShareContract.methods.rsToken(1).call() // returns when the stakeNFT was  created, the locked time, tokensAmount  0: '1647028940', 1: '150', 2: '500' => created, locked, amount
    // console.log('res1 returns?', res1)

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
      console.log('🚀 cur', cur)
    }

    // const res2 = await aaveStakedShareContract.methods.revToken(1).call() // gives the nfft info by id (timestamp, timeLockOnSecs,  amount)
    // aaveStakedShareContract totalVolumenLoad() ,  logo(), rsId: ƒ () number of  nfts id => counters
  }

  const getAnchor = async (e) => {
    e.preventDefault()
    const name = await anchorStakedShareContract.methods.name().call()
    setName(name)
    console.log('anchor***', name)

    const NFTSNumber = await anchorStakedShareContract.methods.rsId().call()
    setNFTSNumber(NFTSNumber)
    console.log('NFTSNumber', NFTSNumber)

    const tvl = await anchorStakedShareContract.methods
      .totalVolumenLoad()
      .call()
    const t = parseInt(tvl) / 10 ** 18
    console.log('t', t)
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

    // stake(uint128 tokenAmount, uint128 lockTimeSeconds )
    const stakedShareImplementationAddress =
      '0x4F37f255eDD02aBe875f3C92256Ab8f74Bff7a97'
    const returnedData = await aaveStakedShareContract.methods
      .stake((20 * 10 ** 18).toString(), (3).toString())
      .send({ from: account })
    console.log(' returnedData', returnedData)

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

  const checkStake = async (e) => {
    e.preventDefault()
    // const allowance = await mockAaveTokenContract.methods
    //   .allowance(account, mockAaveTokenAddress)
    //   .call() // returns integer how much money this contract can spend
    // console.log('🚀  allowance', allowance)
    // Remember approve the tokens Transfer before stake


    const aaveStakedShareAddress = '0x59fCcFbE3511B0f1286D54935258cB93AcC18E81'
    const allowance = await mockAaveTokenContract.methods.allowance(account, mockAaveTokenAddress).call()
    console.log("  allowance🚀🚀🚀", allowance)

      // if allowance <= 0 call approve
      // First part is to check if allowance <= 0 call approve.
      // approve allow the mockAaveTokenContract to spend the user's tokens
      //  after that users can stake
      if(allowance <= 0) {
        // approve function returns how much money this contract can spend
        const approve = await mockAaveTokenContract.methods.approve(aaveStakedShareAddress, (1).toString()).send({from:account})
        console.log('🚀  approve', approve)
      }

      // Second call aaveStakedShareContract to stake tokens
    const stake = await contractProjects[0].methods
      .stake((1).toString(), (1).toString())
      .send({ from: account })
    console.log('🚀  stake', stake)

    // // balanceOf(address)
    const balanceOf = await contractProjects[0].methods
      .balanceOf(account).call()
    console.log('🚀  balanceOf', balanceOf)

  }

  const  gotoProjectNfts = (contractAddress) => {
    const addresses = [
      '0x59fCcFbE3511B0f1286D54935258cB93AcC18E81',
      '0x10B3Ce8b9B1b6777EE9d798119Ef7Be9BD38EB83'
    ]
    const contractaddress = addresses[contractAddress]
    history.push(`/projects-nfts/${contractaddress}`)
  }

  return (
    <Container>
      <div
        style={{ minHeight: '70vh', paddingBottom: '3rem', paddingTop: '3rem' }}
      >
        <img src={logo} alt="logo" />
        <img
          src="https://raw.githubusercontent.com/NimrodHunter/Revenue-Share-NTF/165e5e783622d2beadf3747d2116b76505518edb/logos/Aave.svg"
          alt="logo"
        />
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

            {/* <div className="box">
              <Button
                variant="contained"
                className="container-outer btn-stake"
                color="primary"
                size="small"
                component={Link}
                to={`/stake`}
              >
                Stake
              </Button>
              <Button
                className="container-outer btn-stake"
                variant="contained"
                size="small"
                color="primary"
                component={Link}
                to={`/rewards`}
              >
                Claim
              </Button>
            </div> */}
          </div>
        </Container>
        {/* <div className="label-btns">
          <Chip size="medium" label="Sports" color="primary" clickable />
          <Chip size="medium" label="Blog" clickable />
          <Chip size="medium" label="News" clickable />
          <Chip size="medium" label="Entertainment" clickable />
        </div> */}

        {/* logo: "https://github.com/NimrodHunter/Revenue-Share-NTF/blob/master/logos/Aave.svg"
name: "Aave Revenue"
numbOfNfts: "3"
tvlConverted: 1200 */}

        {loading ? (
          <CircularStatic />
        ) : (
          <div>
            <Button
              variant="contained"
              className="btn-stake"
              color="primary"
              size="large"
              onClick={getAnchor}
            >
              getAnchor
            </Button>

            <Button
              variant="contained"
              className="btn-stake"
              color="primary"
              size="large"
              onClick={checkStake}
            >
              checkStake
            </Button>

            <Button
              variant="contained"
              className="btn-stake"
              color="primary"
              size="large"
              onClick={getBalance}
            >
              getBalance
            </Button>

            <Button
              variant="contained"
              className="btn-stake"
              color="secondary"
              size="large"
              onClick={getProjectInfo}
            >
              getProjectsInfo
            </Button>

            {/* logo: "https://github.com/NimrodHunter/Revenue-Share-NTF/blob/master/logos/Aave.svg"
name: "Aave Revenue"
numbOfNfts: "4"
tvlConverted: 3001200 */}


{isOpen && <Stake handleClose={togglePopup}/>}


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
                              src="https://images.unsplash.com/photo-1524416866085-e6895d696250?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80"
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
                          style={{backgroundColor: '#06d406'}}
                          className="btn-stake"
                          color="primary"
                          size="small"
                          onClick={ () => gotoProjectNfts(project.address)}
                        >
                          See NFTs
                        </Button>

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
                <h2>No Projects Yet...</h2>
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
