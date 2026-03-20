export type LogEntry = {
  id: number;
  msg: string;
  type: 'ok' | 'err';
  time: string;
};
