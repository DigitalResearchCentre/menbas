import Immutable from 'immutable';

const initialState = Immutable.fromJS({
  user: null,
  files: [],
  configs: [],
  selectedFile: null,
  selectedConfig: null,
  showUploadCSVModal: false,
  showEditCSVModal: false,
});

export default initialState;
