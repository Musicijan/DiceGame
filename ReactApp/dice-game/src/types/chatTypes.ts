export enum Color {
  blue = "blue",
  green = "green",
  red = "red",
  purple = "purple",
  orange = "orange",
  pink = "pink",
  yellow = "yellow",
  turquoise = "turquoise"
}

export interface ChatState {
  messages: MessageObject[];
}

export interface MessageObject {
  date: string;
  user: string;
  color: string;
  message: string;
}

export const colorOptions: Color[] = [
  Color.blue,
  Color.green,
  Color.red,
  Color.purple,
  Color.orange,
  Color.pink,
  Color.yellow,
  Color.turquoise
]