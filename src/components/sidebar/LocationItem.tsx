import { H5 } from "@blueprintjs/core";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";

import { Location } from "../../api/interfaces";
import { LocationRating, LocationTags } from "../shared";
import { ToggleDetailPanel } from "../../store/actionPanel/actions";

import "./LocationItem.less";
import { getPriceRangeText } from "../shared/getPriceRangeText";

interface OwnProps {
  location: Location;
}

interface DispatchProps {
  getOpenDetailsPanel: (locationId: string) => void;
}

class LocationItem extends React.PureComponent<OwnProps & DispatchProps, {}> {
  render() {
    const { location } = this.props;
    return (
      <div className="location-item" onClick={this.openDetailsPanel}>
        <H5 className="location-name">{location.name}</H5>
        <div className="location-rating-and-price">
          <LocationRating rating={location.rating} />
          <div className="location-price-range">{getPriceRangeText(location.priceRange)}</div>
        </div>
        <LocationTags tags={location.tags} showNumberOfTags={2} />
      </div>
    );
  }

  private openDetailsPanel = () => {
    this.props.getOpenDetailsPanel(this.props.location.id);
  }
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    getOpenDetailsPanel: (locationId: string) => dispatch(ToggleDetailPanel.create({ locationId })),
  };
}

export const ConnectedLocationItem = connect(null, mapDispatchToProps)(LocationItem);
