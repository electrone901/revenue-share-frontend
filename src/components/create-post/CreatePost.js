import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import PhotoCamera from '@material-ui/icons/PhotoCamera'
import './CreatePost.css'
import { NFTStorage, File } from 'nft.storage'
import { createRef } from 'react'
import { apiKey } from '../../ipfs'
import {
  TextField,
  Container,
  StylesProvider,
  Typography,
  Button,
  IconButton,
  MenuItem,
} from '@material-ui/core'

function CreatePost() {
  const history = useHistory()
  const [image, setImage] = useState('')
  const sportTypeRef = createRef()
  const [playerName, setPlayerName] = useState('')
  const [loading, setLoading] = useState(false)
  const [biography, setBiography] = useState('')
  const [imageName, setImageName] = useState('')
  const [imageType, setImageType] = useState('')
  const [petType, setPetType] = useState('')
  const [question1, setQuestion1] = useState('')
  const [question2, setQuestion2] = useState('')
  const [question3, setQuestion3] = useState('')

  const handleImage = (event) => {
    setImage(event.target.files[0])
    setImageName(event.target.files[0].name)
    setImageType(event.target.files[0].type)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setLoading(true)
      const client = new NFTStorage({ token: apiKey })
      const metadata = await client.store({
        name: playerName,
        description: `${biography} 2$, ${petType} 2$, ${question1}2$ , ${question2} 2$, ${question3}`,
        image: new File([image], imageName, { type: imageType }),
      })
      if (metadata) {
        history.push('/')
      }
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <StylesProvider injectFirst>
      <Container
        className="root-create-pet"
        style={{ minHeight: '70vh', paddingBottom: '3rem' }}
      >
        <div>
          <Typography className="title" color="textPrimary" gutterBottom>
            Let the world support your dreams
          </Typography>

          {image ? (
            <img
              src={URL.createObjectURL(image)}
              alt="player"
              className="img-preview"
            />
          ) : (
            ''
          )}
          <div className="form-container">
            <form className="form" noValidate autoComplete="off">
              <input
                accept="image/*"
                className="input"
                id="icon-button-photo"
                defaultValue={image}
                onChange={handleImage}
                type="file"
              />
              <label htmlFor="icon-button-photo">
                <IconButton color="primary" component="span">
                  <PhotoCamera />
                </IconButton>
              </label>
              <TextField
                fullWidth
                id="outlined-basic"
                label="Name"
                variant="outlined"
                className="text-field"
                defaultValue={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              />
              <TextField
                fullWidth
                id="outlined-basic"
                label="Biography"
                variant="outlined"
                className="text-field"
                defaultValue={biography}
                onChange={(e) => setBiography(e.target.value)}
              />
              <TextField
                fullWidth
                name="sportType"
                select
                label="Sport Type"
                variant="outlined"
                className="text-field"
                onChange={(e) => setPetType(e.target.value)}
                defaultValue=""
                ref={sportTypeRef}
              >
                <MenuItem value="Soccer">Soccer</MenuItem>
                <MenuItem value="Football">Football</MenuItem>
                <MenuItem value="Basketball">Basketball</MenuItem>
                <MenuItem value="Baseball">Baseball</MenuItem>
                <MenuItem value="Boxing">Boxing</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
              <TextField
                fullWidth
                id="outlined-basic"
                label="What is your career goal?"
                variant="outlined"
                className="text-field"
                defaultValue={question1}
                onChange={(e) => setQuestion1(e.target.value)}
              />
              <TextField
                fullWidth
                id="outlined-basic"
                label="How are you going to accomplish it?"
                variant="outlined"
                className="text-field"
                defaultValue={question2}
                onChange={(e) => setQuestion2(e.target.value)}
              />
              <TextField
                fullWidth
                id="outlined-basic"
                label="Why people should support your dreams?"
                variant="outlined"
                className="text-field"
                defaultValue={question3}
                onChange={(e) => setQuestion3(e.target.value)}
              />

              <Button
                size="large"
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </form>
          </div>
        </div>
      </Container>
    </StylesProvider>
  )
}

export default CreatePost
