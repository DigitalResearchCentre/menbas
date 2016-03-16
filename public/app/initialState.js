const initialState = {
  user: null,
  files: [],
  configs: [],
  selectedFile: null,
  selectedConfig: {
    config: {},
    data: [],
  },
  showUploadCSVModal: false,
  showEditCSVModal: false,
  viewer: {
    config: null,
    data: null,
  }
};

export default initialState;
