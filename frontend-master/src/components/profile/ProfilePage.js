import React, { PureComponent } from "react"
import { connect } from "react-redux"
import { Redirect } from "react-router-dom"
import { fetchUser } from "../../actions/users"
import * as combine from "lodash/fp/compose"
import Profile from "./Profile"
import Button from "material-ui/Button"

class ProfilePage extends PureComponent {
  componentWillMount(props) {
    if (this.props.authenticated) {
      this.props.fetchUser(this.props.match.params.id)
    }
  }

  render() {
    const { authenticated } = this.props
    if (!authenticated) return <Redirect to="/login" />
    return (
      <div>
        <Button
          onClick={() => this.props.history.goBack()}
          size="medium"
          color="primary"
          style={{ display: "flex", flex: 1, margin: 15 }}
        >
          Ga terug
        </Button>
        <Profile />
      </div>
    )
  }
}

const mapStateToProps = ({ user, currentUser }, props) => ({
  authenticated: currentUser !== null,
  user
})

const mapDispatchToProps = {
  fetchUser
}

export default combine(
  connect(mapStateToProps, mapDispatchToProps)
)(ProfilePage)
