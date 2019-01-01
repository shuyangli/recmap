import * as React from "react";
import { connect } from "react-redux";
import { Icon, Popover, Button } from "@blueprintjs/core";
import { TypedDispatch } from "../../store/TypedDispatch";
import { authenticate } from "../../store/user/actions";
import { RootState } from "../../store/RootState";

import "./UserDisplay.less";

interface ConnectedProps {
  currentUser: firebase.User | undefined;
}

interface DispatchProps {
  authenticate: () => Promise<any>;
}

type UserDisplayProps = ConnectedProps & DispatchProps;

class UserDisplay extends React.PureComponent<UserDisplayProps, {}> {
  render() {
    return (
      <Popover
        content={this.renderPopoverContent()}
        target={this.renderUserIcon()}
        usePortal={true}
        modifiers={{
          preventOverflow: {
            boundariesElement: "viewport",
          },
          keepTogether: {
            enabled: true,
          },
          flip: {
            enabled: true,
          },
        }}
      />
    );
  }

  private renderPopoverContent(): JSX.Element {
    return (
      <div className="sign-in-wrapper">
        <Button onClick={this.props.authenticate} text="authenticate" />
      </div>
    );
  }

  private renderUserIcon(): JSX.Element {
    if (this.props.currentUser && this.props.currentUser.photoURL) {
      return <img className="user-display" width={30} height={30} src={this.props.currentUser.photoURL} />;
    } else {
      return <Icon className="user-display" icon="user" iconSize={30} tagName="div" />;
    }
  }
}

function mapStateToProps(state: RootState): ConnectedProps {
  return {
    currentUser: state.user.currentUser,
  };
}

function mapDispatchToProps(dispatch: TypedDispatch): DispatchProps {
  return {
    authenticate: () => dispatch(authenticate()),
  };
}

export const ConnectedUserDisplay = connect(mapStateToProps, mapDispatchToProps)(UserDisplay);
