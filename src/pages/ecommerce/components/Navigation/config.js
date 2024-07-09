import CustomAPIConnector from './CustomConnector';

const connector = new CustomAPIConnector({
  host: "http://127.0.0.1:16000",
  apiKey: "sdfsfsdf"
});

export const config = {
  alwaysSearchOnInitialLoad: false,
  trackUrlState: false,
  autocompleteQuery: {
  
  },
  apiConnector: connector
};

