/* file table schema on state. multiple wallets/wallets are supported.
wallets:{
  [walletId]:{
    [allocationId]: [{ 
      "name":"/",
      "path":"/",
      "type":"d",
      "size":840039,
      "num_blocks":35,
      "lookup_hash":"d7e465694eedf101a5e928d9821491213c262f1db397bddc4b8e89dac4651b89",
      "encryption_key":"",
      "actual_size":0,
      "actual_num_blocks":0,
      "created_at":1660273336,
      "updated_at":1660346924,
      "list":[]
      "parent_path":"",
      }]
  }
}
*/

const initialState = {
  allFiles: [],
  filesStats: {
    // [fileId]: [{}, {}, {}, {}],
  },
  allocationsFilesMap: {
    // This is a map to allow the UI to immediate show files in a path,
    // while fresh content is being updated on the background.
    // The shape follows this format:
    // [allocationIdHash]: {
    //   [path]: [],
    // }
  },
  foldersMap: {},
  filesMap: {},
  wallets: {},
  filesLoading: false,
  isSearchingFiles: false,
  filesOps: [
    // {
    //   operation: '', // upload, download, delete, etc.
    //   fileId: '',
    //   fileName: '',
    //   status: '', // e.g. success, error, loading
    //   message: '', // e.g. 'File uploaded successfully'
    // },
  ],
  multiSelect: {
    multiSelectionEnabled: false,
    selectedFiles: [], // id, id, id
  },
  currentPath: '/',
  currentPathFiles: [],
  privateLinks: {
    // [fileId]: [{authTicket: '', phoneNumber: '', link: '', expireAt: '', availableAfter: ''}],
  },
  effects: [],
  effectedFiles: [],
  tempImageUrls: {
    // [fileId]: 'blob:localhost:3000/1234-1234-1234-1234',
  },
  thumbnails: {
    // [fileId]: 'blob:localhost:3000/1234-1234-1234-1234',
  },
  videoLoadings: {
    // [fileId]: true,
  },
  privateSharedFiles: [],
  allPrivateSharedFiles: [],
  publicSharedFiles: [],
  allPublicSharedFiles: [],
  downloadLoadings: [
    // {
    //   fileId: '',
    //   isDownloading: false,
    //   progress: 0,
    // },
  ],
}

export default initialState
