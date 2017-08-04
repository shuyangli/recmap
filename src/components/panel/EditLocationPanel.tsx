import * as React from 'react';
import * as _ from 'lodash';
import * as classNames from 'classnames';
import { connect, Dispatch } from 'react-redux';
import * as Select from 'react-select';
import { Button, Classes, Intent, Spinner, Tag } from '@blueprintjs/core';
import { Location } from '../../api/interfaces';
import { backendApi } from '../../api/BackendApi';
import { getCurrentLocation } from '../../api/MapsApi';
import { RootState } from '../../store/store';
import { toggleEditPanel, toggleDetailsPanel, closePanel } from '../../store/actionPanel/actions';
import { createOrUpdateLocation, deleteLocation } from '../../store/locations/actions';

interface OwnProps {
  initialLocation?: Location;
}

interface DispatchProps {
  onCancel: (locationId?: string) => void;
  onSave: (location: Location, initialLocation?: Location) => void;
  onDelete: (locationId: string) => void;
}

interface State {
  location: Location;
  allTags: string[];
  isSaving: boolean;
}

class EditLocationPanel extends React.PureComponent<OwnProps & DispatchProps, State> {
  state: State = {
    location: {
      name: '',
      address: '',
      latitude: '',
      longitude: '',
      notes: '',
      tags: []
    },
    allTags: [],
    isSaving: false
  };

  private nameInput: HTMLInputElement;
  private addressInput: HTMLInputElement;
  private geocodeAutocomplete: any;
  private establishmentAutocomplete: any;

  componentWillMount() {
    if (this.props.initialLocation) {
      this.setState({ location: Object.assign({}, this.props.initialLocation) });
    }
  }

  componentDidMount() {
    // hack for loading google maps dependency in-browser
    const google = (window as any).google;

    this.geocodeAutocomplete = new google.maps.places.Autocomplete(this.addressInput, {
      types: ['geocode']
    });
    this.geocodeAutocomplete.addListener('place_changed', () => {
      console.log(this.geocodeAutocomplete.getPlace());
    });

    this.establishmentAutocomplete = new google.maps.places.Autocomplete(this.nameInput, {
      types: ['establishment']
    });
    this.establishmentAutocomplete.addListener('place_changed', () => {
      console.log(this.establishmentAutocomplete.getPlace());
    });

    getCurrentLocation().then(position => {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      const circle = new google.maps.Circle({
        center: location,
        radius: position.coords.accuracy
      });

      this.geocodeAutocomplete.setBounds(circle.getBounds());
      this.establishmentAutocomplete.setBounds(circle.getBounds());
    });

    backendApi.getAllTags().then(allTags => this.setState({ allTags }));
  }

  private cancelEdit = () => this.props.onCancel(this.state.location.id);
  private saveEdit = () => this.props.onSave(this.state.location, this.props.initialLocation);
  private deleteLocation = () => this.props.onDelete(this.state.location.id);

  private onTagsChanged = (tags: string[]) => {
    this.setState({
      location: Object.assign({}, this.state.location, { tags })
    });
  }

  private getSelectOptions = (rawStrings: string[]): Select.Option<string>[] => {
    return rawStrings.map(tag => ({
      label: tag,
      value: tag
    }));
  }

  render() {
    return (
      <div className='location-panel'>

        <div className='location-content-wrapper'>
          <input
            className={classNames(Classes.INPUT, Classes.FILL, 'location-name')}
            value={this.state.location.name}
            ref={(element) => this.nameInput = element}
            placeholder='Name'
            onChange={(event) => this.setState({
              location: Object.assign({}, this.state.location, {
                name: event.target.value
              })
            })}
          />
          <Select.Creatable
            backspaceToRemoveMessage=""
            multi={true}
            options={this.getSelectOptions(this.state.allTags)}
            value={this.getSelectOptions(this.state.location.tags)}
            placeholder='Add tags'
            onChange={(values: Select.Option<string>[]) => this.onTagsChanged(values.map(value => value.value))}
          />
          <input
            className={classNames(Classes.INPUT, Classes.FILL, 'location-address')}
            value={this.state.location.address}
            placeholder='Address'
            ref={(element) => this.addressInput = element}
            onChange={(event) => this.setState({
              location: Object.assign({}, this.state.location, {
                address: event.target.value
              })
            })}
          />
          <textarea
            className={classNames(Classes.INPUT, Classes.FILL, 'location-notes')}
            value={this.state.location.notes}
            placeholder='Notes'
            onChange={(event) => this.setState(
              {
                location: Object.assign({}, this.state.location, {
                  notes: event.target.value
                })
              })}
          />
        </div>

        <div className={classNames(Classes.ELEVATION_1, 'panel-edit-controls')}>
          <Button text='Cancel' onClick={this.cancelEdit} />
          <Button text='Save' intent={Intent.SUCCESS} onClick={this.saveEdit} />
          {this.state.location.id && <Button text='Delete' intent={Intent.DANGER} onClick={this.deleteLocation} />}
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<RootState>): DispatchProps {
  return {
    onCancel: (locationId?: string) =>
      dispatch(locationId
        ? toggleDetailsPanel(locationId)
        : toggleEditPanel()),

    onSave: (location: Location, initialLocation?: Location) =>
      dispatch(createOrUpdateLocation(location, initialLocation))
      .then((action) => dispatch(toggleDetailsPanel(action.payload.location.id))),

    onDelete: (locationId: string) =>
      dispatch(deleteLocation(locationId))
      .then(() => dispatch(closePanel()))
  };
}

export const ConnectedEditLocationPanel: React.ComponentClass<OwnProps> =
  connect(null, mapDispatchToProps)(EditLocationPanel);
