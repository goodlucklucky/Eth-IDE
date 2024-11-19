const { IpcChannel } = require('@goodlucklucky/ipc')
const FileOpsChannel = require('@goodlucklucky/file-ops')
const KeypairManager = require('@goodlucklucky/keypair')
const { AutoUpdate } = require('@goodlucklucky/global')
const CompilerManager = require('@goodlucklucky/eth-compiler')
const { InstanceManager } = require('@goodlucklucky/eth-network')
const ProjectChannel = require('@goodlucklucky/eth-project')
const { SdkChannel } = require('@goodlucklucky/eth-sdk')
const AuthChannel = require('@goodlucklucky/auth')

let ipcChannel, fileOpsChannel, keypairManager, autoUpdate, compilerManager, instanceManager, projectChannel, sdkChannel, authChannel
module.exports = function () {
  ipcChannel = new IpcChannel()
  fileOpsChannel = new FileOpsChannel()
  keypairManager = new KeypairManager(process.env.PROJECT)
  autoUpdate = new AutoUpdate('https://app.goodlucklucky.io/api/v1/check-update/eth/')
  compilerManager = new CompilerManager()
  instanceManager = new InstanceManager()
  projectChannel = new ProjectChannel()
  sdkChannel = new SdkChannel(keypairManager)
  authChannel = new AuthChannel()
}
