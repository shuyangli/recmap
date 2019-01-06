import * as React from "react";
import { connect } from "react-redux";
import { Icon, Popover, Menu, MenuItem } from "@blueprintjs/core";
import { RootState } from "../../store/RootState";
import { currentPositionSelector, presetPositionsSelector } from "../../store/locations/selectors";
import { TypedDispatch } from "../../store/TypedDispatch";
import { setCurrentPosition, setCurrentPositionToGeolocation } from "../../store/locations/actions";
import { PositionWithMetadata } from "../../api/interfaces";

import "./CurrentPositionControl.less";

interface ConnectedProps {
  currentPosition: PositionWithMetadata;
  presetPositions: PositionWithMetadata[];
}

interface DispatchProps {
  setCurrentPosition: (position: PositionWithMetadata) => void;
  setCurrentPositionToGeolocation: () => void;
}

type CurrentPositionControlProps = ConnectedProps & DispatchProps;

class CurrentPositionControl extends React.PureComponent<CurrentPositionControlProps, never> {
  render() {
    return (
      <Popover
        content={this.renderPopoverContent()}
        target={this.renderCurrentPositionDisplay()}
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
    const presetLocations = this.props.presetPositions.map((pos) =>
      <MenuItem key={pos.name} text={pos.name} onClick={this.getSetCurrentPosition(pos)} />,
    );
    return (
      <Menu className="current-position-select">
        <MenuItem text="Current Location" onClick={this.props.setCurrentPositionToGeolocation} />
        {presetLocations}
      </Menu>
    );
  }

  private renderCurrentPositionDisplay(): JSX.Element {
    return (
      <div className="current-position-display">
        <Icon iconSize={16} icon="geolocation" />
        {this.props.currentPosition ? this.props.currentPosition.name : "Current Location"}
      </div>
    );
  }

  private getSetCurrentPosition = (pos: PositionWithMetadata) => () => this.props.setCurrentPosition(pos);
}

function mapStateToProps(state: RootState): ConnectedProps {
  return {
    currentPosition: currentPositionSelector(state),
    presetPositions: presetPositionsSelector(state),
  };
}

function mapDispatchToProps(dispatch: TypedDispatch): DispatchProps {
  return {
    setCurrentPosition: (position: PositionWithMetadata) => dispatch(setCurrentPosition(position)),
    setCurrentPositionToGeolocation: () => dispatch(setCurrentPositionToGeolocation()),
  };
}

export const ConnectedCurrentPositionControl = connect(mapStateToProps, mapDispatchToProps)(CurrentPositionControl);
