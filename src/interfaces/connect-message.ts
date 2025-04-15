export default interface ConnectMessage{
    type: string;
    data: {
        createRoom: boolean,
        idPlayer: string,
        aliasPlayer: string,
        idRoom?: string,
        roomPassword?: string
    }
}