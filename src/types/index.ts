export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
}

export interface Post {
  id: string;
  content: string;
  author: string;
  createdAt: any;
}

export interface Skill {
  id: string;
  name: string;
}