import { H5, Icon } from "@blueprintjs/core";
import * as React from "react";
import { connect } from "react-redux";

import { Location } from "../../api/interfaces";
import { LocationTags, LocationRating, getFoodPriceText, getDrinkPriceText } from "../shared";
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
        <div className="location-rating-and-price">
          <LocationRating rating={location.computedRating} />
          {location.computedFoodPrice && (
            <>
              <div className="location-middot">·</div>
              <div className="location-price-range">{getFoodPriceText(location.computedFoodPrice)}</div>
            </>
          )}
          {location.computedDrinkPrice && (
            <>
              <div className="location-middot">·</div>
              <div className="location-price-range">
                <Icon className="location-price-icon" iconSize={10} icon="glass" />
                {getDrinkPriceText(location.computedDrinkPrice)}
              </div>
            </>
          )}
        </div>
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
