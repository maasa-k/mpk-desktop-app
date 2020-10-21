import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { Typography } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useDispatch } from 'react-redux';

import { updateCard } from '../../features/board/boardSlice';
import { isBlank } from '../../utils/stringUtils';
import { Tag } from '../../model/board';
import { Card } from '../../model/cards';

interface EditCardDialogProperties {
  card: Card;
  open: boolean;
  onClose: () => void;
  tags: Record<string, Tag>;
}

export default function EditCardDialog(props: EditCardDialogProperties) {
  const dispatch = useDispatch();
  const { card, open, onClose, tags } = props;

  const [title, setTitle] = React.useState(card.title);
  const [titleError, setTitleError] = React.useState(false);
  const [description, setDescription] = React.useState(card.description);
  const [cardTags, setCardTags] = React.useState(card.tags);

  const titleChanged = (event) => {
    if (isBlank(event.target.value)) {
      setTitleError(true);
    } else {
      setTitleError(false);
    }
    setTitle(event.target.value);
  };

  const descriptionChanged = (event) => {
    setDescription(event.target.value);
  };

  const performUpdate = (event) => {
    event.preventDefault();
    if (!isBlank(title)) {
      dispatch(updateCard({ cardId: card.id, title, description, cardTags }));
      onClose();
    } else {
      setTitleError(true);
    }
  };

  const handleTagsChanged = (event, value) => {
    setCardTags(value.map((tag: Tag) => tag.id));
  };

  const lastModified = card?.lastModified
    ? new Date(card.lastModified).toLocaleString()
    : 'Not tracked yet';

  const tagIdsToTags = (ids: Array<string>): Array<Tag> => {
    if (ids) {
      return ids.map((id) => tags[id]);
    }
    return [];
  };

  return (
    <Dialog
      open={open}
      aria-labelledby="form-dialog-title"
      fullWidth
      onClose={onClose}
    >
      <form onSubmit={performUpdate}>
        <DialogTitle id="form-dialog-title">Edit card</DialogTitle>
        <DialogContent>
          <DialogContentText>Edit card details.</DialogContentText>
          <div style={{ marginTop: '10px' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Card title"
              label="Title"
              onChange={titleChanged}
              value={title}
              error={titleError}
              required
              helperText="Card title can't be empty"
            />
          </div>
          <div style={{ marginTop: '10px' }}>
            <TextField
              fullWidth
              variant="outlined"
              multiline
              placeholder="Description"
              rows={4}
              label="Description"
              onChange={descriptionChanged}
              value={description}
            />
          </div>
          <div style={{ marginTop: '10px' }}>
            <Autocomplete
              multiple
              id="tags-outlined"
              options={Object.values(tags)}
              getOptionLabel={(tag: Tag) => tag.name}
              filterSelectedOptions
              onChange={handleTagsChanged}
              value={tagIdsToTags(cardTags)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Tags"
                  placeholder="Tags"
                />
              )}
            />
          </div>
          <div>
            <Typography variant="caption">
              Last changed on:&nbsp;
              {lastModified}
            </Typography>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary" variant="contained">
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
