export default interface connectMessage{
    type: string;
    data: {
        aliasPLayer: string | null,
        idPlayer?: string,
        roomId?: number,
        roomPassword?: string
    }
}