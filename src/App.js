import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Web3 from 'web3'
import './App.css'
import { Navbar } from './components/layout/navbar/Navbar'
import Footer from './components/layout/footer/Footer'
import Home from './components/home/HomePage'
import Stake from './components/stake/Stake'
import Projects from './components/projects/Projects'
import ProjectsNFTS from './components/projects-nfts/ProjectsNFTS'
import NFTCollectionContainer from './components/nft-collection/NFTCollectionContainer'


import ClaimRewards from './components/claim-rewards/ClaimRewards'

// import PlayerProfile from './components/home-container/player-profile/PlayerProfile'
// import CreatePost from './components/create-post/CreatePost'
// import DonateNFT from './components/donate-nft/DonateNFT'

// import playerAbi from './artifacts/contracts/Player.sol/Player.json'

import nnfABI from '../src/abis/NFT.json'
import stakedShareABI from '../src/abis/StakedShare.json'
import faucetABI from '../src/abis/Faucet.json'
import feesOracleABI from '../src/abis/Faucet.json'
import mockTokenABI from '../src/abis/MockToken.json'
import revenueFactoryABI from '../src/abis/RevenueFactory.json'

const network =
  'https://eth-kovan.alchemyapi.io/v2/H4MhEHIVdt8eiG9KWksyB9GcPso1zpqS'
// provider for web put network inside provider

function App() {
  const [account, setAccount] = useState('')
  const [contractProjects, setContractProjects] = useState([])
  const [nftContract, setNftContract] = useState('')
  const [aaveStakedShareContract, setAaveStakedShareContract] = useState('')
  const [anchorStakedShareContract, setAnchorStakedShareContract] = useState('')
  const [faucetContract, setFaucetContract] = useState('')
  const [feesOracleContract, setFeesOracleContract] = useState('')
  const [mockAaveTokenContract, setMockAaveTokenContract] = useState('')
  const usdcContractAddress = '0x3182042B07AD39405D2Be2a47cF320252efFF033'
  const AaveAddress = '0x59fCcFbE3511B0f1286D54935258cB93AcC18E81'
  const AnchorAddress = '0x10B3Ce8b9B1b6777EE9d798119Ef7Be9BD38EB83'
  const faucetAddress = '0x92b44f8aC3eF326882Dfaca16E8D94b3d881bceC'
  const feesOracleAddress = '0x3Ac7832b6f03680ec2e7D3056e60E6B4D6CbF116'

  const stakedShareFactoryAddress = '0x3Ac7832b6f03680ec2e7D3056e60E6B4D6CbF116'
  const mockAaveTokenAddress = '0xE3255FAdaF182A813933FEB8c69e3c91937854fD'

  const logout = () => {
    setAccount('')
  }

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.request({ method: 'eth_requestAccounts' })
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert(
        'Non-Ethereum browser detected. You should consider trying Metamask!',
      )
    }
  }

  const getContract = async () => {
    try {
      const web3 = window.web3
      const accounts = await web3.eth.getAccounts()
      setAccount(accounts[0])

      const nftContract = new web3.eth.Contract(nnfABI, usdcContractAddress)
      setNftContract(nftContract)

      // CONTRACT PROJECTS
      const aaveStakedShareContract = new web3.eth.Contract(
        stakedShareABI,
        AaveAddress,
      )
      setContractProjects((contractProjects) => [
        ...contractProjects,
        aaveStakedShareContract,
      ])
      setAaveStakedShareContract(aaveStakedShareContract)

      const anchorStakedShareContract = new web3.eth.Contract(
        stakedShareABI,
        AnchorAddress,
      )
      setContractProjects((contractProjects) => [
        ...contractProjects,
        anchorStakedShareContract,
      ])
      // setAnchorStakedShareContract(anchorStakedShareContract)

      // mockAaveToken
      const mockAaveTokenContract = new web3.eth.Contract(
        mockTokenABI,
        mockAaveTokenAddress,
      )
      setMockAaveTokenContract(mockAaveTokenContract)
      // setContractProjects(contractProjects => [...contractProjects, mockAaveTokenContract])
      // setAnchorStakedShareContract(anchorStakedShareContract)

      //
      //  pass it to projects componets, then projectsUseEffect. Loop through  allContratsArray and get the project's info. Here create an obj with the  project's info then display them w rectjs

      //  aaveStakedShareContract={aaveStakedShareContract}
      // aaveStakedShareContract={anchorStakedShareContract}
      //  maybe create an array of contracts say
      //  const allContrats = [aaveStakedShareContract, aaveStakedShareContract] and pass it to projects

      const faucetContract = new web3.eth.Contract(faucetABI, faucetAddress)
      setFaucetContract(faucetContract)

      const feesOracleContract = new web3.eth.Contract(
        feesOracleABI,
        feesOracleAddress,
      )
      setFeesOracleContract(feesOracleContract)
    } catch (error) {
      window.alert(
        'Contract is not deployed to the detected network. Connect to the Kovan network!',
      )
    }
  }

  const connectWallet = async () => {
    await loadWeb3()
    await getContract()
  }

  useEffect(() => {
    // if(!account) alert('Please login using Metamask and Kovan network.')
  }, [account])

  // console.log("2 contractProjects=======", contractProjects)

  return (
    <Router>
      <div className="cl">
        <Navbar
          logout={logout}
          account={account}
          connectWallet={connectWallet}
        />
        <Route exact path="/" component={Home} />
        <Switch>
          <Route exact path="/stake" component={Stake} />

          <Route exact path="/projects">
            <Projects
              account={account}
              nftContract={nftContract}
              contractProjects={contractProjects}
              aaveStakedShareContract={aaveStakedShareContract}
              anchorStakedShareContract={anchorStakedShareContract}
              mockAaveTokenContract={mockAaveTokenContract}
              faucetContract={faucetContract}
              feesOracleContract={feesOracleContract}
              mockAaveTokenAddress={mockAaveTokenAddress}
              AaveAddress={AaveAddress}
            />
          </Route>
          <Route path="/stake">
            <Stake
              account={account}
              nftContract={nftContract}
              contractProjects={contractProjects}
              aaveStakedShareContract={aaveStakedShareContract}
              anchorStakedShareContract={anchorStakedShareContract}
              mockAaveTokenContract={mockAaveTokenContract}
              faucetContract={faucetContract}
              feesOracleContract={feesOracleContract}
              mockAaveTokenAddress={mockAaveTokenAddress}
              AaveAddress={AaveAddress}
            />
          </Route>
          <Route exact path="/my-nfts">
            <NFTCollectionContainer />
          </Route>
          <Route exact path="/projects-nfts/:contractaddress">
            <ProjectsNFTS />
          </Route>

          <Route exact path="/rewards">
            <ClaimRewards />
          </Route>
        </Switch>
        <Footer />
      </div>
    </Router>
  )
}

export default App
