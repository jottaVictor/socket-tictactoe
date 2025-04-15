export enum PlayerReference{
    self = "self",
    opponent = "opponent"
}

export default interface EditRoomMessage{
    type: string;
    data: {
        game: {
            timeLimitByPlayer: number | null,
            firstPlayer: PlayerReference
        },
        room: {
            ownerPlayer: PlayerReference
            isPublic: boolean,
            password: string
        }
    }
}