export interface IWordDto {
  id?: number;
  word?: string;
  transcription?: string;
  translations?: string[];
  speech_part_id?: number;
  gender_id?: number;
  forms?: string[];
  original_language_id?: number;
  translated_language_id?: number;
  remarks?: string;
  stress_letter_index?: number;
  word_set_id?: number;
  user_created_id?: number;
  threshold?: number;
  times_in_exercise?: number;
}
