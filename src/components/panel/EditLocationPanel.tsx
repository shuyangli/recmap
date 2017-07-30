import * as React from 'react';
import * as _ from 'lodash';
import { connect, Dispatch } from 'react-redux';
import { Button, Intent, Spinner, Tag } from '@blueprintjs/core';
import { Location } from '../../api/interfaces';
import { getCurrentLocation } from '../../api/MapsApi';
import { RootState } from '../../store/store';
import {
  toggleEditPanel,
  toggleDetailsPanel,
  closePanel,
  createOrUpdateLocation,
  deleteLocation
} from '../../store/actions';

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
  dirtyTag: string;
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
    dirtyTag: '',
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
  }

  private cancelEdit = () => this.props.onCancel(this.state.location.id);
  private saveEdit = () => this.props.onSave(this.state.location, this.props.initialLocation);
  private deleteLocation = () => this.props.onDelete(this.state.location.id);

  private onAddTag = () => {
    this.setState({
      location: Object.assign({}, this.state.location, {
        tags: _.concat(this.state.location.tags, this.state.dirtyTag)
      })
    });
  }

  private onDeleteTag = (tag: string) => {
    this.setState({
      location: Object.assign({}, this.state.location, {
        tags: this.state.location.tags.filter((existingTag) => existingTag !== tag)
      })
    });
  }

  render() {
    return (
      <div className='location-panel'>

        <div className='location-content-wrapper'>
          <input
            className='pt-input pt-fill location-name'
            value={this.state.location.name}
            ref={(element) => this.nameInput = element}
            placeholder='Name'
            onChange={(event) => this.setState({
              location: Object.assign({}, this.state.location, {
                name: event.target.value
              })
            })}
          />
          <input
            className='pt-input pt-fill location-tag-input'
            value={this.state.dirtyTag}
            placeholder='Add tags'
            onChange={(event) => this.setState({ dirtyTag: event.target.value })}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                this.onAddTag();
                this.setState({ dirtyTag: '' });
              }
            }}
          />
          <div className='location-tag-area'>
            {this.state.location.tags.map((tag: string) =>
              <Tag key={tag} onRemove={() => this.onDeleteTag(tag)}>{tag}</Tag>
            )}
          </div>
          <input
            className='pt-input pt-fill location-address'
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
            className='pt-input pt-fill location-notes'
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

        <div className='panel-edit-controls pt-elevation-1'>
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
