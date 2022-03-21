import React from 'react'
import { Link } from 'react-router-dom'
import './ClaimRewards.css'
import {
  Container,
  StylesProvider,
  Typography,
  Card,
  Grid,
  Button,
} from '@material-ui/core'
import logo from '../../images/avee.png'
function ClaimRewards({ account, contractData }) {
  return (
    <StylesProvider injectFirst>
      <Container style={{ minHeight: '70vh' }}>
        <div className="claim-container">
          <Card className="claim-card">
            <h5>Claim Avee Rewards </h5>
            <img src={logo} alt="" className="card-img" />
            <Grid cointainer className="root">
              <Grid item xs={6} className="claim-info">
                Total Stake:
              </Grid>
              <Grid item xs={6} className="claim-info2">
                24.989898 AVEE
              </Grid>

              <Grid item xs={6} className="claim-info">
                Your Stake:
              </Grid>
              <Grid item xs={6} className="claim-info2">
                2 AVEE
              </Grid>

              <Grid item xs={6} className="claim-info">
                Claimable rewards:
              </Grid>
              <Grid item xs={6} className="claim-info2">
                0 AVEE
              </Grid>
            </Grid>

            <div className="claim-btns">
              <Button
                className="claim"
                variant="contained"
                size="small"
                color="primary"
                component={Link}
                to={'/my-nfts'}
              >
                Close
              </Button>
              <Button
                className="claim"
                variant="contained"
                size="small"
                color="primary"
                disabled
              >
                Claim
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    </StylesProvider>
  )
}

export default ClaimRewards
