const initialState = {
  user: null,
  files: [],
  configs: [],
  selectedFile: null,
  selectedConfig: {
    config: {
      year: '',
    },
    data: {
      places: {},
      years: {},
      abbrs: {},
      objects: [],
    },
  },
  showUploadCSVModal: false,
  showEditCSVModal: false,
};

export default initialState;
