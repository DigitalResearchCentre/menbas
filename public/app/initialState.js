const initialState = {
  user: null,
  files: [],
  selectedFile: null,
  selectedConfig: {
    config: {
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
