import React, {useState} from 'react'
// import {connect} from 'react-redux'
// import {setTask} from '../store/task'
// import {postNotification} from '../store/notifications'
// import {fetchUserEvents} from '../store/event'
import {
  TextField,
  FormControl,
  Container,
  FormGroup,
  Button,
  Select,
  InputLabel,
  MenuItem,
  FormHelperText
} from '@material-ui/core'
import swal from 'sweetalert'

export class AddTask extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      description: '',
      category: '',
      errorsTask: {}
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    this.props.getUserEvents('upcoming')
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.errorsTask) {
      this.setState({errorsTask: nextProps.errorsTask})
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  async handleSubmit(event) {
    event.preventDefault()
    const eventId = this.props.match.params.id
    const usersEvents = this.props.events.myEvents

    // if the user is the host then add a task to db
    if (usersEvents.length > 0) {
      for (let i = 0; i < usersEvents.length; i++) {
        if (usersEvents[i].eventId == eventId) {
          if (usersEvents[i].isOrganizer) {
            let newTask = {
              title: this.state.title,
              description: this.state.description,
              category: this.state.category,
              eventId: eventId
            }
            await this.props.setTask(newTask)
            if (!this.state.errorsTask.title) {
              this.props.history.push(`/events/${eventId}/tasks`)
            }
          }
        }
      }
    } else {
      const fullName = `${this.props.user.firstName} ${
        this.props.user.lastName
      }`

      const notificationObj = {
        authorId: this.props.user.id,
        authorName: fullName,
        eventId: eventId,
        title: this.state.title,
        description: this.state.description,
        category: this.state.category
      }

      await this.props.postNotification(notificationObj)

      swal({
        title: 'Good job!',
        text:
          'The organizer of the party will review your recommendation soon!',
        icon: 'success',
        button: 'Go back'
      }).then(function() {
        window.location.href = `https://event-share.herokuapp.com/events/${eventId}/tasks`
      })
    }
  }

  render() {
    const {errorsTask} = this.state
    return (
      <Container maxWidth="sm">
        <form
          onSubmit={this.handleSubmit}
          className="addTask-form"
          noValidate
          autoComplete="off"
        >
          <h3 align="center">Create a Task</h3>
          <FormGroup>
            <FormControl>
              <TextField
                type="tittle"
                onChange={this.handleChange}
                value={this.state.title}
                name="title"
                label="Title Name *"
                variant="outlined"
                error={!!errorsTask.title}
                helperText={errorsTask.title}
              />
            </FormControl>
            <FormControl>
              <TextField
                onChange={this.handleChange}
                value={this.state.description}
                name="description"
                label="Description"
                variant="outlined"
              />
            </FormControl>

            <FormControl fullWidth={true} variant="outlined" margin="normal">
              <InputLabel id="demo-simple-select-filled-label">
                Category
              </InputLabel>
              <Select
                labelId="demo-simple-select-filled-label"
                id="demo-simple-select-filled"
                label="Category"
                name="category"
                value={this.state.category}
                onChange={this.handleChange}
                error={!!errorsTask.category}
              >
                <MenuItem value="to do">To Do</MenuItem>
                <MenuItem value="to bring">To Bring</MenuItem>
              </Select>
              <FormHelperText error>{errorsTask.category}</FormHelperText>
            </FormControl>
          </FormGroup>
          <Button
            className="btn-theme"
            type="submit"
            variant="contained"
            color="secondary"
          >
            Add to tasks
          </Button>
        </form>
      </Container>
    )
  }
}

const mapState = state => {
  return {
    user: state.user,
    email: state.user.email,
    errorsTask: state.task.errorsTask,
    events: state.events
  }
}

const mapDispatch = dispatch => {
  return {
    setTask: task => dispatch(setTask(task)),
    postNotification: notificationObj =>
      dispatch(postNotification(notificationObj)),
    getUserEvents: pastOrUpcoming => dispatch(fetchUserEvents(pastOrUpcoming))
  }
}

export default connect(mapState, mapDispatch)(AddTask)
