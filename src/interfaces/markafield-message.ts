export default interface MarkafieldMesssage{
    type: string;
    data: {
        idPlayer: string,
        row: number,
        column: number
    }
}