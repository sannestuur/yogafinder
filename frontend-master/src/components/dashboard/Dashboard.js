import React, { PureComponent } from "react"
import { connect } from "react-redux"
import { fetchMyProducts } from '../../actions/products'
import { fetchUser } from '../../actions/users'
import { withStyles } from "material-ui/styles"
import { Link , Redirect} from "react-router-dom"
import * as combine from "lodash/fp/compose"
import Button from "material-ui/Button"
import Typography from "material-ui/Typography"
import Card, { CardActions, CardContent } from "material-ui/Card"
import Paper from "material-ui/Paper"
import {fetchUnseenOrders} from '../../actions/orders'
import {jwtPayload} from '../../jwt'
import {fetchDashboard} from "../../actions/dashboard"
import {getUnreadMessages} from "../../actions/chat"

const styles = theme => ({
  card: {
    maxWidth: 345,
    minWidth: 240,
    margin: 20,
    textAlign: "center",
    alignItem: "center"
  },
  media: {
    height: 200
  },
  paper: {
    height: 200,
    minWidth: 400
  },
  button : {
     margin: theme.spacing.unit,
     backgroundColor: `#588D61`,
     color: "white",
     display:'inline-block',
     textAlign:'center',
     '&:hover': {
        backgroundColor: `#8FBC8F`,
      },
  },
  cardContent : {
    display:'inline-block',
    alignItem: 'center'
  }
})

class Dashboard extends PureComponent {
  state = {}

  componentWillMount(props) {
    this.props.fetchUser(this.props.currentProfileId)
    this.props.fetchUnseenOrders()
    this.props.fetchDashboard()
    this.props.getUnreadMessages()
  }

  handleShowAll = () => {
    this.setState({
      showAll: true
    })
  }


  render() {
    const { classes, currentProfileId, currentUser, user } = this.props
    if (!currentUser) return <Redirect to="/" />
    if (this.props.currentUserRole === "admin") return <Redirect to="/admin" />

    return (
      <Paper
        style={{
          textAlign: "center",
          display: "inline-block",
          marginTop: "40px"
        }}
      >
        <div><h1>Welkom {user.name}</h1></div>
        <Card className={classes.card}>
          <CardContent>
            <Typography gutterBottom variant="title" component="h2">
              Mijn profiel
            </Typography>
            <div className="photo">
              {user.logo === "null" ? (
                <img src={"/images/profile.png"} alt={"default"} width="150" />
              ) : (
                <img src={user.logo} alt={"profielfoto"} width="150" />
              )}
            </div>
          </CardContent>
          <CardActions className={classes.cardContent}>
            <Button className={classes.button} size="medium" color="primary" variant="raised" component={Link} to={`/profiles/${currentProfileId}`}>
              Bekijk je profielinformatie
            </Button>
          </CardActions>
        </Card>
        <Card className={classes.card}>
          <CardContent>
            <Typography gutterBottom variant="headline" component="h2">
            Lessen
            </Typography>
          </CardContent>
          <CardActions>
            <Button className={classes.button} size="medium" color="primary" variant="raised" component={Link} to={`/classes/new`}>
              Voeg een les toe
            </Button>
            <Button className={classes.button} size="medium" color="primary" variant="raised" component={Link} to={`/profiles/${currentProfileId}/classes`}>
              Bekijk mijn lessen
            </Button>
          </CardActions>
        </Card>
      </Paper>
    )
  }
}

const mapStateToProps = function(state) {
  const jwtDecoded = state.currentUser ? jwtPayload(state.currentUser.jwt) : {}
  return {
    currentUser: state.currentUser,
    currentUserRole: jwtDecoded.role,
    currentUserId: jwtDecoded.id,
    currentProfileId: jwtDecoded.profileId,
    orders: state.orders,
    unseenOrders: state.unseenOrders,
    products: state.products,
    user: state.user,
    dashboard: state.dashboard,
    unreadMessages: state.unreadMessages
  }
}


export default combine(
  withStyles(styles),
  connect(mapStateToProps, { fetchMyProducts, fetchUser, fetchUnseenOrders, getUnreadMessages, fetchDashboard })
)(Dashboard)
