export default interface connectMessage{
    type: string;
    data: {
        idPlayer: string,
        idRoom: number
    }
}