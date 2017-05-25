import * as React from 'react';
import * as _ from 'lodash';
import { connect, Dispatch } from 'react-redux';
import { Button, Intent, Spinner, Tag } from '@blueprintjs/core';
import { Location } from '../../api/interfaces';
import { RootState } from '../../store/store';
import { toggleEditPanel, toggleDetailsPanel, createOrUpdateLocation } from '../../store/actions';

interface OwnProps {
  initialLocation?: Location;
}

interface DispatchProps {
  onCancel: (locationId?: string) => void;
  onSave: (location: Location, initialLocation?: Location) => void;
}

function mapDispatchToProps(dispatch: Dispatch<RootState>): DispatchProps {
  return {
    onCancel: (locationId?: string) => {
      if (locationId !== undefined) {
        dispatch(toggleDetailsPanel(locationId))
      } else {
        dispatch(toggleEditPanel())
      }
    },
    onSave: (location: Location, initialLocation?: Location) => {
      dispatch(createOrUpdateLocation(location, initialLocation))
      .then((action) => dispatch(toggleDetailsPanel(action.payload.location.id)))
    }
  };
}

interface State {
  location: Location;
  dirtyTag: string;
  isSaving: boolean;
}

const EMPTY_STATE: State = {
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

class EditLocationPanel extends React.PureComponent<OwnProps & DispatchProps, State> {

  state: State = EMPTY_STATE;

  componentWillMount() {
    if (this.props.initialLocation) {
      this.setState({ location: Object.assign({}, this.props.initialLocation) });
    }
  }

  private onCancel = () => this.props.onCancel(this.state.location.id);

  private onSave = () => {
    this.props.onSave(this.state.location, this.props.initialLocation);
  }

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
            placeholder='Name'
            onChange={(event) => this.setState(
              {
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
            onChange={(event) => this.setState(
              {
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
          <Button text='Cancel' onClick={this.onCancel} />
          <Button text='Save' intent={Intent.SUCCESS} onClick={this.onSave} />
        </div>
      </div>
    );
  }
}

export const ConnectedEditLocationPanel: React.ComponentClass<OwnProps> =
  connect(null, mapDispatchToProps)(EditLocationPanel) as any;
