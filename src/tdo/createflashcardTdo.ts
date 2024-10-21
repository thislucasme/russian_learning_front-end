// src/users/dto/create-user.dto.ts

export class CreateFlashcardTdo {
  front?: string;
  back?: string;
  interval?: number;
  repetition?: number;
  efactor?: number;
  dueDate?: Date;
  conversationId?: string;
  from?: string;
  userId?: string;
  createdAt?: Date;
  audioId?: string;
  _id?:string
}
