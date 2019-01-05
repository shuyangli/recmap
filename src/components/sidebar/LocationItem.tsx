import { H5 } from "@blueprintjs/core";
import * as React from "react";
import { connect } from "react-redux";

import { Location } from "../../api/interfaces";
import { LocationTags, RatingAndPrice } from "../shared";
import { ToggleDetailPanel } from "../../store/actionPanel/actions";
import { centerMapAroundLocation } from "../../store/locations/actions";
import { TypedDispatch } from "../../store/TypedDispatch";

import "./LocationItem.less";

interface OwnProps {
  location: Location;
}

interface DispatchProps {
  getOpenDetailsPanel: (locationId: string) => void;
  centerMapAroundLocation: (locationId: string) => void;
}

class LocationItem extends React.PureComponent<OwnProps & DispatchProps, {}> {
  render() {
    const { location } = this.props;
    return (
      <div className="location-item" onClick={this.openDetailsPanel}>
        <H5 className="location-name">{location.name}</H5>
        <RatingAndPrice
          rating={location.computedRating}
          foodPrice={location.computedFoodPrice}
          drinkPrice={location.computedDrinkPrice}
        />
        <LocationTags tags={location.tags} showNumberOfTags={2} />
      </div>
    );
  }

  private openDetailsPanel = () => {
    this.props.getOpenDetailsPanel(this.props.location.id);
    this.props.centerMapAroundLocation(this.props.location.id);
  }
}

function mapDispatchToProps(dispatch: TypedDispatch): DispatchProps {
  return {
    getOpenDetailsPanel: (locationId: string) => dispatch(ToggleDetailPanel.create({ locationId })),
    centerMapAroundLocation: (locationId: string) => dispatch(centerMapAroundLocation(locationId)),
  };
}

export const ConnectedLocationItem = connect(null, mapDispatchToProps)(LocationItem);
