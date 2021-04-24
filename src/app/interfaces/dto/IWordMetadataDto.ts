export interface IWordMetadataDto {
  speechParts: {id: number, title: string}[],
  genders: {id: number, title: string}[],
  languages: {id: number, title: string}[],
}
