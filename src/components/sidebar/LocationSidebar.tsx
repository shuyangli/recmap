import { Button, NonIdealState, Spinner } from "@blueprintjs/core";
import * as React from "react";
import { connect } from "react-redux";

import { Location } from "../../api/interfaces";
import { ToggleEditPanel } from "../../store/actionPanel/actions";
import { loadLocations } from "../../store/locations/actions";
import { getFilteredLocations } from "../../store/locations/selectors";
import { RootState } from "../../store/store";
import { ConnectedFilterControls } from "./FilterControls";
import { ConnectedLocationItem } from "./LocationItem";

import "./LocationSidebar.less";
import { Dispatch } from "redux";

interface ConnectedProps {
  filteredLocations: Location[];
}

interface DispatchProps {
  openEditPanel: () => void;
  loadLocations: () => Promise<any>;
}

interface State {
  isLoadingLocations: boolean;
}

class LocationSidebar extends React.PureComponent<ConnectedProps & DispatchProps, State> {
  state: State = {
    isLoadingLocations: false,
  };

  componentWillMount() {
    this.setState({ isLoadingLocations: true });
    this.props.loadLocations()
    .then(() => this.setState({ isLoadingLocations: false }));
  }

  render() {
    return (
      <div className="location-sidebar">
        <ConnectedFilterControls />
        {
          this.state.isLoadingLocations
          ? <NonIdealState icon={<Spinner />} />
          : <div className="location-items-wrapper">
              {this.props.filteredLocations.map((location) =>
                <ConnectedLocationItem key={location.id} location={location} />,
              )}
            </div>
        }
        <div className="sidebar-edit-controls">
          <Button icon="add" onClick={this.props.openEditPanel} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: RootState): ConnectedProps {
  return {
    filteredLocations: getFilteredLocations(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    openEditPanel: () => dispatch(ToggleEditPanel.create({})),
    loadLocations: () => dispatch(loadLocations()),
  };
}

export const ConnectedLocationSidebar = connect(mapStateToProps, mapDispatchToProps)(LocationSidebar);
