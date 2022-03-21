import React, { useState, useEffect, createRef } from 'react'

// import {connect} from 'react-redux'
// import {createEvent} from '../store/event'

import swal from 'sweetalert'
import {
  TextField,
  FormControl,
  Container,
  FormGroup,
  Button,
  Select,
  MenuItem,
  StylesProvider,
  Box,
  Input,
} from '@material-ui/core'
import './Stake.css'

const Stake = (props) => {
  const projectNameRef = createRef()
  const durationRef = createRef()
  const [projectName, setProjectName] = useState('')
  const [amount, setAmount] = useState('')
  const [duration, setDuration] = useState('')

  // const checkStake = async (e) => {
  //   e.preventDefault()
  //   // const allowance = await mockAaveTokenContract.methods
  //   //   .allowance(account, mockAaveTokenAddress)
  //   //   .call() // returns integer how much money this contract can spend
  //   // console.log('🚀  allowance', allowance)
  //   // Remember approve the tokens Transfer before stake

  //   // approve(address,uint256)
  //   const aaveStakedShare = '0x59fCcFbE3511B0f1286D54935258cB93AcC18E81'

  //   // balanceOf(address)
  //   const balanceOf = await contractProjects[0].methods
  //     .balanceOf(account).call()
  //   console.log('🚀  balanceOf', balanceOf)

  //   const approve = await contractProjects[0].methods
  //     .approve(aaveStakedShare, (1).toString())
  //     .send({ from: account })
  //   console.log('🚀  approve', approve)

  //   // // stake(uint128,uint128)
  //   // const stake = await contractProjects[0].methods
  //   //   .stake((1).toString(), (30).toString())
  //   //   .send({ from: account })
  //   // console.log('🚀  stake', stake)

  //   //     allowance(address owner, address spender)
  //   // approve(address spender, uint256 amount)
  //   // transferFrom(address sender, address recipient, uint256 amount)

  //   // // approve(address,uint256)
  //   // const AaveApprove = await contractProjects[0].methods.approve(account, (1).toString()).send({from:account}) // returns integer how much money this contract can spend
  //   // console.log("🚀  AaveApprove", AaveApprove)

  //   // const returnedData = await aaveStakedShareContract.methods
  //   // .stake((20 * 10 ** 18).toString(), (3).toString())
  //   // .send({ from: account })
  // }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('projectName, amount, duration', projectName, amount, duration)

    // const event = isEmpty(e)
    // console.log('EVENT', event)
    // if (Object.keys(event).length < 9) {
    //   swal('', 'Please fill out all input fields', 'error') // to be changed
    // } else {
    //   // this.props.createEvent(event)
    //   console.log('state')
    // }
  }
  return (
    <StylesProvider injectFirst>
      <div className="mypopup-box">
        <div className="mybox">
          <Container
            className="root-create-pet"
            style={{ minHeight: '70vh', paddingBottom: '3rem' }}
          ><span className="close-icon" onClick={props.handleClose}>x</span>
            <h5 align="center">Stake on Revenue Share NFT</h5>
            <div className="form-container">
              <form
                onSubmit={handleSubmit}
                className="form"
                noValidate
                autoComplete="off"
              >
                <TextField
                  fullWidth
                  name="projectName"
                  select
                  label="Project"
                  variant="outlined"
                  className="text-field"
                  onChange={(e) => setProjectName(e.target.value)}
                  defaultValue=""
                  ref={projectNameRef}
                >
                  <MenuItem value="Avee">Avee</MenuItem>
                  <MenuItem value="Solana">Solana</MenuItem>
                  <MenuItem value="Etherum">Etherum</MenuItem>
                  <MenuItem value="Link">Link</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>

                <TextField
                  fullWidth
                  className="text-field"
                  id="outlined-number"
                  label="Amount"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  defaultValue={amount}
                  variant="outlined"
                  onChange={(e) => {
                    setAmount(e.target.value)
                  }}
                />

                <TextField
                  fullWidth
                  name="duration"
                  select
                  label="How long?"
                  variant="outlined"
                  className="text-field"
                  onChange={(e) => setDuration(e.target.value)}
                  defaultValue=""
                  ref={durationRef}
                >
                  <MenuItem value="30">30 seconds</MenuItem>
                  <MenuItem value="60">60 seconds</MenuItem>
                  <MenuItem value="90">90 seconds</MenuItem>
                  <MenuItem value="120">120 seconds</MenuItem>
                </TextField>

                <Button
                  className="btn-theme"
                  type="submit"
                  variant="contained"
                  style={{
                    backgroundColor: '#9370db',
                    color: 'white',
                  }}
                  onClick={handleSubmit}
                >
                  Stake Now
                </Button>
              </form>
            </div>
          </Container>
        </div>
      </div>
    </StylesProvider>
  )
}

export default Stake
