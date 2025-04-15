export default interface DisconnectMessage{
    type: string;
    data: {
        idPlayer: string,
        idRoom: string
    }
}