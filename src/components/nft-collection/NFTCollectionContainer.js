import React from 'react'
import './NFTCollectionContainer.css'
import { Container, StylesProvider, Typography, Chip } from '@material-ui/core'
// import CreateSwap from '../create-swap/CreateSwap'
import NFTCollection from './NFTCollection'

function NFTCollectionContainer({ account, contractData }) {
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
        <NFTCollection account={account} contractData={contractData} />
      </Container>
    </StylesProvider>
  )
}

export default NFTCollectionContainer
