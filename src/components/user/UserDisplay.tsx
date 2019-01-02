import * as React from "react";
import { connect } from "react-redux";
import { Icon, Popover, Menu, MenuItem, MenuDivider } from "@blueprintjs/core";
import { signIn, signOut } from "../../store/user/actions";
import { RootState } from "../../store/RootState";

import "./UserDisplay.less";

interface ConnectedProps {
  currentUser: firebase.User | undefined;
}

class UserDisplay extends React.PureComponent<ConnectedProps, {}> {
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
    let content: JSX.Element;
    if (this.props.currentUser == null) {
      content = (
        <MenuItem onClick={signIn} text="Log In" />
      );
    } else {
      content = (
        <>
          <li className="menu-user-info">
            <div className="menu-user-name">{this.props.currentUser.displayName}</div>
            <div className="menu-user-email">{this.props.currentUser.email}</div>
          </li>
          <MenuDivider />
          <MenuItem onClick={signOut} text="Log Out" />
        </>
      );
    }
    return (
      <Menu className="sign-in-wrapper">
        {content}
      </Menu>
    );
  }

  private renderUserIcon(): JSX.Element {
    if (this.props.currentUser && this.props.currentUser.photoURL) {
      return <img className="user-display" width={40} height={40} src={this.props.currentUser.photoURL} />;
    } else {
      return <Icon className="user-display" icon="user" iconSize={36} tagName="div" />;
    }
  }
}

function mapStateToProps(state: RootState): ConnectedProps {
  return {
    currentUser: state.user.currentUser,
  };
}

export const ConnectedUserDisplay = connect<ConnectedProps, {}, {}>(mapStateToProps, null)(UserDisplay);
