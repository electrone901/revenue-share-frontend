import React from 'react'
import './NFTCollectionContainer.css'
import { Container, StylesProvider, Typography, Chip } from '@material-ui/core'
// import CreateSwap from '../create-swap/CreateSwap'
import NFTCollection from './NFTCollection'

function NFTCollectionContainer({
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
  revenueClaimContract
}) {
  return (
    <StylesProvider injectFirst>
      <Container style={{ minHeight: '70vh', paddingBottom: '3rem' }}>
        {/* <CreateSwap account={account} contractData={contractData} /> */}
        <div className="flex-container">
          <Typography gutterBottom className="title title-nfts" id="title-swap">
          My Loyalty Rewards Program NFTs
          </Typography>
          <div className="label-btns-swap">
            <Chip size="medium" label="All" color="primary" clickable />
            <Chip size="medium" label="Newest" clickable />

          </div>
        </div>
        <NFTCollection account={account}
             contractProjects={contractProjects}
             aaveStakedShareContract={aaveStakedShareContract}
             anchorStakedShareContract={anchorStakedShareContract}
             mockAnchorTokenContract={mockAnchorTokenContract}
             mockAaveTokenContract={mockAaveTokenContract}
             mockAaveTokenAddress={mockAaveTokenAddress}
             faucetContract={faucetContract}
             feesOracleContract={feesOracleContract}
             AaveAddress={AaveAddress}
             revenueClaimContract={revenueClaimContract}
             claiming={claiming} />
      </Container>
    </StylesProvider>
  )
}

export default NFTCollectionContainer
