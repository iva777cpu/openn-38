export interface ProfileState {
  [key: string]: string;
  userAge: string;
  userGender: string;
  impression: string;
  relationship: string;
  targetAge: string;
  targetGender: string;
  targetPersonality: string;
  mood: string;
  origin: string;
  loves: string;
  dislikes: string;
  hobbies: string;
  books: string;
  music: string;
  humor: string;
  zodiac: string;
  mbti: string;
  style: string;
  situation: string;
  previousTopics: string;
}

export const emptyProfile: ProfileState = {
  userAge: "",
  userGender: "",
  impression: "",
  relationship: "",
  targetAge: "",
  targetGender: "",
  targetPersonality: "",
  mood: "",
  origin: "",
  loves: "",
  dislikes: "",
  hobbies: "",
  books: "",
  music: "",
  humor: "",
  zodiac: "",
  mbti: "",
  style: "",
  situation: "",
  previousTopics: "",
};