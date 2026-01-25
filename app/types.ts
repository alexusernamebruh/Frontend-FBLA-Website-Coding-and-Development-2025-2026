enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

interface IUser {
  id: number;
  name: string;
  email: string;
  password?: string;
  submissions: ISubmission[];
  claims: IClaimForm[];
  sentMessages: IMessage[];
  chats: IChat[];
  createdItems: IItem[];
}

interface IItem {
  id: number;
  itemName: string;
  description: string;
  photos: IPhoto[];
  authorId: number;
  author: IUser;
  createdAt: Date;
  claimed: boolean;
  claims: IClaimForm[];
}

interface IPhoto {
  id: number;
  data: Buffer;
  createdAt: Date;
  itemId?: number;
  item?: IItem;
  submissionFormId: number;
  submissionForm: ISubmission;
}

interface ISubmission {
  id: number;
  userId: number;
  user: IUser;
  itemName: string;
  description: string;
  photos: IPhoto[];
  createdAt: Date;
  approvalStatus: ApprovalStatus;
}

interface IClaimForm {
  id: number;
  userId: number;
  user: IUser;
  itemId: number;
  item: IItem;
  comment: string;
  createdAt: Date;
  isOpen: boolean;
}

interface IChat {
  id: number;
  participants: IUser[];
  title: string;
  messages: IMessage[];
  createdAt: Date;
  item: IItem;
  itemId: number;
}

interface IMessage {
  id: number;
  senderId: number;
  sender: IUser;
  content: string;
  createdAt: Date;
  chat: IChat[];
}
