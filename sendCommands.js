var sendCommandToClient = (client, command) => {
  client.emit(command);
}
